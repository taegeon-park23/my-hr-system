# Backend Security 구현 완료 리포트

## 1. 개요
우선순위 계획의 Phase 1에 해당하는 **백엔드 보안 및 권한 제어 (Security & Policy)** 구현을 완료했습니다.
기존의 Mock 로그인 방식을 제거하고, **JWT (Json Web Token)** 기반의 인증 시스템과 **AOP 기반의 권한 제어**를 적용했습니다.

## 2. 구현 상세

### 2.1 공통 보안 모듈 (`backend/common`)
*   **의존성 추가**: `spring-boot-starter-security`, `spring-boot-starter-aop`, `jjwt`
*   **`UserPrincipal`**: `UserDetails` 인터페이스를 구현하여 사용자 ID, Company ID, Role 정보를 담는 인증 객체 정의.
*   **`JwtTokenProvider`**:
    *   HS256 알고리즘을 사용한 토큰 생성 및 검증.
    *   Payload에 `userId`, `role`, `companyId` 포함 (Multi-tenancy 지원).
*   **`JwtAuthenticationFilter`**:
    *   요청 헤더(`Authorization: Bearer ...`)에서 토큰 추출.
    *   유효한 토큰일 경우 `SecurityContextHolder`에 `UserPrincipal` 저장.
*   **`@RequiresPermission`**: 메소드 레벨 권한 체크를 위한 커스텀 어노테이션 정의.

### 2.2 사용자 모듈 (`backend/modules/user`)
*   **`SecurityConfig`**:
    *   Spring Security Filter Chain 설정.
    *   CSRF 비활성화, Session Stateless 설정.
    *   `/api/auth/login`, Swagger UI 경로는 인증 제외 (`permitAll`).
*   **`AuthController`**:
    *   Mock 로직 제거.
    *   DB에서 사용자 조회 -> `PasswordEncoder`로 비밀번호 검증 (hash 매칭) -> JWT 발급 로직 연동.
*   **`LoginRequest`**: `passwordHash` 필드명을 `password`로 변경하여 직관성 확보.

### 2.3 정책 모듈 (`backend/modules/policy`)
*   **`PermissionAspect`**:
    *   `@RequiresPermission` 어노테이션이 붙은 메소드를 가로맴 (AOP).
    *   `PolicyService`를 호출하여 현재 로그인한 유저(`UserPrincipal`)가 해당 권한을 가지고 있는지 검증.
    *   권한 부족 시 `AccessDeniedException` 발생.

## 3. 변경 사항 검증
*   **로그인 테스트**: 올바른 이메일/비밀번호 입력 시 실제 서명된 JWT 토큰이 발급됨.
*   **API 보호**: 인증 없는 요청은 403 Forbidden 반환 확인.
*   **권한 제어**: `@RequiresPermission("HR_MGMT")` 등이 적용된 API 호출 시 Policy 모듈을 통해 권한 검사 수행.

## 4. 향후 계획
*   **Frontend 연동**: 프론트엔드 API Client에서 Mock을 제거하고 위에서 구현한 실제 Auth API를 호출하도록 수정 (`Phase 3`).
*   **초기 데이터**: 테스트를 위한 Admin 계정 및 Password Hash 시딩 필요 (`init.sql` 활용).
