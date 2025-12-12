# **보안 정책 매트릭스 (Security Policy Matrix)**

## **1\. 개요**

본 문서는 HR 시스템의 접근 제어(Access Control) 규칙을 정의한다. 본 시스템은 **멀티 테넌트(Multi-Tenant)** 구조를 가지며, 각 테넌트(계열사/고객사) 간 데이터는 엄격히 격리되어야 한다. 단, 시스템 전체 관리자(Super Admin)는 모든 테넌트의 데이터에 접근할 수 있다.

## **2\. 역할(Role) 및 스코프(Scope) 정의**

### **2.1 사용자 역할 (Roles)**

| 역할 코드 | 명칭 | 설명 | 비고 |
| :---- | :---- | :---- | :---- |
| **SUPER\_ADMIN** | 전체 관리자 | 시스템 운영자. 모든 테넌트(Company)와 모든 데이터에 접근 가능. | 플랫폼 운영팀 |
| **TENANT\_ADMIN** | 테넌트 관리자 | 특정 계열사(Company)의 최고 관리자. 본인 회사의 데이터만 접근 가능. | 계열사 인사팀장 |
| **DEPT\_MANAGER** | 부서장 | 특정 부서의 리더. 본인 및 하위 부서원의 데이터 접근 가능. | 팀장/본부장 |
| **USER** | 일반 사용자 | 본인의 데이터만 접근 가능. | 일반 임직원 |

### **2.2 데이터 조회 범위 (Data Scope)**

Policy 모듈이 반환하는 DataScope 타입 정의.

| 스코프 타입 | 의미 | SQL 필터링 예시 |
| :---- | :---- | :---- |
| **GLOBAL\_ALL** | 전체 데이터 | WHERE 1=1 (조건 없음) |
| **COMPANY\_WIDE** | 특정 테넌트 전체 | WHERE company\_id \= ? |
| **DEPT\_TREE** | 특정 부서 및 하위 | WHERE dept\_id IN (sub\_dept\_ids) |
| **USER\_ONLY** | 본인 데이터 | WHERE user\_id \= ? |

## **3\. 리소스별 상세 권한 매트릭스**

### **3.1 테넌트 및 시스템 관리 (Global Admin Domain)**

* **리소스:** SYSTEM\_CONFIG, TENANT\_MGMT  
* **접근 URL:** /super-admin/\*

| 행위 (Action) | SUPER\_ADMIN | TENANT\_ADMIN | DEPT\_MANAGER | USER | 비고 |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **테넌트 생성/삭제** | **O** | X | X | X | 신규 계열사 입점 등 |
| **전역 설정 변경** | **O** | X | X | X | 시스템 공지사항, 글로벌 정책 |
| **테넌트 목록 조회** | **O** | X | X | X |  |

### **3.2 인사 및 조직 관리 (HR Core)**

* **리소스:** USER\_INFO, ORG\_CHART

| 행위 | SUPER\_ADMIN | TENANT\_ADMIN | DEPT\_MANAGER | USER | 동적 조건 / 필터 |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **사원 조회** | GLOBAL\_ALL | COMPANY\_WIDE | DEPT\_TREE | USER\_ONLY | viewMode 파라미터에 따라 스코프 자동 조정 |
| **인사 발령** | **O** | **O** (자사 인원만) | X | X | 부서 이동, 승진 등 |
| **조직도 편집** | **O** | **O** (자사 조직만) | X | X | 부서 신설/폐지 |

### **3.3 급여 관리 (Payroll)**

* **리소스:** PAYROLL\_DATA  
* **보안 등급:** 최상 (High)

| 행위 | SUPER\_ADMIN | TENANT\_ADMIN | DEPT\_MANAGER | USER | 동적 조건 / 필터 |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **급여 조회** | GLOBAL\_ALL | COMPANY\_WIDE | USER\_ONLY | USER\_ONLY | **\[환경\]** 급여 기간(25\~30일) 외에는 USER 조회 불가 |
| **급여 정산** | **O** | **O** (자사) | X | X | 정산 확정 시 결재 승인 필요 (Ticket) |
| **연봉 열람** | **O** | **O** | X | USER\_ONLY | 부서장이라도 팀원 연봉 열람 불가 (별도 위임 필요) |

### **3.4 휴가 및 근태 (Vacation & Attendance)**

* **리소스:** VACATION\_REQ, ATTENDANCE\_LOG

| 행위 | SUPER\_ADMIN | TENANT\_ADMIN | DEPT\_MANAGER | USER | 동적 조건 / 필터 |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **현황 조회** | GLOBAL\_ALL | COMPANY\_WIDE | DEPT\_TREE | USER\_ONLY | viewMode='TEAM' 시 부서장 권한 적용 |
| **휴가 신청** | O | O | O | O | 잔여 연차 \> 0 |
| **결재 승인** | X | **O** (전결 가능) | **O** (결재선) | X | SUPER\_ADMIN은 결재 로직에 개입하지 않음 |

## **4\. 테넌트 격리 정책 (Isolation Policy)**

### **4.1 기본 원칙**

* **Super Admin을 제외한 모든 역할**은 DB 조회 시 반드시 company\_id 조건이 WHERE 절에 포함되어야 한다.  
* 프론트엔드에서 실수로 타사의 company\_id를 요청하더라도, 백엔드 Policy 모듈에서 강제로 로그인한 사용자의 company\_id로 덮어쓰거나 차단해야 한다.

### **4.2 예외 처리 (Cross-Tenant Access)**

* 원칙적으로 불가능하다.  
* 단, 그룹사 감사(Audit) 등의 이유로 특정 사용자가 타사 데이터에 접근해야 할 경우, **임시 접근권(AccessGrant)** 발급을 통해서만 허용한다.