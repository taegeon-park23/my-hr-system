# 프론트엔드 코드 품질 및 문서화 개선 계획 (Code Quality & Documentation Plan)

## 1. 개요 (Overview)
본 문서는 `frontend_refactoring_expansion_report.md`의 "향후 개선 사항"에 기반하여 코드 품질 개선 및 UI 컴포넌트 문서화를 위한 실행 계획입니다.

**목표:**
1.  린트 에러 0개 달성
2.  공통 UI 컴포넌트(`Modal`, `Select`) Storybook 문서화
3.  Backend API 미구현 시 Fallback UI 처리 개선

---

## 2. 상세 실행 계획 (Execution Plan)

### Step 1: 린트 에러 수정 (Lint Error Fix)
**목표:** `npm run lint` 에러 0개 달성

#### 현재 에러 목록 (5 Errors)

| 파일 | 에러 | 해결 방법 |
|------|------|----------|
| `.storybook/main.ts:23` | `@typescript-eslint/no-require-imports` | `require()` → ES `import` 변환 |
| `RequestForm.tsx:15` | `@typescript-eslint/no-explicit-any` | `error: any` → `error: Error \| unknown` |
| `LoginForm.tsx:33` | `@typescript-eslint/no-explicit-any` | `error: any` → `error: Error \| unknown` |
| `LoginForm.tsx:76` | `react/no-unescaped-entities` | `'` → `&apos;` |
| `AuthGuard.tsx:22` | `react-hooks/set-state-in-effect` | 로직 리팩토링 (초기값 또는 useSyncExternalStore 사용) |

#### Action 1-1: `any` 타입 제거
-   **대상:** `RequestForm.tsx`, `LoginForm.tsx`
-   **작업:** `catch (error: any)` → `catch (error: unknown)` 및 타입 가드 적용

#### Action 1-2: Unescaped Entity 수정
-   **대상:** `LoginForm.tsx:76`
-   **작업:** `Don't have an account?` → `Don&apos;t have an account?`

#### Action 1-3: AuthGuard `setState` in Effect 수정
-   **대상:** `AuthGuard.tsx`
-   **작업:** `setAuthorized` 로직을 조건부 렌더링 또는 `useMemo`로 리팩토링

#### Action 1-4: Storybook `require()` 제거
-   **대상:** `.storybook/main.ts`
-   **작업:** `require()` → ES `import` 또는 ESLint disable 주석 추가

---

### Step 2: Storybook UI 컴포넌트 문서화 (Storybook Stories)
**목표:** `Modal`, `Select` 컴포넌트의 Storybook Story 작성

#### Action 2-1: Modal.stories.tsx 작성
-   **생성:** `src/shared/ui/Modal.stories.tsx`
-   **Story Variants:**
    -   `Default`: 기본 모달
    -   `WithLongContent`: 긴 내용이 있는 모달
    -   `SmallWidth`: `maxWidth="sm"` 적용

#### Action 2-2: Select.stories.tsx 작성
-   **생성:** `src/shared/ui/Select.stories.tsx`
-   **Story Variants:**
    -   `Default`: 기본 셀렉트
    -   `WithLabel`: 라벨이 있는 셀렉트
    -   `WithError`: 에러 상태 표시

---

### Step 3: Fallback UI 처리 개선 (API Error Handling)
**목표:** Backend API 미구현 또는 에러 시 사용자 친화적 UI 표시

#### Action 3-1: ErrorBoundary 컴포넌트 생성
-   **생성:** `src/shared/ui/ErrorBoundary.tsx`
-   **기능:** React Error Boundary로 컴포넌트 렌더링 오류 캐치

#### Action 3-2: API Error Fallback 컴포넌트 생성
-   **생성:** `src/shared/ui/ApiErrorFallback.tsx`
-   **기능:** SWR 에러 시 표시할 공통 UI (재시도 버튼 포함)

---

## 3. 검증 계획 (Verification Plan)

### 자동화 테스트
1.  **린트 검증:**
    ```bash
    cd frontend && npm run lint
    ```
    -   **기대 결과:** `0 errors, 0 warnings` 또는 에러 0개

2.  **빌드 검증:**
    ```bash
    cd frontend && npm run build
    ```
    -   **기대 결과:** 빌드 성공

### Storybook 검증
1.  **Storybook 실행:**
    ```bash
    cd frontend && npm run storybook
    ```
2.  **수동 확인:**
    -   `http://localhost:6006` 접속
    -   `shared/ui/Modal` 및 `shared/ui/Select` 스토리 존재 확인
    -   각 Variant가 정상 렌더링되는지 확인

---

## 4. 예상 일정 (Timeline)
-   **Step 1 (린트):** 1시간
-   **Step 2 (Storybook):** 1시간
-   **Step 3 (Fallback UI):** 1시간
