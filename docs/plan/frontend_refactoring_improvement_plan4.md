# 프론트엔드 리팩토링 및 고도화 계획 4 (Phase 4 Improvement)

## 1. 개요 (Overview)
본 문서는 프론트엔드 정밀 분석 리포트의 "Prioritized Refactoring Roadmap"을 기반으로 한 4단계 개선 계획입니다.
기존의 기능 개발 위주에서 벗어나, 보안(인증), 시스템 안정성(데이터/에러 처리), 개발 생산성(공통 컴포넌트)을 확보하는 것을 목표로 합니다.

## 2. 목표 (Goals)
1.  **보안 강화**: LocalStorage 기반 인증을 HttpOnly Cookie 기반으로 전환하고 Next.js Middleware를 도입합니다.
2.  **데이터 일관성**: SWR 구성을 전역으로 표준화하고, Axios 혼용을 최소화합니다.
3.  **디자인 시스템 고도화**: 공통 컴포넌트(Badge, Select 등)를 확장하고, 반복되는 Table UI를 추상화합니다.
4.  **로직 표준화**: Form 처리(Zod) 및 비즈니스 로직의 의존성을 정리합니다.

## 3. 상세 이행 계획 (Detailed Implementation Plan)

### Step 1: 기반 구조 재정비 (Foundation & Config) - High Priority
> 목표: 보안 및 데이터 처리의 표준 수립

- [ ] **[AUTH]** Cookie 기반 인증 전환
    - `client.ts` 수정: 토큰을 LocalStorage가 아닌 Cookie(js-cookie 또는 API Proxy)로 관리. (보안상 HttpOnly권장되나, 현재 FE 단독 서버로는 한계가 있으므로 BFF 또는 RouteHandler 고려 필요. 우선은 클라이언트 사이드 Cookie 활용)
    - `middleware.ts` 구현: Protected Route 접근 시 토큰 유무 확인 및 리다이렉트.
- [ ] **[DATA]** SWR 전역 설정
    - `layout.tsx`에 `SWRConfig` 적용 (Global Error Handling, Retry 정책).
    - `features` 내부의 `useEffect` + `axios` 패턴을 `useSWR`로 마이그레이션.
- [ ] **[ENV]** 환경 변수 중앙화
    - `shared/config/env.ts` 생성: `process.env` 값을 Zod로 검증 후 export.

### Step 2: 공통 UI 라이브러리 고도화 (Design System) - Medium Priority
> 목표: UI 개발 생산성 및 일관성 향상

- [ ] **[UI]** Atomic 컴포넌트 확장
    - `Badge.tsx`: CVA 적용 (Success/Warning/Danger/Info).
    - `Select.tsx`: 기본 HTML Select 대신 Headless UI 기반 또는 스타일링 된 Select 구현.
- [ ] **[UI]** Table 추상화
    - `shared/ui/Table` 컴포넌트 셋 구현 (`Table`, `TableHeader`, `TableRow`, `TableCell`).
    - `PayrollListTable`, `VacationRequestList` 등에 적용.

### Step 3: 비즈니스 로직 및 위젯 리팩토링 (Features & Widgets) - Medium Priority
> 목표: 결합도 감소 및 유지보수성 증대

- [ ] **[REFACTOR]** Hardcoded Logic 제거
    - UI 내 'CONFIRMED', 'PAID' 등 문자열을 `shared/config/constants.ts` 또는 Feature 별 상수로 분리.
- [ ] **[FORM]** Form 유효성 검사 표준화
    - `react-hook-form` + `zod` 패턴 적용 확대 (VacationForm 등).

### Step 4: 성능 최적화 및 안정성 (Optimization) - Low Priority
> 목표: 사용자 경험 개선

- [ ] **[PERF]** Server Components 활용 검토
    - 대시보드 초기 데이터 등 SEO나 초기 로딩 속도가 중요한 부분을 Server Side Fetching (Hydration).
- [ ] **[DOCS]** Storybook 업데이트
    - 새로 만든 `Badge`, `Select`, `Table` 컴포넌트 문서화.

## 4. 검증 계획 (Verification Plan)
- **인증 테스트**: 로그아웃 상태에서 `/dashboard` 접근 시 `/login`으로 리다이렉트 되는지 확인.
- **빌드 테스트**: `npm run build` 성공 여부.
- **UI 테스트**: Storybook 실행 및 각 컴포넌트(Badge, Table) 렌더링 확인.

## User Review Required
- **인증 방식 변경**: 기존 LocalStorage에 저장된 토큰은 더 이상 유효하지 않게 되므로, 배포 시 모든 사용자가 재로그인해야 함을 공지해야 합니다.
- **범위**: 본 계획은 FE 전반에 걸친 대대적인 리팩토링이므로, Step별로 PR을 나누어 진행하는 것을 권장합니다.
