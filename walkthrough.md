# Frontend Design System Walkthrough

## Overview
This document outlines the changes made to the frontend module to implement the new "Next-Gen HR SaaS System" Design System. The implementation focuses on standardizing colors, typography, and core component styles using Tailwind CSS v4 and strict TypeScript patterns.

## 1. Global Design Tokens
We have replaced the default Tailwind colors with semantic CSS variables in `src/app/globals.css`.
- **Primary Color (Indigo)**: `--color-primary`, `--color-primary-dark`
- **Background Base (Slate-50)**: `--color-bg-base`
- **Status Colors**: `--color-success`, `--color-warning`, `--color-danger`, `--color-info`, `--color-neutral`
- **Typography**: `--color-text-title`, `--color-text-body`, `--color-text-sub`

## 2. Component Refactoring
All atomic components in `src/shared/ui` have been refactored to strictly adhere to the Design System Guide.

### Button (`Button.tsx`)
- **Updates**: Added `ghost` variant. Updated standard sizes to 32px (sm) and 40px (md).
- **Styles**: Uses `--color-primary` for main actions.

### Input / Select (`Input.tsx`, `Select.tsx`)
- **Updates**: Standardized `h-10` height.
- **Focus**: Uses semantic primary color ring.
- **Error**: Uses semantic danger color (Rose).

### Badge (`Badge.tsx`)
- **Updates**: Renamed/Added variants to match semantic statuses: `success`, `warning`, `danger`, `info`, `neutral`.
- **Styles**: Uses subtle backgrounds (e.g., `bg-emerald-100`) and dark text.

### Modal (`Modal.tsx`)
- **Updates**: Added `backdrop-blur-sm` to overlay. Updated title colors.

### Table (`Table.tsx`)
- **Updates**: Header uses `bg-slate-50`, uppercase, and semantic text colors.

## 3. Page Updates
- **Login Page**: Updated to use the new Design System tokens and `LoginForm`.
- **Dashboard**: Updated Dashboard and Quick Actions headers to use semantic typography.

## 4. Verification
### View Storybook
To verify the components closely:
```bash
npm run storybook
```
Check `Shared/UI` components in the Storybook sidebar.

### Check Pages
Run the dev server:
```bash
npm run dev
```
Visit `/login` and `/dashboard` to see the new styles in action.

## 5. Artifacts
- **Report**: `docs/done/frontend_design_system_impl_report.md`
- **Plan**: `docs/plan/frontend_design_system_impl_plan.md`
