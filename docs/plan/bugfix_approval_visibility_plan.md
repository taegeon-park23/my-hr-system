# 결재 시스템 버그 수정 계획 (Approal System Bug Fix Plan)

## 1. 개요 (Overview)
현재 `kim.staff`가 생성한 결재 요청이 `lee.manager`에게 보이지 않는 문제와, 결재 상세 조회 시 404 에러가 발생하는 문제를 해결합니다.

## 2. 원인 분석 (Root Cause Analysis)
1.  **404 Not Found**: 프론트엔드에서 `/api/approval/inbox/11`을 호출하고 있으나, 백엔드에는 해당 엔드포인트가 존재하지 않음 (`GET /api/approval/{id}` 부재).
2.  **결재선 미생성**: `ApprovalEventListener`에서 예외 발생 시(매니저 미발견 등) 로그만 남기고 트랜잭션을 종료하여, `ApprovalRequest`는 생성되지만 `ApprovalStep`이 생성되지 않음. `lee.manager`와 `kim.staff`가 같은 부서가 아니거나 권한이 없으면 발생.

## 3. 작업 내용 (Changes Implemented)

### 3.1 Backend (`modules:approval`)
-   **`ApprovalController`**: `GET /api/approval/{id}` 엔드포인트 추가.
-   **`ApprovalService`**: `getApprovalRequest(Long id)` 메서드 구현.
-   **`ApprovalEventListener`**: 매니저 조회 실패 시 명확한 에러 로그 출력 및 예외 처리 강화.

### 3.2 Frontend (`frontend`)
-   **API 호출 수정**: `/api/approval/inbox/{id}` 대신 `/api/approval/{id}`를 호출하도록 수정.

## 4. 검증 계획 (Verification Plan)
1.  **데이터 확인**: `kim.staff`와 `lee.manager`의 부서 ID 일치 여부 확인.
2.  **통합 테스트**:
    -   `kim.staff`로 휴가 신청.
    -   Backend Log에서 `Created ApprovalStep` 메시지 확인.
    -   `lee.manager` 로그인 후 `Pending Requests` 목록 확인.
    -   상세 페이지 진입 시 404 에러 해결 확인.
