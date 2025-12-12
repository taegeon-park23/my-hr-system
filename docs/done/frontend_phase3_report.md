# Frontend Phase 3 작업 리포트

## 1. 개요
로그인 이후의 메인 화면인 대시보드 레이아웃과 접근 제어(AuthGuard), 그리고 네비게이션(Sidebar)을 구현했습니다.

## 2. 작업 상세 내용

### 2.1 AuthGuard 구현
- `src/features/auth/ui/AuthGuard.tsx`: 클라이언트 사이드 라우트 보호 컴포넌트.
- localStorage에 토큰이 없으면 `/login`으로 리다이렉트 처리.
- 렌더링 전 Loading Spinner 표시.

### 2.2 Sidebar Widget
- `src/widgets/Sidebar`: 앱의 메인 네비게이션.
- Dashboard, Organization, Approval, Settings 메뉴 링크 제공.
- 현재 경로(Active Path)에 따른 하이라이팅 처리.
- 반응형 디자인 고려 (데스크탑 기준 고정).

### 2.3 Dashboard Layout
- `src/app/dashboard/layout.tsx`: Sidebar와 Main Content 영역을 결합한 레이아웃.
- `<AuthGuard>`로 전체를 감싸서 비로그인 사용자 접근 차단.

## 3. 결과물
- **대시보드 접속**: `/dashboard` 경로 접속 시.
    - 미로그인 -> 로그인 페이지로 이동.
    - 로그인 -> 사이드바가 포함된 대시보드 화면 표시.

## 4. 커밋 예정 사항
- 위 변경 사항 전체 (Layout, Guard, Widget).
