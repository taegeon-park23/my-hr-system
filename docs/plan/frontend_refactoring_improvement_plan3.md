# 프론트엔드 리팩토링 및 고도화 계획 3 (Phase 3 Improvement)

## 1. 개요 (Overview)
본 문서는 프론트엔드 정밀 분석 리포트를 바탕으로 식별된 아키텍처 위반 사항을 수정하고, 데이터 및 UI 레이어를 표준화하여 유지보수성과 확장성을 극대화하는 것을 목표로 합니다.
"Prioritized Refactoring Roadmap"의 Phase 1~4를 단계적으로 수행합니다.

## 2. 목표 (Goals)
1.  **아키텍처 건전성 확보**: FSD(Feature-Sliced Design) 원칙을 위반하는 참조 관계(Shared -> Feature)를 정리합니다.
2.  **데이터 레이어 표준화**: API 정의와 타입 정의를 분리하고, DTO 패턴을 도입하여 데이터 일관성을 유지합니다.
3.  **UI 컴포넌트 현대화**: `cn` 유틸리티와 `CVA` 라이브러리를 도입하여 스타일링 코드를 간소화하고 타입 안전성을 확보합니다.
4.  **UX 및 안정성 강화**: 글로벌 에러 처리(ErrorBoundary)와 권한 제어(Role Guard)를 체계화합니다.

## 3. 상세 이행 계획 (Detailed Implementation Plan)

### Phase 1: 아키텍처 및 의존성 바로잡기 (Architecture & Dependencies)
> **최우선 과제**: 순환 참조 방지 및 계층 규칙 준수

- [ ] **[MOVE]** `src/shared/hooks/useDashboardStats.ts` -> `src/widgets/Dashboard/model/useDashboardStats.ts`
    - 사유: Shared 레이어는 Feature 레이어를 참조할 수 없음 (FSD 위반). Dashboard Widget으로 이동하여 합성 로직을 수행.
- [ ] **[REFACTOR]** `src/shared/config/navigation.ts`
    - `requiredRole`을 문자열 하드코딩에서 `UserRole` Enum(또는 Const Assertion)으로 변경하여 타입 안전성 확보.

### Phase 2: 데이터 레이어 표준화 (Data Standardization)
> 목표: 타입 정의 중앙화 및 응집도 향상

- [ ] **[REFACTOR]** Feautre별 Type Definition 분리
    - 기존: `features/{name}/api/*.ts`에 인터페이스 혼재.
    - 변경: `features/{name}/model/types.ts` 생성 및 이동.
    - 대상: `vacation`, `evaluation`, `payroll`, `org` 등.
- [ ] **[REFACTOR]** Shared Type 정리
    - `shared/model/types.ts`는 전역적으로 사용되는 `ApiResponse`, `User`, `PaginatedResponse` 등만 유지.

### Phase 3: UI 컴포넌트 고도화 (UI Modernization)
> 목표: Tailwind CSS 활용 최적화 (CVA 도입)

- [ ] **[NEW]** `src/shared/lib/utils.ts` 생성
    - `clsx` + `tailwind-merge`를 결합한 `cn` 함수 구현.
- [ ] **[REFACTOR]** 공통 컴포넌트 리팩토링 (CVA 적용)
    - 대상: `Button.tsx`, `Input.tsx`, `Badge.tsx`(필요 시).
    - 복잡한 템플릿 리터럴 제거 및 Variant 기반 스타일링 적용.

### Phase 4: 에러 핸들링 및 UX 강화 (Error Handling & UX)
> 목표: 사용자 경험 보호

- [ ] **[NEW]** `src/shared/lib/role-guard.ts` (가칭)
    - `hasPermission(user, role)` 유틸리티 함수 구현.
- [ ] **[REFACTOR]** `Sidebar.tsx` 및 라우팅 가드에 권한 체크 로직 적용.
- [ ] **[FEATURE]** Global Error Boundary 적용 (App Router `error.tsx` 활용).

## 4. 검증 계획 (Verification Plan)

### 자동화 테스트 (Automated Tests)
- `npm run build`를 통해 순환 참조 및 타입 에러가 없는지 전체 빌드 검증.
- `Storybook` (실행 중인 경우)을 통해 Button, Input 컴포넌트 스타일 회귀 테스트.

### 수동 검증 (Manual Verification)
1.  **Dashboard 동작 확인**: `useDashboardStats` 이동 후 대시보드 데이터(휴가, 급여 등)가 정상적으로 로딩되는지 확인.
2.  **Navigation 확인**: Role 기반 메뉴 필터링이 정상 작동하는지 확인.
3.  **UI 컴포넌트 확인**: 버튼, 입력 필드의 스타일(Primary/Secondary/Error 등)이 깨지지 않는지 확인.

## User Review Required
- `shared/hooks` 이동은 파일 경로 변경을 수반하므로, 해당 훅을 사용하는 다른 컴포넌트가 있다면 함께 수정되어야 합니다. (현재는 Dashboard 위젯에서만 사용 추정)
