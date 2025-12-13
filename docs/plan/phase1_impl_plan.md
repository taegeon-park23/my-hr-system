# Phase 1 Implementation Plan

## 1. Utilities
- [ ] Create `src/shared/lib/utils.ts` for `cn` function.

## 2. Store
- [ ] Update `src/shared/stores/useAuthStore.ts` to add `skipHydration: true`.

## 3. API Client
- [ ] Refactor `src/shared/api/client.ts` to export `setupInterceptors` and remove global interceptors.
- [ ] Create `src/shared/api/InterceptorInitializer.tsx` to call `setupInterceptors` with `router.push` and `toast`.

## 4. Layout
- [ ] Update `src/app/layout.tsx` to use `InterceptorInitializer`.
- [ ] Remove `AuthListener` and `GlobalErrorListener` if they are redundant.
