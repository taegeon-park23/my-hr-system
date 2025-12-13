# 프론트엔드 리팩토링 확장 계획 (Frontend Refactoring Expansion Plan)

## 1. 개요 (Overview)
본 문서는 앞서 완료된 "리팩토링 로드맵(Step 1~4)"의 성공적인 패턴을 **프로젝트 전반(모든 기능 모듈)**으로 확산 적용하기 위한 계획입니다.
API 호출 방식의 파편화를 제거하고, 공통 UI 컴포넌트(Modal, Select 등)를 추가하여 코드베이스의 일관성과 유지보수성을 극대화합니다.

## 2. 작업 목표 (Goals)
1.  **API 표준화 확산:** `vacation` 모듈에 적용된 `fetcher` 및 `queryKeys` 패턴을 `approval`, `asset`, `attendance`, `auth`, `evaluation`, `org`, `payroll` 등 7개 모듈 전체에 적용합니다.
2.  **UI 라이브러리 확장:** `Modal`, `Select` 등 자주 사용되는 UI 패턴을 `shared/ui`로 공통 컴포넌트화합니다.
3.  **UI 적용 확산:** 각 기능 모듈의 하드코딩된 UI(특히 모달, 버튼, 입력 폼)를 공통 컴포넌트로 교체합니다.

---

## 3. 상세 실행 계획 (Execution Plan)

### Step 1: API 계층 표준화 확산 (Standardize API Layer)
**목표:** 모든 `*Api.ts` 파일이 `shared/api/fetcher.ts`와 `queryKeys.ts`를 사용하도록 변경.

#### Action 1-1: Query Keys 통합 정의
-   **대상:** `src/shared/api/queryKeys.ts`
-   **내용:** 각 모듈별 Key Factory 추가.
    ```typescript
    export const queryKeys = {
        vacation: { ... },
        approval: { all: ['approval'], ... },
        asset: { all: ['asset'], ... },
        // ... attendance, auth, evaluation, org, payroll
    };
    ```

#### Action 1-2: API 모듈 리팩토링
-   **대상:**
    -   `approval/api/approvalApi.ts`
    -   `asset/api/assetApi.ts`
    -   `attendance/api/attendanceApi.ts`
    -   `auth/api/authApi.ts`
    -   `evaluation/api/evaluationApi.ts`
    -   `org/api/orgApi.ts` (Mock 제거 및 실제 API 구조 확인 필요, 없으면 표준 Mock Fetcher 사용)
-   **작업:**
    -   로컬 `axios` 또는 `fetch` 호출 제거.
    -   `shared/api/client` 및 `fetcher` 사용.
    -   SWR Hook 생성 시 `queryKeys` 사용.

---

### Step 2: 공통 UI 컴포넌트 추가 (Enhance UI Library)
**목표:** 재사용 가능한 고품질 UI 컴포넌트 추가 개발.

#### Action 2-1: Modal 컴포넌트 개발
-   **생성:** `src/shared/ui/Modal.tsx`
-   **Spec:**
    -   `isOpen`, `onClose`, `title`, `children` Props 지원.
    -   `createPortal` 사용 고려 (Next.js 환경 적합성 확인).
    -   Tailwind 기반의 깔끔한 오버레이 및 트랜지션 스타일링.

#### Action 2-2: Select 컴포넌트 개발
-   **생성:** `src/shared/ui/Select.tsx`
-   **Spec:**
    -   기본 HTML `select`를 래핑하되, `react-hook-form` 연동(`ref` 전달)이 가능하도록 `forwardRef` 구현.
    -   `options` 배열을 받아 렌더링.
    -   통일된 테두리, 포커스 스타일 적용.

---

### Step 3: UI 컴포넌트 전면 교체 (Apply UI Components)
**목표:** 각 Feature 모듈의 중복 UI 코드 제거.

#### Action 3-1: Modal 교체
-   **대상:**
    -   `payroll/ui/PayrollCreateModal.tsx`
    -   `evaluation/ui/CreateCycleModal.tsx`
    -   `asset/ui/AssetCreateModal.tsx`
    -   `asset/ui/AssetAssignModal.tsx`
-   **작업:** 하드코딩된 Modal DOM 구조를 `<Modal>` 컴포넌트로 대체.

#### Action 3-2: Select 및 Form 요소 교체
-   **대상:** `approval`, `evaluation`, `asset` 모듈의 입력 폼.
-   **작업:**
    -   `<select>` -> `<Select>`
    -   `<input>` -> `<Input>` (기존 `Input.tsx` 활용)
    -   `<button>` -> `<Button>`

---

## 4. 검증 계획 (Verification Plan)

### 검증 시나리오
1.  **API 연동 확인:**
    -   각 메뉴(인사, 결재, 자산 등) 진입 시 데이터 로딩 정상 작동 여부.
    -   Network 탭에서 불필요한 중복 요청 없이 SWR 캐싱 동작 확인.
2.  **UI 컴포넌트 동작:**
    -   모달 열기/닫기, 배경 클릭 시 닫기(옵션) 동작 확인.
    -   Select 박스 스타일 일관성 및 폼 전송 시 값 전달 확인.
3.  **빌드 및 린트:**
    -   `npm run build` 성공.
    -   `npm run lint` 에러 0.

## 5. 예상 일정 (Timeline)
-   **Step 1:** 3시간 (모듈 수 비례)
-   **Step 2:** 1.5시간
-   **Step 3:** 2.5시간
