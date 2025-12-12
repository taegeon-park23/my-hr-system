# Frontend Phase 2 작업 리포트

## 1. 개요
프론트엔드 개발의 기반이 되는 FSD(Feature-Sliced Design) 폴더 구조를 확립하고, 공통 UI 컴포넌트와 로그인 기능을 구현했습니다.

## 2. 작업 상세 내용

### 2.1 FSD 폴더 구조 초기화
Architecture Rule에 따라 다음 디렉토리를 생성했습니다.
- `src/features`: 비즈니스 로직이 포함된 기능 모듈 (예: auth)
- `src/shared`: 비즈니스 로직이 없는 순수 UI 및 유틸리티 (예: ui, lib)
- `src/widgets`: 여러 기능을 조합한 복합 컴포넌트

### 2.2 Shared UI 컴포넌트
Storybook 기반 개발을 위해 기본 컴포넌트를 작성했습니다.
- **Button**: Primary, Secondary, Danger 변형 및 Loading 상태 지원.
- **Input**: Label, Error Message, Helper Text 지원.
- *각 컴포넌트에 대한 Story 파일(*.stories.tsx) 동시 생성 완료.*

### 2.3 Auth Feature (로그인)
- **API Client**: `authApi.ts`에 Axios 기반 API 클라이언트 및 Mock Login 함수 구현.
- **UI**: `LoginForm.tsx` 구현. 이메일/비밀번호 입력 및 유효성 검사, 로딩 상태 처리.

### 2.4 Page 구현
- `app/(auth)/login/page.tsx`: Next.js App Router 기반 로그인 페이지 구현.

## 3. 결과물
- **로그인 화면**: `/login` 경로에서 확인 가능.
- **스토리북**: `npm run storybook` 실행 시 Button, Input, LoginForm 컴포넌트 테스트 가능.

## 4. 향후 계획
- 로그인 후 대시보드 진입을 위한 AuthGuard 구현.
- 실제 백엔드 API 연동 (Phase 1 완료 후).
