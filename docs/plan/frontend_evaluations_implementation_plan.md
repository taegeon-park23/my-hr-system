# 인사평가 모듈 프론트엔드 구현 계획 (Frontend Evaluations Module Plan)

## 1. 개요 (Overview)
* **목표**: 백엔드에 구현된 인사평가 API를 연동하여 관리자가 평가 회차를 운영하고, 임직원이 본인/동료 평가를 수행할 수 있는 웹 인터페이스를 구축한다.
* **범위**: API 연동 Hook 개발, 관리자용 회차 관리 페이지, 사용자용 평가 수행 페이지 및 관련 UI 컴포넌트 개발.

## 2. 구현 상세 (Implementation Steps)

### Step 1: API 연동 (API Integration)
* **파일**: `src/features/evaluation/api/evaluationApi.ts`
* **내용**:
    *   `useEvaluationCycles(companyId)`: `GET /api/admin/evaluations/cycles` (관리자용 회차 목록)
    *   `createEvaluationCycle(data)`: `POST /api/admin/evaluations/cycles`
    *   `startEvaluationCycle(id)`: `POST /api/admin/evaluations/cycles/{id}/start`
    *   `closeEvaluationCycle(id)`: `POST /api/admin/evaluations/cycles/{id}/close`
    *   `useMyEvaluations()`: `GET /api/evaluations` (내 결과 조회)
    *   `useTodoEvaluations()`: `GET /api/evaluations/todo` (내가 해야 할 평가 목록)
    *   `submitEvaluation(recordId, data)`: `POST /api/evaluations/records/{id}/submit`

### Step 2: UI 컴포넌트 개발 (UI Components)
* **위치**: `src/features/evaluation/ui/`
* **컴포넌트**:
    1.  `CycleManagementTable.tsx`: 회차 목록 표시 및 상태 변경(시작/마감) 액션 버튼.
    2.  `CreateCycleModal.tsx`: 신규 평가 회차(제목, 기간, 유형) 등록 모달.
    3.  `EvaluationTargetList.tsx`: 내가 평가해야 할 대상 목록 (Todo 리스트).
    4.  `EvaluationForm.tsx`: 점수(Score) 및 코멘트(Comment) 입력 폼.

### Step 3: 페이지 구현 (Pages)
* **Admin Page**: `src/pages/admin/evaluations/cycles.tsx`
    *   평가 회차 운영 관리 (생성 -> 시작 -> 마감).
* **User Page**:
    *   `src/pages/evaluations/dashboard.tsx`: 나의 평가 현황 및 할 일(Todo) 목록.
    *   `src/pages/evaluations/action/[id].tsx`: 실제 평가 수행(입력) 페이지.

### Step 4: 네비게이션 및 라우팅 (Navigation)
*   **Sidebar**:
    *   Admin: `Evaluations (Admin)` -> `/admin/evaluations/cycles`
    *   User: `Evaluations` -> `/evaluations/dashboard`

## 3. 검증 시나리오 (Verification)
1.  **관리자 (Admin)**:
    *   "2025 상반기 정기평가" 회차 생성 확인.
    *   회차 상태를 `DRAFT` -> `OPEN`으로 변경 시, `evaluations` 데이터 생성 여부 확인.
2.  **사용자 (User)**:
    *   대시보드 진입 시 "해야 할 평가" 목록에 항목 표시 확인.
    *   특정 항목 클릭 -> 평가 입력(점수/코멘트) -> 제출 확인.
    *   제출 후 상태가 `SUBMITTED` 등으로 변경되고 Todo 목록에서 제거(또는 완료 표시)되는지 확인.

## 4. 예상 소요 (Estimated Effort)
*   API Hook 및 타입 정의: 2 steps
*   Admin UI (Table, Modal): 3 steps
*   User UI (Dashboard, Form): 4 steps
*   Routing & Integration: 2 steps
*   **총**: 약 11~13 Tools Steps
