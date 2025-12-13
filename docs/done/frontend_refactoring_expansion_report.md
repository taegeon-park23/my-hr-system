# 프론트엔드 리팩토링 확장 완료 보고서 (Frontend Refactoring Expansion Report)

## 1. 개요 (Overview)
본 문서는 `docs/plan/frontend_refactoring_expansion_plan.md`에 정의된 확장 리팩토링 작업의 수행 결과를 보고합니다.
모든 계획 단계(Step 1 ~ Step 3)가 완료되었으며, 프로젝트 전반에 표준화된 패턴이 적용되었습니다.

## 2. 작업 내용 요약 (Execution Summary)

### Step 1: API 계층 표준화 확산
-   **Query Keys 통합:** `src/shared/api/queryKeys.ts`에 모든 모듈(`approval`, `asset`, `attendance`, `auth`, `evaluation`, `org`, `payroll`)의 Key Factory 추가.
-   **API 모듈 리팩토링:**
    -   `approvalApi.ts`: Mock 제거, SWR Hook(`useApprovalInbox`)으로 교체, `shared/api/fetcher` 사용.
    -   `assetApi.ts`: 로컬 `fetcher` 제거, `shared/api/fetcher` 및 `queryKeys` 사용.
    -   `attendanceApi.ts`: Import 경로 표준화 (`@/shared/api/client`).
    -   `authApi.ts`: Import 경로 표준화.
    -   `evaluationApi.ts`: 로컬 `fetcher` 제거, `shared/api/fetcher` 및 `queryKeys` 사용.
    -   `orgApi.ts`: Mock 제거, SWR Hook(`useOrgTree`) 추가.
    -   `payroll/api/index.ts`: 로컬 `fetcher` 제거, `shared/api/fetcher` 및 `queryKeys` 사용. Hook 시그니처 변경(`userId` 파라미터 추가).

### Step 2: 공통 UI 컴포넌트 추가
-   **라이브러리 설치:** `@headlessui/react`, `@heroicons/react` 추가.
-   **Modal 컴포넌트:**
    -   `src/shared/ui/Modal.tsx` 생성.
    -   Headless UI의 `Dialog`, `Transition` 사용.
    -   접근성(Accessibility) 및 트랜지션 애니메이션 지원.
    -   Props: `isOpen`, `onClose`, `title`, `children`, `maxWidth`.
-   **Select 컴포넌트:**
    -   `src/shared/ui/Select.tsx` 생성.
    -   `forwardRef`로 `react-hook-form` 연동 지원.
    -   통일된 스타일링 및 에러 표시 기능.

### Step 3: UI 컴포넌트 전면 교체
-   **Modal 교체:**
    -   `payroll/ui/PayrollCreateModal.tsx`: 공통 `Modal` 및 `Button` 적용.
    -   `evaluation/ui/CreateCycleModal.tsx`: 공통 `Modal` 및 `Select` 적용.
    -   `asset/ui/AssetCreateModal.tsx`: 공통 `Modal` 및 `Select` 적용.
    -   `asset/ui/AssetAssignModal.tsx`: 공통 `Modal` 적용.
-   **페이지 리팩토링 (API 호출 방식 변경에 따른 동반 수정):**
    -   `dashboard/approval/page.tsx`: `useApprovalInbox` SWR Hook 사용, `useAuthStore` 연동.
    -   `dashboard/attendance/page.tsx`: `useMyVacationBalance` SWR Hook 사용, `useAuthStore` 연동.
    -   `dashboard/payroll/page.tsx`: `useMyPayslips(userId)` Hook 시그니처 반영.
    -   `payroll/my/page.tsx`: `useMyPayslips(userId)` Hook 시그니처 반영.
    -   `payroll/manage/[id]/page.tsx`: `useParams` null 체크 및 타입 수정.

## 3. 변경 파일 목록 (Modified Files)
### 신규 생성
-   `src/shared/ui/Modal.tsx`
-   `src/shared/ui/Select.tsx`

### 수정
-   `src/shared/api/queryKeys.ts`: 모든 모듈 키 추가.
-   `src/features/approval/api/approvalApi.ts`
-   `src/features/asset/api/assetApi.ts`
-   `src/features/attendance/api/attendanceApi.ts`
-   `src/features/auth/api/authApi.ts`
-   `src/features/evaluation/api/evaluationApi.ts`
-   `src/features/org/api/orgApi.ts`
-   `src/features/payroll/api/index.ts`
-   `src/features/payroll/ui/PayrollCreateModal.tsx`
-   `src/features/evaluation/ui/CreateCycleModal.tsx`
-   `src/features/asset/ui/AssetCreateModal.tsx`
-   `src/features/asset/ui/AssetAssignModal.tsx`
-   `src/app/dashboard/approval/page.tsx`
-   `src/app/dashboard/attendance/page.tsx`
-   `src/app/dashboard/payroll/page.tsx`
-   `src/app/payroll/my/page.tsx`
-   `src/app/payroll/manage/[id]/page.tsx`

## 4. 검증 결과 (Verification)
-   **Build:** `npm run build` ✅ 성공.
-   **결과:**
    -   Static Analysis 통과.
    -   모든 페이지 정상 생성 (Static 및 Dynamic).

## 5. 향후 개선 사항 (Next Steps)
-   린트 에러 정리 (`LoginForm.tsx` 등).
-   Storybook을 활용한 공통 UI 컴포넌트(`Modal`, `Select`) 문서화 및 테스트.
-   Backend API 미구현 시 Fallback UI 처리 개선.
