# 인증 및 보안 개선 계획 (Authentication & Security Improvement Plan)

## 1. 개요 (Overview)
현재 발생하는 **JWT 만료 시 403 Error** 문제와 **LocalStorage 보안 우려**를 해결하기 위한 계획입니다.
사용자 요청에 따라 "토큰 만료 시 로그인 페이지 리다이렉트"를 우선적으로 구현하며, 향후 "Refresh Token" 도입을 위한 기반을 마련합니다.

## 2. 문제 분석 (Analysis)
1.  **403 Forbidden Error:** JWT가 만료되면 서버는 인증 정보 없이 요청을 처리하려 하고, Spring Security는 이를 '권한 없음(Anonymous)'으로 간주하여 403을 반환합니다. 프론트엔드는 401만 처리하고 있어 403 발생 시 사용자가 갇히게 됩니다.
2.  **JWT Handling:** 현재는 Simple Access Token 방식이며 리프레시 토큰이 없습니다. 따라서 만료 시 재로그인이 필수입니다.
3.  **LocalStorage:** XSS 공격에 취약할 수 있으나, 현재 구조상 가장 빠르게 적용 가능한 방식입니다. HttpOnly Cookie 도입은 백엔드 응답 구조 변경이 필요합니다.

## 3. 개선 목표 (Goals)
1.  **Immediate Fix:** 프론트엔드에서 403 에러 발생 시(또는 특정 에러 메시지 감지 시) 로그아웃 및 로그인 페이지로 이동시킵니다.
2.  **Backend Improvement:** JWT 만료 시 명확하게 **401 Unauthorized**를 반환하도록 `JwtAuthenticationEntryPoint`를 구현합니다. (현재는 403이 내려가는 경우가 많음)

## 4. 구현 상세 (Implementation Details)

### 4.1 Backend: Authentication Entry Point (Optional but Recommended)
- **파일:** `com.hr.modules.user.config.JwtAuthenticationEntryPoint` (New)
- **내용:** 인증되지 않은 사용자(만료된 토큰 포함)의 접근 시 403 대신 401 에러를 반환하여 프론트엔드가 명확히 구분하게 함.
- **SecurityConfig:** `exceptionHandling().authenticationEntryPoint(...)` 설정 추가.

### 4.2 Frontend: Global Error Interceptor
- **파일:** `src/shared/api/client.ts`
- **변경 사항:**
  - 403 Forbidden 에러 감지 시 로그아웃 처리 추가.
  - (선택) JWT Decode를 통해 만료 시간(`exp`)을 사전 체크하는 로직 추가 가능.

### 4.3 Future: Refresh Token Strategy (Phase 2)
- *이번 작업 범위에는 포함하지 않으나 제안함.*
- **구조:** `AccessToken`(수명 짧음) + `RefreshToken`(수명 김, HttpOnly Cookie, DB 저장).
- **로직:** 401 발생 -> Refresh Token으로 Access Token 재발급 시도 -> 실패 시 로그아웃.

## 5. 검증 계획 (Verification Plan)
1.  **Backend:** 유효하지 않은/만료된 토큰으로 API 호출 시 401 응답 확인.
2.  **Frontend:** API 호출 중 401/403 발생 시 즉시 로그인 페이지로 리다이렉트 되는지 확인.

## 6. 일정 (Schedule)
- 10분: Backend 401 Handling (EntryPoint 구현).
- 5분: Frontend Interceptor 수정 (403 대응).
