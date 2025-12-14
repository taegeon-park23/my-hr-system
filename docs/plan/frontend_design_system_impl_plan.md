# [Frontend] Design System Implementation Plan

## 1. 개요 (Overview)
**목표**: `docs/03_guides/디자인 시스템 가이드`를 준수하여 프론트엔드 디자인 시스템을 구축하고, 기존 페이지에 적용한다.
**범위**: 
- `apps/globals.css` (색상, 타이포그래피 설정)
- `shared/ui` (Atomic 컴포넌트 개발 및 Storybook 작성)
- `(auth)/login`, `dashboard` (페이지 리팩토링)

## 2. 분석 및 변경사항 (Analysis & Changes)

### 2.1 Global Styles (`src/app/globals.css`)
**현재 상태**: Tailwind v4 `@theme` 사용 중이나, 색상 값이 가이드(Indigo 계열)와 다름 (현재 Blue 계열).
**변경 계획**:
- **Brand Colors**: 
  - `--color-primary`: `#4F46E5` (Indigo-600)
  - `--color-primary-dark`: `#4338CA` (Indigo-700)
  - `--color-bg-base`: `#F8FAFC` (Slate-50)
- **Status Colors**: Guide 3.2절에 맞춰 Emerald, Amber, Rose, Blue, Slate 계열 변수 재정비.
- **Typography**: 기본 폰트(Inter/Pretendard) 설정 확인 및 적용.

### 2.2 Atomic Components (`src/shared/ui/`)
모든 컴포넌트는 `cva`, `tailwind-merge`, `clsx`를 사용하여 구현하며, Storybook을 포함한다.

#### [NEW] `Button`
- Variants: `primary`, `secondary`, `danger`, `ghost`
- Sizes: `sm`, `md`
- Path: `src/shared/ui/Button.{tsx,stories.tsx}`

#### [NEW] `Input` / `Select`
- States: Default, Error, Focus
- Path: `src/shared/ui/form/Input.{tsx,stories.tsx}`, `Select.{tsx,stories.tsx}`

#### [NEW] `Badge`
- Variants: `success`, `warning`, `danger`, `info`, `neutral`
- Path: `src/shared/ui/Badge.{tsx,stories.tsx}`

#### [NEW] `Modal`
- Compound Component 패턴 사용 (Modal.Root, Modal.Header...)
- Path: `src/shared/ui/Modal.{tsx,stories.tsx}`

#### [NEW] `Table`
- Styles: Header (bg-slate-50), Row (hover:bg-slate-50)
- Path: `src/shared/ui/Table.{tsx,stories.tsx}`

### 2.3 Page Refactoring
#### [MODIFY] `src/app/(auth)/login/page.tsx`
- 하드코딩된 `form`, `input`, `button` 태그를 `shared/ui` 컴포넌트로 교체.
- Layout 및 Spacing 가이드 준수.

#### [MODIFY] `src/app/dashboard/page.tsx`
- 기존 카드, 버튼, 테이블 요소를 `shared/ui` 컴포넌트로 교체.

## 3. 검증 계획 (Verification Plan)

### 3.1 Automated Tests
- **Lint**: `npm run lint` 실행하여 에러 없음 확인.
- **Storybook Build**: `npm run storybook` (또는 `build-storybook`) 실행하여 빌드 성공 확인.

### 3.2 Manual Verification
- **Storybook**: 각 컴포넌트(Button, Input 등)의 Variant별 렌더링 확인 (브라우저 확인 불가능 시 빌드 로그로 대체하지만, 가능한 범위 내에서 확인).
- **Page Verification**:
  - `Login Page`: UI 깨짐 없이 정상 출력 확인.
  - `Dashboard`: 기존 데이터와 함께 새로운 UI 컴포넌트가 올바르게 렌더링되는지 확인.

## 4. 일정 (Schedule)
- Phase 1: Global Styles & Atomic Components (Button, Input, Badge)
- Phase 2: Complex Components (Modal, Table)
- Phase 3: Page Refactoring
- Phase 4: Verification & Reporting
