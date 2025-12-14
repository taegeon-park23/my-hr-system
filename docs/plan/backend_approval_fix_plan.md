# 결재 모듈 조회 기능 개선 계획 (Approval Module Fix)

## 1. 개요 (Overview)
현재 결재 모듈의 API는 기안자(Requester)가 자신의 신청 내역을 조회하는 기능(`getMyRequests`)만 구현되어 있다.
결재자(Approver, 예: `lee.manager`)가 자신에게 요청된 **결재 대기 목록(Pending Approvals)**을 조회할 수 있는 기능이 누락되어 있어, 테스트 진행 시 데이터가 보이지 않는 문제가 발생했다.
이를 해결하기 위해 결재 대기 목록 조회 API를 추가하고, 프론트엔드에서 역할/탭에 따라 적절한 API를 호출하도록 개선한다.

## 2. 목표 (Goals)
1.  **Backend**: 결재자가 검토해야 할 할당된 결재 요청 목록을 조회하는 API (`GET /api/approval/pending`) 구현.
2.  **Frontend**: 대시보드 및 결재 페이지에서 '내 신청 내역'과 '승인 대기 목록'을 구분하여 조회 및 표시.
3.  **Authentication**: 하드코딩된 User ID/Company ID를 제거하고 `SecurityContext`의 인증 정보를 활용.

## 3. 작업 범위 (Scope)

### 3.1 Backend (Spring Boot)
-   **Repository**: `ApprovalRepository` (또는 `ApprovalRequestRepository`)
    -   JPQL을 사용하여 `ApprovalStep`과 `ApprovalRequest`를 조인 조회하는 메소드 추가.
    -   조건: `step.approverId = :userId` AND `step.status = 'PENDING'`
-   **Service**: `ApprovalService`
    -   `getPendingApprovals(Long userId)` 메소드 구현.
-   **Controller**: `ApprovalController`
    -   `GET /api/approval/pending`: 결재 대기 목록 반환.
    -   `GET /api/approval/inbox`: 내 신청 내역 반환 (기존 로직 보완).
    -   모든 메소드에서 `@AuthenticationPrincipal`을 통해 `user.id`, `user.companyId` 사용.

### 3.2 Frontend (Next.js)
-   **API Client**: `approvalApi` 객체에 `getPendingRequests` 함수 추가.
-   **UI**: `ApprovalBox` (또는 Dashboard Widget)
    -   현재 뷰 모드(Requester vs Approver)에 따라 호출 API 분기 처리.
    -   로그인한 유저가 'TENANT_ADMIN' 또는 매니저 권한인 경우 '승인 대기 목록'을 기본으로 보여주거나 탭으로 분리.

## 4. 상세 설계 (Detailed Design)

### 4.1 API Specification
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/approval/inbox` | **[Outbox]** 내가 기안한 문서 목록 조회 | Yes |
| GET | `/api/approval/pending` | **[Inbox]** 내가 결재해야 할 문서 목록 조회 | Yes |

### 4.2 Query Strategy (JPQL)
```java
@Query("SELECT r FROM ApprovalRequest r " +
       "JOIN ApprovalStep s ON r.id = s.requestId " +
       "WHERE s.approverId = :userId AND s.status = 'PENDING' " +
       "AND r.companyId = :companyId")
List<ApprovalRequest> findPendingRequests(@Param("companyId") Long companyId, @Param("userId") Long userId);
```

## 5. 검증 계획 (Verification Plan)
1.  **Data Setup**: 기존 `test_data_samsung.sql` 활용.
    -   `kim.staff` 기안 -> `lee.manager` 결재자 지정.
2.  **Scenario Test**:
    -   `kim.staff` 로그인 -> `GET /inbox` 결과 확인 (1건 존재).
    -   `lee.manager` 로그인 -> `GET /pending` 결과 확인 (1건 존재).
    -   `lee.manager`가 승인 처리 후 -> `GET /pending` 결과 0건 확인.

## 6. 일정 (Schedule)
-   **즉시**: Backend API 구현 및 Docker 빌드/배포.
-   **후속**: Frontend 연동 수정.
