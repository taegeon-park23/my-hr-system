# Frontend Phase 5 작업 리포트

## 1. 개요
전자결재(Approval) 목록 조회 및 기안 작성이 가능한 기능을 구현했습니다.

## 2. 작업 상세 내용

### 2.1 Approval Feature Slice
`features/approval` 경로에 FSD 구조로 구현.
- **Model**: `ApprovalRequest`, `ApprovalStep` 타입 정의.
- **API**: Mock Data를 반환하는 `getApprovalList`, `createApprovalRequest` 구현.
- **UI**:
    - `ApprovalList`: 결재 목록을 리스트 형태로 표시. 상태(Status)에 따른 뱃지 스타일링 적용.
    - `RequestForm`: 결재 기안 작성 폼. Title, Type 선택 가능.

### 2.2 Approval Page
- `app/dashboard/approval/page.tsx`: 결재함 페이지.
- 'New Request' 버튼 토글 시 작성 폼 표시.
- 목록 조회와 작성을 한 화면에서 처리.

## 3. 결과물
- **결재함 메뉴**: `/dashboard/approval` 접속 시 확인 가능.
- **기능**:
    - 결재 문서 목록 확인 (Vacation, Expense 등).
    - 상태(APPROVED, PENDING) 시각화.
    - 신규 결재 요청 생성 시뮬레이션.

## 4. 커밋 예정 사항
- `features/approval` 전체.
- `app/dashboard/approval` 페이지.
