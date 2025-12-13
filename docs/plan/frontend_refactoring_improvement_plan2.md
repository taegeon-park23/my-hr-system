# 프론트엔드 아키텍처 개선 및 리팩토링 계획 (Frontend Architecture Improvement Plan)

## 1. 개요 (Overview)
본 문서는 "Frontend 아키텍처 분석 및 리팩토링 보고서"에 기반하여 식별된 문제점을 해결하고, 안정적인 서비스 확장을 위해 프론트엔드 시스템을 고도화하는 실행 계획입니다.
렌더링 에러 방지(Hydration Issue), 데이터 흐름의 일관성 확보, 그리고 FSD(Feature-Sliced Design) 원칙 준수를 목표로 합니다.

## 2. 작업 목표 (Goals)
1.  **기반 안정화:** `window` 객체 직접 접근으로 인한 SSR 에러 방지 및 Axios 인터셉터 구조 개선.
2.  **데이터 무결성:** 하드코딩된 Mock Data 제거 및 SWR/TanStack Query를 활용한 실제 API 연동.
3.  **UI/UX 고도화:** `clsx`, `tailwind-merge` 도입을 통한 스타일 클래스 관리 개선 및 전역 UI 상태 관리 도입.
4.  **아키텍처 준수:** 비즈니스 로직과 UI의 철저한 분리 (FSD 지향).

## 3. 상세 실행 계획 (Execution Plan)

### Phase 1: 기반 안정화 (Foundation & Core Fixes)
**목표:** 렌더링 에러 방지 및 데이터 흐름의 일관성 확보 (긴급)

#### 1. Auth & Axios 구조 개편
-   **대상 파일:** `src/shared/api/client.ts`, `src/app/_providers.tsx` (또는 `layout.tsx`)
-   **작업 내용:**
    -   `client.ts`의 `window.dispatchEvent` 제거 (SSR 안전성 확보).
    -   Axios 설정 함수(`setupInterceptors`)를 export하고, 클라이언트 사이드(`useEffect`)에서 주입하는 구조로 변경.
    -   에러 바운더리 또는 전역 이벤트 핸들러를 통해 401/403 처리 로직 안정화.

#### 2. LocalStorage 접근 시점 제어
-   **대상 파일:** `src/shared/stores/useAuthStore.ts`
-   **작업 내용:**
    -   `persist` 미들웨어 설정 점검.
    -   Hydration Mismatch 방지를 위해 `skipHydration: true` 사용 또는 커스텀 훅(`useMounted`)을 도입하여 클라이언트 마운트 후 스토리지 접근하도록 개선.

#### 3. UI 라이브러리 유틸리티 추가
-   **작업 내용:** `clsx`, `tailwind-merge` 패키지 설치.
-   **적용:** `Button.tsx` 등 공통 UI 컴포넌트의 클래스 병합 로직을 템플릿 리터럴에서 유틸리티 함수(`cn(...)`)로 리팩토링하여 충돌 방지 및 가독성 향상.

### Phase 2: 데이터 연동 및 정규화 (Data Integration)
**목표:** 하드코딩 제거 및 실제 데이터 연동 (필수)

#### 1. SWR/TanStack Query 본격 적용
-   **대상 파일:** `src/shared/hooks/useDashboardStats.ts`, `src/widgets/Dashboard/QuickStats.tsx`
-   **작업 내용:**
    -   `axios` 직접 호출 로직을 `useSWR` 또는 `useQuery` 훅으로 교체.
    -   캐싱, 로딩(`isLoading`), 에러(`isError`) 상태 관리 표준화.

#### 2. Mock Data 제거 및 API 연동
-   **대상 파일:** `src/shared/hooks/useDashboardStats.ts`
-   **작업 내용:**
    -   하드코딩된 `payslip: "Available"`, `team: "-"` 제거.
    -   백엔드 API 엔드포인트(`GET /api/payroll/latest`, `GET /api/users/team-count` 등) 확인 및 연동.
    -   API 미구현 시 MSW(Mock Service Worker) 핸들러(`src/mocks/handlers.ts`)에 명시적 정의.

#### 3. 데이터/뷰 로직 분리
-   **작업 내용:**
    -   Hook(`useDashboardStats`)은 순수 데이터(숫자, 날짜 객체)만 반환.
    -   UI 포맷팅("0 Days", "Loading...")은 UI 컴포넌트(`QuickStats.tsx`) 또는 별도 유틸리티(`formatters.ts`)로 이동하여 책임 분리.

### Phase 3: 아키텍처 및 UI 고도화 (Refinement)
**목표:** 유지보수성 향상 및 FSD 준수 (권장)

#### 1. 전역 UI 상태 도입
-   **대상 파일:** `src/shared/stores/useUIStore.ts` (신규)
-   **작업 내용:**
    -   Sidebar의 `isOpen` 상태 등을 관리하는 Zustand Store 생성.
    -   `Sidebar.tsx`, `Header.tsx`에서 Props Drilling 대신 Store 구독 구조로 변경.

#### 2. 컴포넌트 재사용성 강화
-   **대상 파일:** `src/widgets/Dashboard/QuickStats.tsx` 내부 `StatCard`
-   **작업 내용:**
    -   내부 선언된 `StatCard` 컴포넌트를 `src/shared/ui/StatCard.tsx`로 추출하여 재사용성 확보.

#### 3. 에러 바운더리 및 Suspense 활용
-   **작업 내용:**
    -   각 위젯(Dashboard Widgets)을 `Suspense`와 `ErrorBoundary`로 감싸서, 부분 로딩 및 에러 처리가 가능하도록 구현.
    -   스켈레톤 UI 적용으로 UX 개선.

## 4. 검증 계획 (Verification Plan)

### 자동화 테스트 (Automated Tests)
1.  **빌드 테스트:** `npm run build` 실행하여 SSR 관련 에러(window reference 등) 없음 확인.
2.  **타입 검사:** `tsc --noEmit` 실행하여 엄격한 타입 체크 통과 확인.

### 수동 검증 (Manual Verification)
1.  **Hydration 확인:**
    -   브라우저 콘솔에 "Hydration failed" 경고가 없는지 확인 (특히 AuthStore 관련).
2.  **데이터 연동 확인:**
    -   대시보드 진입 시 네트워크 탭 확인 -> 실제 API 호출 발생 여부.
    -   로그아웃 시(401 에러) 로그인 페이지로 안정적으로 리다이렉트되는지 확인.
    -   새로고침 시 로그인 상태가 유지되는지 확인 (LocalStorage 연동).
3.  **UI 반응형 확인:**
    -   모바일/데스크톱 뷰포트에서 Sidebar 토글 동작(전역 Store) 확인.

## 5. 예상 일정 (Timeline)
-   **Phase 1:** 4시간 (기반 안정화)
-   **Phase 2:** 6시간 (데이터 연동)
-   **Phase 3:** 4시간 (UI 고도화)
