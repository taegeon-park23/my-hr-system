# 프론트엔드 리팩토링 및 개선 계획 (Frontend Refactoring Improvement Plan)

## 1. 개요 (Overview)
본 문서는 "우선순위별 리팩토링 로드맵(Prioritized Refactoring Roadmap)"에 기반하여, 프론트엔드 시스템의 확장성, 견고성, 유지보수성을 확보하기 위한 구체적인 실행 계획을 정의합니다.
기반 다지기, UI/UX 일관성 확보, 구조적 리팩토링, 기능 구현의 4단계로 나누어 진행합니다.

## 2. 작업 목표 (Goals)
1.  **기반 다지기:** 타입 중복 제거, API Client 고도화, 상수 관리 표준화.
2.  **UI/UX 일관성:** 아이콘 시스템 통일, Tailwind 색상 체계 정비.
3.  **구조적 개선:** 설정(Config)과 로직 분리, 비대해진 컴포넌트(Widget) 리팩토링.
4.  **기능 완성:** Mock 데이터 제거 및 실제 API 연동, 글로벌 에러 핸들링 UX 도입.

---

## 3. 상세 실행 계획 (Execution Plan)

### Phase 1: 기반 다지기 (Foundation & Standardization)
**목표:** 타입 및 데이터 페칭 계층 안정화

#### 1. 공통 타입 모듈화
-   **작업 내용:** `src/shared/model/types.ts` 생성 및 전역 사용 타입(User, ApiResponse 등) 통합.
-   **변경 대상:** `authApi.ts`, `store` 등에서 정의된 중복 타입 제거 및 import 전환.

#### 2. API Client 고도화
-   **작업 내용:** `src/shared/api/fetcher.ts` 개선.
    -   제네릭 타입 강화 (List, Detail, Pagination 응답 구조 지원).
    -   `window.location.href` 제거 -> Next.js Router 연동 또는 이벤트 리스너 기반 401 처리.

#### 3. 환경 변수 및 상수 관리
-   **작업 내용:** 하드코딩된 값(예: `2025`) 제거.
-   **파일 생성:** `src/shared/config/constants.ts` 또는 `dateUtils.ts` 등을 통해 중앙 관리.

### Phase 2: UI/UX 일관성 확보 (Design System Update)
**목표:** 디자인 파편화 제거

#### 1. 아이콘 시스템 통일
-   **작업 내용:** 인라인 SVG 전면 제거.
-   **도구:** `@heroicons/react` 도입 또는 `src/shared/ui/Icon.tsx` 공통 컴포넌트 래퍼 구현.

#### 2. Tailwind Config 정비
-   **작업 내용:** `tailwind.config.ts`에 의미론적 색상 정의 (Primary, Secondary, Danger).
-   **적용:** `bg-indigo-600` -> `bg-primary-600` 등으로 일괄 변경(가능한 범위 내).

### Phase 3: 구조적 리팩토링 (Architecture & Logic)
**목표:** 비즈니스 로직과 UI 분리

#### 1. Sidebar 설정 분리
-   **작업 내용:** `Sidebar.tsx` 내 메뉴 리스트/권한 로직 분리.
-   **파일 생성:** `src/shared/config/navigation.ts`.

#### 2. Widget 계층 정비 (QuickStats)
-   **작업 내용:** `QuickStats`의 데이터 페칭 로직을 커스텀 훅으로 분리.
-   **파일 생성:** `src/shared/hooks/useDashboardStats.ts` (또는 features/dashboard 내 배치).

### Phase 4: 기능 구현 및 데이터 연동 (Implementation)
**목표:** 실제 동작 구현

#### 1. Dashboard 데이터 연동
-   **작업 내용:** Team Members, Payslip 등 하드코딩 데이터 제거 -> 실제 API (`orgApi`, `payrollApi`) 연동.
-   **Mocking:** API 미준비 시 MSW (`src/mocks`) 활용 명시적 모킹.

#### 2. 에러 핸들링 UX 개선
-   **작업 내용:** Global Toast 시스템 도입.
-   **구현:** API 에러 발생 시 사용자에게 Toast 알림 표시 (Interceptor 레벨 연동).

---

## 4. 검증 계획 (Verification Plan)

### 자동화 테스트 (Automated Tests)
-   **빌드 테스트:** `npm run build` 성공 여부 확인.
-   **타입 검사:** `tsc --noEmit` 수행하여 타입 에러(중복 제거 후 영향) 확인.

### 수동 검증 (Manual Verification)
1.  **Dashboard 연동 확인:**
    -   로그인 후 대시보드 진입 시 실제(또는 MSW) 데이터가 표시되는지 확인.
    -   네트워크 탭에서 불필요한 중복 요청 없는지 확인 (SWR/React Query 캐싱 동작).
2.  **UI/UX 확인:**
    -   아이콘 깨짐 없이 출력 확인.
    -   테마 컬러 변경 적용 확인.
3.  **에러 핸들링:**
    -   강제로 401/500 에러 유발 후 Toast 메시지 출력 확인.

## 5. 예상 일정 (Timeline)
-   **Phase 1:** 1.5MD
-   **Phase 2:** 1.0MD
-   **Phase 3:** 1.0MD
-   **Phase 4:** 1.5MD
-   **Total:** 5.0MD
