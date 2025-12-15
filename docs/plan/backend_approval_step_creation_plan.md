# 결재 단계 자동 생성 구현 계획 (Approval Step Auto-Creation Plan)

## 1. 개요 (Overview)
현재 결재 요청(`ApprovalRequest`) 생성 시 승인 단계(`ApprovalStep`)가 생성되지 않아, 결재자가 요청을 승인/반려할 수 없는 상태입니다.
이를 해결하기 위해 `ApprovalRequestedEvent` 이벤트를 구독하여 **조직 내 관리자(Manager)를 자동으로 찾아 결재 단계를 생성**하는 로직을 구현합니다.

## 2. 목표 (Goals)
- `ApprovalRequestedEvent` 발생 시 Event Listener가 동작하도록 구현.
- `User` 모듈을 통해 요청자(Requester)의 부서 관리자(Dept Manager)를 조회.
- `ApprovalStep` 엔티티를 생성하고 DB에 저장.

## 3. 상세 설계 (Detailed Design)

### 3.1 Architecture Flow
1.  `ApprovalService.createApproval()` -> `EventPublisher.publish(ApprovalRequestedEvent)`
2.  `ApprovalEventListener` (New) catches Event.
3.  `UserModuleApi.getManagerIdOfUser(requesterId)` 호출.
4.  `ApprovalStepRepository.save()` 실행.

### 3.2 Module Interfaces

#### User Module (`modules:user`)
-   **API 변경**: `UserModuleApi` 인터페이스에 메서드 추가.
    ```java
    // 요청자의 부서 내 관리자(TENANT_ADMIN 등) ID 조회
    Long getManagerIdOfUser(Long userId);
    ```
-   **Service 구현**: `UserService`
    -   User 조회 -> `deptId` 확인.
    -   같은 `deptId`를 가진 사용자 중 `role = 'TENANT_ADMIN'` 인 사용자 검색.
    -   (없을 경우 예외 처리 또는 상위 부서 검색 등은 추후 고도화. MVP는 `TENANT_ADMIN` 1명 매핑)

#### Approval Module (`modules:approval`)
-   **Listener 구현**: `ApprovalEventListener`
-   **Repository 추가**: `ApprovalStepRepository` (JPA)

### 3.3 Database Query Strategy (UserService)
```sql
SELECT id FROM users 
WHERE dept_id = (SELECT dept_id FROM users WHERE id = :requesterId)
AND role IN ('TENANT_ADMIN', 'MANAGER')
AND id != :requesterId
LIMIT 1;
```

## 4. 구현 단계 (Implementation Steps)

1.  **User Module**: `UserModuleApi`에 메서드 추가 및 `UserService` 구현.
2.  **Approval Module**:
    -   `ApprovalStepRepository` 생성.
    -   `ApprovalEventListener` 구현 및 Logic 작성.
3.  **Verification**:
    -   `Kim Staff`로 로그인하여 휴가/결재 요청 생성.
    -   `approval_steps` 테이블에 `Lee Manager` (TENANT_ADMIN) 앞으로 Step이 생성되었는지 확인.

## 5. 검증 계획 (Verification Plan)
-   **Manual Test**:
    -   `Kim Staff` (ID 10) 요청 생성.
    -   DB Query: `SELECT * FROM approval_steps WHERE request_id = ?` 확인.
    -   `Lee Manager` (ID 11) `pending` API 조회 시 항목 표시 확인.
