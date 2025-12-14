# Refactoring Plan v2: Tailwind v4 & Accessibility

## 1. Overview
This plan addresses the refactoring of the frontend to align with Tailwind CSS v4 best practices, improve web accessibility (a11y), and optimize Server/Client Component boundaries.

## 2. Changes

### Phase 1: Tailwind v4 Standardization
- **`src/shared/ui/Button.tsx`**
  - Replace `bg-[var(--color-primary)]` with `bg-primary`.
  - Replace `hover:bg-[var(--color-primary-dark)]` with `bg-primary-dark` (and hover modifier if needed).
  - Replace `focus:ring-[var(--color-primary)]` with `focus:ring-primary`.
  - Update `danger` variants similarly.
- **`src/shared/ui/Input.tsx`**
  - Replace `focus:ring-[var(--color-primary)]` with `focus:ring-primary`.
  - Replace `focus:border-[var(--color-primary)]` with `focus:border-primary`.
  - Update error variants.
- **`src/features/auth/ui/LoginForm.tsx`**
  - Update styles to use utility classes (`text-danger`, `bg-danger-bg`, `text-text-sub`, etc.) instead of arbitrary values.
- **`src/app/(auth)/login/page.tsx` & `src/app/dashboard/page.tsx`**
  - Update styles to use `bg-bg-base`, `text-text-title`.

### Phase 2: Accessibility (a11y)
- **`src/shared/ui/Input.tsx`**
  - Generate unique IDs using `React.useId()` if not provided.
  - Add `aria-invalid={!!error}`.
  - Connect error messages via `aria-describedby`.
  - Ensure labels have correct `htmlFor`.

### Phase 3: Performance (RSC)
- **`src/app/(auth)/login/page.tsx`**
  - Remove `'use client'`.
- **`src/app/dashboard/page.tsx`**
  - Remove `'use client'`.
- **`src/features/auth/ui/LoginForm.tsx`**
  - Add `'use client'`.
- **`src/widgets/Dashboard/QuickStats.tsx`**
  - Add `'use client'`.

## 3. Verification
- Verify successful build.
- automated lint checks (if available).
