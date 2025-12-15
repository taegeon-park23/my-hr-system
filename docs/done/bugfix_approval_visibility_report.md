# Approval Visibility & API Fix Report

## 1. 개요 (Overview)
결재 요청 시 결재자가 지정되지 않는 문제와 상세 조회 시 404 에러가 발생하는 문제를 해결했습니다.

## 2. 작업 내용 (Changes Implemented)

### 2.1 Backend (`modules:approval`)
-   **API Endpoint 추가**: `GET /api/approval/{id}` 엔드포인트 구현 내역을 `ApprovalController`에 추가했습니다.
-   **Service Logic 보강**: `ApprovalService.getApprovalRequest(Long id)` 메서드를 추가했습니다.
-   **Error Handling 강화**: `ApprovalEventListener`에서 매니저 조회 실패 시 발생하는 예외를 로그로 명확히 남기도록 개선했습니다.
-   **Transaction Fix**: `ApprovalService.createInitialApprovalStep` 메서드에 `@Transactional(propagation = REQUIRES_NEW)`를 적용하여, `AFTER_COMMIT` 이벤트 리스너에서도 독립된 트랜잭션으로 결재 단계를 저장하도록 수정했습니다.
-   **MailService Fix**: `MailService`에서 `@Transactional`을 제거하여 이메일 전송 실패가 전체 트랜잭션을 롤백시키지 않도록 격리했습니다.

### 2.2 Frontend (`frontend`)
-   **Hook 추가**: `useApprovalDetail` Hook을 `src/features/approval/api/approvalApi.ts`에 추가하여 개별 결재 요청을 조회할 수 있도록 했습니다.
-   **상세 페이지 구현**: `src/app/dashboard/approval/[id]/page.tsx`를 생성하여 결재 상세 정보를 보여주는 UI를 구현했습니다.
-   **리스트 연결**: `ApprovalList` 컴포넌트에서 각 항목을 클릭하면 상세 페이지로 이동하도록 연결했습니다.

## 3. 검증 방법 (Verification Guide)

1.  **로그인 및 데이터 확인**:
    -   `kim.staff`로 로그인하여 휴가 신청을 생성합니다.
    -   `lee.manager` 계정이 `kim.staff`와 **같은 부서**인지, **MANAGER 권한**을 가지고 있는지 DB에서 확인합니다.
2.  **Flow 테스트**:
    -   `kim.staff` 휴가 신청 -> Backend Log에서 "Created ApprovalStep..." 확인.
    -   `lee.manager` 로그인 -> `/dashboard/approval` 접속 -> "Pending Approvals" 탭 확인.
    -   리스트 클릭 -> 상세 페이지 정상 표시 확인 (404 에러 미발생).

## 4. 결론 (Conclusion)
이제 결재 요청 절차가 정상적으로 이어지며, 프론트엔드에서도 상세 내역을 확인할 수 있습니다.
