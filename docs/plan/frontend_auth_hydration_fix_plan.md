# Frontend Auth Hydration Fix Plan

## 1. 개요 (Overview)
**작업 목표**: Next.js Pages Router 환경에서 Zustand Persist Middleware(`skipHydration: true`) 사용 시 발생하는 "무한 로딩(Infinite Loading)" 및 "인증 상태 불일치" 문제를 해결한다.  
**원인**: `skipHydration: true` 설정으로 인해 스토어 복원(Rehydration)이 자동으로 수행되지 않으나, 이를 수동으로 트리거하는 로직이 부재하여 `_hasHydrated` 상태가 `false`로 유지됨. 이로 인해 `AuthGuard`가 무한 대기 상태에 빠짐.

## 2. 분석 및 변경 범위 (Analysis & Scope)

### 2.1 현재 상황
- **Auth Store**: `skipHydration: true`가 설정되어 있으며, `onRehydrateStorage`에서 `setHasHydrated(true)`를 호출하도록 구성되어 있음.
- **Auth Guard**: `_hasHydrated` 플래그를 확인하고 있으나, Hydration이 시작되지 않아 영원히 로딩 스피너를 표시하거나 잘못된 리다이렉트를 수행할 위험이 있음.
- **_app.tsx**: 전역적인 Hydration 트리거 로직이 존재하지 않음.

### 2.2 변경 범위
1.  **`src/shared/stores/useAuthStore.ts`**: `_hasHydrated` 상태 관리 로직 재확인 및 필요 시 보완.
2.  **`src/pages/_app.tsx`**: 애플리케이션 마운트 시 `useAuthStore.persist.rehydrate()`를 호출하는 로직 추가.
3.  **`src/features/auth/ui/AuthGuard.tsx`**: `_hasHydrated` 상태가 `true`가 될 때까지 확실하게 로딩 상태(Spinner)를 유지하고, 이후에 인증 검사를 수행하도록 강화.

## 3. 상세 구현 계획 (Detailed Implementation Plan)

### 3.1 Auth Store (`src/shared/stores/useAuthStore.ts`)
- 현재 코드가 이미 `_hasHydrated`와 `onRehydrateStorage`를 포함하고 있는지 확인되었으므로, 기존 로직이 올바르게 작동하는지 점검한다.
- `partualize` 옵션에서 `user`, `isAuthenticated`, `accessToken`만 persist 되는지 확인.

### 3.2 Global Hydration (`src/pages/_app.tsx`)
- `_app.tsx`에서 `useEffect`를 사용하여 컴포넌트 마운트 시점(Client Side)에 `useAuthStore.persist.rehydrate()`를 1회 실행한다.
- 이를 통해 모든 페이지 진입 시 스토어가 로컬 스토리지로부터 상태를 복원하도록 보장한다.

```typescript
// src/pages/_app.tsx 예시
import { useEffect } from 'react';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        useAuthStore.persist.rehydrate();
    }, []);

    return <Component {...pageProps} />;
}
```

### 3.3 Auth Guard (`src/features/auth/ui/AuthGuard.tsx`)
- Hydration이 완료되지 않은 경우(`!_hasHydrated`)에는 **무조건** 로딩 스피너를 반환하여 잘못된 리다이렉트를 방지한다.
- Hydration 완료 후(`_hasHydrated === true`)에만 `isAuthenticated` 및 토큰 유무를 검사하여 리다이렉트 처리한다.

## 4. 검증 전략 (Verification Strategy)

### 4.1 수동 검증
1.  **로그인 유지 테스트**: 로그인 후 새로고침(F5) 시 로그인이 풀리지 않고 유지되는지 확인.
2.  **무한 로딩 해결 확인**: `/admin` 등 보호된 라우트 진입 시 스피너가 잠시 나타났다가 정상 콘텐츠가 표시되는지 확인.
3.  **비로그인 접근 차단**: 로그인하지 않은 상태에서 보호된 라우트 접근 시 `/login`으로 리다이렉트 되는지 확인.

### 4.2 코드 검증
- `npm run build`를 수행하여 타입 에러 및 빌드 오류 가 없는지 확인.
