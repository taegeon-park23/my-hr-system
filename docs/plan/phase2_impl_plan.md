# Phase 2 Implementation Plan

## 1. Backend Verification
- [ ] Check `PayrollController` for latest payslip endpoint.
- [ ] Check `OrganizationController` (or User/Team) for team count endpoint.

## 2. Mocking (MSW)
- [ ] If APIs missing, update `src/mocks/handlers.ts` with:
    - `GET /api/payroll/my/latest`
    - `GET /api/stats/team-count`

## 3. Data Hooks
- [ ] Refactor `src/shared/hooks/useDashboardStats.ts` to use `useSWR`.
- [ ] Remove hardcoded data.

## 4. UI Components
- [ ] Refactor `QuickStats.tsx`:
    - Create `src/shared/ui/StatCard.tsx`.
    - Use `StatCard` in `QuickStats`.
    - Pass data from hook to view.
