# System Fixes Report (Frontend Layout & Backend Swagger)

## 1. 개요
*   **작업 일시**: 2025-12-12
*   **목적**: 사용자가 보고한 "Frontend Runtime Error" 및 "Backend Whitelabel Error" 해결.

## 2. 문제점 및 해결 (Issue & Resolution)

### 2.1 Frontend Issue
*   **증상**: `localhost:3000/login` 접속 시 "Runtime Error: Missing <html> and <body> tags in the root layout" 발생.
*   **원인**: `frontend/app` 폴더 삭제 후, `src/app`에 Next.js가 요구하는 Root Layout(`layout.tsx`)이 존재하지 않음.
*   **해결**: `frontend/src/app/layout.tsx` 파일 생성.
    ```tsx
    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <body>{children}</body>
        </html>
      );
    }
    ```

### 2.2 Backend Issue
*   **증상**: `localhost:8080/swagger-ui.html` 접속 시 404 Whitelabel Error 발생.
*   **원인**:
    1.  `app` 모듈의 `build.gradle`에 `springdoc-openapi-starter-webmvc-ui` 의존성 누락.
    2.  `application.yml`에 Swagger UI 경로 설정 누락 (이전 설정 파일 삭제됨).
*   **해결**:
    *   `backend/app/build.gradle`: 의존성 추가.
    *   `backend/app/src/main/resources/application.yml`: `springdoc` 설정 복구.

## 3. 검증 (Verification)
*   Frontend: `http://localhost:3000` 접속 시 에러 없이 화면 로드.
*   Backend: `http://localhost:8080/swagger-ui.html` 접속 시 Swagger UI 로드.
