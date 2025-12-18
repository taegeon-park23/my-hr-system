# **심층 요구사항 명세서: 정책 및 권한 엔진 (SPEC-06)**

## **0. 문서 이력 (Version History)**

| 버전 | 일자 | 작성자 | 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-12-18 | System | 최초 작성 | 데이터 스코프 계산 및 동적 권한(티켓) 발급 로직 정의 |

## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 **정책(Policy) 및 권한(AuthZ)** 모듈의 핵심인 **데이터 접근 범위(Data Scope)** 산정 로직과 **임시 접근권(Access Grant Ticket)** 발급 메커니즘을 정의한다.
단순 RBAC(Role-Based Access Control)를 넘어, 상황(Context)과 리소스(Resource)에 따라 동적으로 변하는 권한 제어를 목표로 한다.

### **1.2 범위**
* **Data Scope:** 사용자 Role 및 요청 Context에 따른 쿼리 필터(`WHERE` 절조건) 도출.
* **Access Grant:** 결재 승인, 위임 등으로 발생하는 한시적 접근 권한 관리.

---

## **2. 핵심 결정 테이블 (Decision Table)**

### **2.1 데이터 접근 범위 결정 테이블 (Scope Resolution)**

| 규칙 ID | 사용자 Role | 요청 파라미터 (`viewMode`) | 리소스 소유자 | **결정된 Scope** | **적용 필터 (Query Filter)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POL-R1** | **USER** | MY | 본인 | **MY** | `user_id = :currentUserId` |
| **POL-R2** | **USER** | TEAM | - | **DENY** (or TEAM if Leader) | 일반 사용자는 팀 조회 불가 (단, 리더는 가능) |
| **POL-R3** | **LEADER** | TEAM | 본인 팀 | **TEAM** | `dept_id = :myDeptId` |
| **POL-R4** | **TENANT_ADMIN** | COMPANY | - | **COMPANY** | `company_id = :myCompanyId` |
| **POL-R5** | **SUPER_ADMIN** | GLOBAL | - | **GLOBAL** | (No Filter or All Companies) |
| **POL-R6** | ANY | - | 타인 | **Ticket Check** | `AccessGrant` 테이블 조회 (없으면 Deny) |

---

## **3. 핵심 로직 의사 코드 (Pseudo-code)**

### **3.1 접근 권한 및 스코프 계산 (`resolveDataScope`)**

```java
FUNCTION ResolveDataScope(user, resourceType, requestedMode)
    // 1. 기본 Role 기반 검증
    IF user.role == SUPER_ADMIN THEN
        RETURN Scope.GLOBAL
    END IF
    
    IF user.role == TENANT_ADMIN THEN
        RETURN Scope.COMPANY // company_id 필터 자동 적용
    END IF
    
    // 2. 일반 사용자/리더 처리
    IF requestedMode == MY THEN
        RETURN Scope.MY
    ELSE IF requestedMode == TEAM THEN
        IF user.is_leader == True THEN
            RETURN Scope.TEAM // 본인 부서 데이터만
        ELSE
            THROW AuthorizationException("Only leaders can view team data.")
        END IF
    END IF
    
    // 3. 특정 리소스 개별 접근 (Ticket)
    // 리스트 조회가 아닌 단건 조회(Detail) 시 사용
    RETURN Scope.MY // 기본값
END FUNCTION
```

### **3.2 임시 접근권 검증 (`checkAccessGrant`)**

```java
FUNCTION CheckAccessGrant(user, resourceType, resourceId)
    // 1. 영구 권한(Role) 확인
    IF user.hasPermission(resourceType, READ) THEN
        RETURN True
    END IF
    
    // 2. 임시 티켓(Ticket) 조회
    // 유효기간(expires_at)이 남았고, active 상태인 티켓이 있는지 확인
    ticket = grantRepository.findValidTicket(user.id, resourceType, resourceId)
    
    IF ticket IS NOT NULL THEN
        RETURN True
    END IF
    
    RETURN False
END FUNCTION
```

---

## **4. 엣지 케이스 및 예외 처리 (Edge Cases)**

| 상황 | 설명 | 처리 방침 |
| --- | --- | --- |
| **권한 위임 (Delegation)** | 팀장이 휴가 중 대리인에게 권한 위임 | `Delegation` 테이블을 통해 기간 한정 `Role` 부여 or `TEAM` Scope 허용. |
| **티켓 만료** | 결재 상세 조회 중 티켓 만료 시간 경과 | **403 Forbidden** 반환. (사용자 경험을 위해 만료 임박 시 갱신 로직 고려 가능) |
| **퇴사자 데이터 접근** | 이미 퇴사한 직원의 급여 데이터 조회 | **Tenant Admin** 이상만 가능. 일반 Leader는 퇴사자 포함 조회 옵션(`includeRetired`) 명시 필요. |

## **5. 데이터 모델 참조**

* **AccessGrant:** `grantee_id`, `resource_type`, `resource_id`, `expires_at`, `status`
* **RolePermission:** `role`, `resource`, `action` (READ, WRITE)
