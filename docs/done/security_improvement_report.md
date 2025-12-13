# 보안 및 인증 개선 완료 보고서 (Security Improvement Report)

## 1. 개요 (Overview)
`docs/plan/security_improvement_plan.md`에 따라 인증 에러 핸들링을 개선했습니다.
이제 토큰 만료 시 403 Forbidden 대신 명확한 에러 처리가 가능하며, 프론트엔드에서 즉시 로그아웃되어 사용자가 갇히는 현상을 방지합니다.

## 2. 작업 상세 (Details)

### 2.1 Backend (Spring Security)
- **JwtAuthenticationEntryPoint 구현:**
  - 인증되지 않은 요청(토큰 만료, 변조, 미노출)에 대해 `401 Unauthorized`를 명확히 반환하도록 구현.
  - 기존에는 Spring Security 기본 설정에 의해 403이 반환되는 경우가 있었음.
- **SecurityConfig 수정:**
  - `.exceptionHandling()`에 위 EntryPoint를 등록하여 필터 체인에서 발생하는 예외를 가로채도록 설정.

### 2.2 Frontend (Axios Interceptor)
- **Global Error Handling:**
  - `src/shared/api/client.ts`의 Response Interceptor 수정.
  - 기존 `401` 에러뿐만 아니라 `403` 에러 발생 시에도 `localStorage`의 토큰을 삭제하고 `/login` 페이지로 강제 리다이렉트.

## 3. 검증 (Verification)
- **Scenario:** 사용자가 만료된 토큰으로 '휴가 신청' 버튼 클릭.
- **Before:** 403 Error 발생 -> 화면 멈춤 (콘솔 에러만 출력).
- **After:** 401/403 Error 발생 -> 즉시 로그인 페이지로 이동 -> 재로그인 유도.

## 4. 결론 (Conclusion)
사용자 경험을 저해하던 403 에러 루프 문제를 해결했습니다. 향후 Refresh Token 도입을 위한 기반(401 응답 표준화)이 마련되었습니다.
