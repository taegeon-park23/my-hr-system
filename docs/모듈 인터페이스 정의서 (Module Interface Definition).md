# **모듈 인터페이스 정의서 (Module Interface Definition)**

## **1\. 개요**

본 문서는 Modular Monolith 아키텍처에서 모듈 간 통신을 위한 \*\*공개 API (Module API Interface)\*\*와 \*\*이벤트(Event)\*\*를 정의한다.  
개발자는 타 모듈의 Repository나 Entity를 직접 참조할 수 없으며, 반드시 아래 정의된 인터페이스를 주입(DI)받아 사용해야 한다.

## **2\. 모듈별 공개 API (Synchronous)**

### **2.1 Policy Module (권한/정책)**

* **패키지:** com.hr.modules.policy.api  
* **책임:** 권한 판단 및 데이터 스코프 계산 (PDP)

| 메서드 서명 | 설명 | 리턴 타입 |
| :---- | :---- | :---- |
| resolveDataScope(userId, resource, viewMode) | 사용자와 의도에 따른 조회 범위(Scope) 반환 | DataScope (Type \+ IDs) |
| hasPermission(userId, permissionCode) | 단순 기능 접근 허용 여부 확인 | boolean |
| issueTemporaryTicket(targetUserId, resource, ttl) | 임시 접근 권한 티켓 발급 | void |

### **2.2 Tenant Module (테넌트/회사) \- \[NEW\]**

* **패키지:** com.hr.modules.tenant.api  
* **책임:** 계열사 정보 관리

| 메서드 서명 | 설명 | 리턴 타입 |
| :---- | :---- | :---- |
| isValidTenant(companyId) | 유효한 회사인지 검증 | boolean |
| getTenantConfig(companyId) | 회사별 전용 설정(로고, 테마 등) 조회 | TenantConfigDto |

### **2.3 User Module (사용자)**

* **패키지:** com.hr.modules.user.api  
* **책임:** 사용자 기본 정보 및 소속 제공

| 메서드 서명 | 설명 | 리턴 타입 |
| :---- | :---- | :---- |
| getUserInfo(userId) | 사용자 핵심 정보(ID, 이름, Role, CompanyId) | UserInfoDto |
| getDeptMembers(deptId) | 특정 부서의 소속원 ID 목록 조회 | List\<Long\> |
| validateUserInTenant(userId, companyId) | 사용자가 해당 테넌트 소속인지 검증 | boolean |

### **2.4 Organization Module (조직)**

* **패키지:** com.hr.modules.org.api  
* **책임:** 부서 계층 구조 및 리더 정보 제공

| 메서드 서명 | 설명 | 리턴 타입 |
| :---- | :---- | :---- |
| getSubDeptIds(deptId) | 하위 부서(Recursive) ID 전체 목록 조회 | List\<Long\> |
| getDeptLeaderId(deptId) | 해당 부서의 현재 리더 ID 조회 | Long |

### **2.5 Approval Module (결재)**

* **패키지:** com.hr.modules.approval.api  
* **책임:** 결재 요청 생성 및 상태 조회

| 메서드 서명 | 설명 | 리턴 타입 |
| :---- | :---- | :---- |
| createRequest(dto) | 결재 상신 (기안자, 결재선 포함) | Long (RequestId) |
| cancelRequest(resourceId, resourceType) | 결재 취소/회수 | void |

## **3\. 도메인 이벤트 정의 (Asynchronous)**

모듈 간의 결합도를 낮추기 위해, 상태 변경 후속 처리는 이벤트를 통해 비동기(또는 느슨한 동기)로 처리한다.

### **3.1 결재 관련 이벤트**

* **이벤트명:** ApprovalCompletedEvent  
* **발행 주체:** ApprovalModule  
* **구독 주체:**  
  * VacationModule: 승인 시 연차 차감 확정 (APPROVED), 반려 시 롤백 (REJECTED).  
  * PolicyModule: 승인 시 결과 문서 조회 권한(Ticket) 부여.  
  * PayrollModule: 급여 정정 승인 시 급여 데이터 반영.

### **3.2 테넌트 관련 이벤트**

* **이벤트명:** TenantCreatedEvent  
* **발행 주체:** TenantModule (Super Admin이 생성 시)  
* **구독 주체:**  
  * OrgModule: 해당 회사의 최상위 루트(Root) 부서 자동 생성.  
  * PolicyModule: 해당 회사의 기본 권한 그룹(Role) 초기화.

### **3.3 인사 이동 이벤트**

* **이벤트명:** UserDeptChangedEvent  
* **발행 주체:** UserModule  
* **구독 주체:**  
  * ApprovalModule: 진행 중인 결재가 있다면, 결재선을 새로운 부서장으로 변경해야 하는지 체크.  
  * AssetModule: 이전 부서 자산 반납 알림 발송.

## **4\. 데이터 교환 객체 (DTO) 표준**

모듈 간 통신 시 사용하는 DTO는 반드시 XXX-api 패키지에 위치해야 하며, JPA Entity를 직접 리턴해서는 안 된다.

### **4.1 DataScope (권한 범위)**

public class DataScope {  
    private ScopeType type;      // GLOBAL\_ALL, COMPANY\_WIDE, DEPT\_TREE, USER\_ONLY  
    private Long companyId;      // ★ Multi-Tenant 환경 필수 필드  
    private List\<Long\> targetIds; // 부서 ID 목록 또는 유저 ID 목록  
}

### **4.2 UserInfo (사용자 정보)**

public class UserInfoDto {  
    private Long userId;  
    private Long companyId;      // 소속 테넌트  
    private Long deptId;  
    private String name;  
    private String role;  
}  
