# Frontend Root Redirect Implementation Report

## 1. 개요
*   **작업 내용**: Frontend 루트 경로(`/`) 접속 시 자동으로 로그인 페이지(`/login`)로 리다이렉트되도록 설정.
*   **목적**: "Proposal 1" (Frontend 수정) 이행. `frontend/app` 폴더 삭제 후, `src/app/page.tsx`가 명시적으로 Entry Point 역할을 하도록 보장.

## 2. 변경 사항
*   **File**: `frontend/src/app/page.tsx`
*   **Implementation**: Next.js App Router의 `redirect` 함수 사용.

```tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}
```

## 3. 검증
*   `http://localhost:3000/` 접속 시 `http://localhost:3000/login`으로 이동 확인 필요.
