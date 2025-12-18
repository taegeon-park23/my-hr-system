# **심층 요구사항 명세서: 대시보드 및 리포팅 (SPEC-11)**

## **0. 문서 이력 (Version History)**

| 버전 | 일자 | 작성자 | 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-12-18 | System | 최초 작성 | 통계 집계 로직 및 위젯별 권한 제어 정의 |

## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 HR 데이터를 시각화하여 제공하는 **대시보드(Dashboard)** 및 **통계(Analytics)** 모듈의 로직을 정의한다.
실시간 데이터 조회보다는 성능을 고려한 **집계(Aggregation)** 로직과, 민감 정보 노출을 방지하기 위한 위젯 단위의 보안 정책을 명세한다.

### **1.2 범위**
* **개인 대시보드:** 나의 휴가, 급여, 근태 현황 요약.
* **관리자 대시보드:** 부서/전사 인원 현황, 휴가 사용률, 야근 통계.
* **리포트:** 엑셀 다운로드 및 정기 리포트 생성.

---

## **2. 핵심 결정 테이블 (Decision Table)**

### **2.1 위젯별 데이터 조회 권한 (Truth Table)**

| 위젯 ID | 위젯 데이터 | 사용자 Role | 조회 Scope | **노출 여부** | **비고** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **W-MY-01** | 내 잔여 연차 | ANY | MY | **Allow** | 본인 데이터 |
| **W-TEAM-01**| 팀 근태 현황 | **LEADER** | TEAM | **Allow** | 팀장은 본인 팀 조회 가능 |
| **W-TEAM-01**| 팀 근태 현황 | MEMBER | TEAM | **Deny** | 일반 팀원 불가 |
| **W-COMP-01**| 전사 인원 통계 | **TENANT_ADMIN** | COMPANY | **Allow** | 테넌트 관리자 전용 |
| **W-COMP-02**| 전사 급여 총액 | **TENANT_ADMIN** | COMPANY | **Deny** | *최고 권한자(Super)만 가능하거나 별도 권한 필요* |

---

## **3. 핵심 로직 의사 코드 (Pseudo-code)**

### **3.1 부서별 휴가 사용률 집계 (`aggVacationUsage`)**

실시간 쿼리 부하를 줄이기 위해 배치(Batch) 혹은 Materialized View 사용을 권장하는 로직이다.

```java
FUNCTION AggregateVacationUsage(companyId, year)
    // 1. 대상 부서 및 인원 조회
    depts = deptRepository.findAllByCompany(companyId)
    stats = []
    
    FOR dept IN depts:
        employees = empRepository.findByDept(dept.id)
        totalDays = 0
        usedDays = 0
        
        // 2. 부서원별 합산 (재귀 호출 없이 단순 합산)
        FOR emp IN employees:
            balance = vacationBalanceRepository.findByUserAndYear(emp.id, year)
            totalDays += balance.total_days
            usedDays += balance.used_days
        
        // 3. 통계 객체 생성
        usageRate = (usedDays / totalDays) * 100
        stats.add({
            deptName: dept.name,
            totalMembers: employees.size(),
            avgUsageRate: usageRate
        })
        
    RETURN stats
END FUNCTION
```

---

## **4. 엣지 케이스 및 예외 처리**

| 상황 | 설명 | 처리 방침 |
| --- | --- | --- |
| **데이터 부족** | 신규 입사자나 신설 부서라 통계 데이터가 0인 경우 | **"집계 중"** 또는 **"-"** 로 표시 (0%와 구분 필요). |
| **캐시 지연** | 어제 휴가 쓴 내역이 대시보드에 미반영 | 통계성 위젯은 `Last Updated: HH:mm` 표시 후 캐싱 허용 (최대 1시간). 본인 현황은 실시간. |
| **퇴사자 포함 여부** | 연간 통계 시 퇴사자 데이터를 포함할지 | 기본적으로 **포함** (해당 연도에 근무했으므로). 옵션으로 제외 가능. |

## **5. 데이터 모델 참조**

* **DashboardConfig:** `user_id`, `layout_json` (위젯 배치 정보)
* **WidgetDef:** `id`, `name`, `data_source_url`, `required_permission`
