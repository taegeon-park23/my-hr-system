# Phase 2: Tenant 관리 기능 강화 상세 설계서

## 1. 개요
테넌트 생성 자동화(Provisioning)와 슈퍼 어드민의 테넌트 지원 기능(Impersonation)을 구현하여 운영 효율성과 보안을 강화합니다.

## 2. Impersonation (슈퍼 어드민 대리 접속)
### 2.1 JWT 클레임 확장
- `JwtTokenProvider`: `isImpersonated` (Boolean) 클레임 추가.
- `UserPrincipal`: `impersonated` 필드 추가.

### 2.2 테넌트 스위칭 API
- `TenantController` (슈퍼 어드민 전용): `POST /api/tenants/{id}/impersonate`
- 로직:
  1. 현재 접속자가 `SUPER_ADMIN`인지 확인.
  2. 대상 테넌트의 `TENANT_ADMIN` 계정을 임의로 하나 조회하거나, 테넌트 정보만으로 토큰 발행.
  3. `isImpersonated: true` 클레임이 포함된 새로운 JWT 발급.

## 3. Provisioning (테넌트 생성 자동화)
### 3.1 이벤트 정의
- `TenantCreatedEvent`: `tenantId`, `tenantName`, `adminEmail` 등 포함.

### 3.2 Provisioning Listener 구현
- `TenantProvisioningService` (신설):
  - `TenantCreatedEvent` 구독.
  - **조직 관리:** 해당 테넌트의 최상위 부서(Root Department) 생성.
  - **사용자 관리:** 해당 테넌트의 관리자(`TENANT_ADMIN`) 계정 자동 생성 (기본 비밀번호 설정).
  - **초기화:** 기본 역할(Role) 및 접근 권한(Policy) 시딩 (필요 시).

## 4. 모듈간 협력 구조
- `TenantModule` -> `EventPublisher` -> `TenantCreatedEvent`
- `TenantProvisioningService` (In `TenantModule` or `UserModule`? -> 격리 원칙에 따라 `TenantModule`에서 `UserModuleApi`와 `OrgModuleApi`를 호출하여 구현).

## 5. 작업 순서
1. `common/event`: `TenantCreatedEvent` 추가.
2. `common/security`: `JwtTokenProvider` 및 `UserPrincipal` 수정.
3. `user/api`: `UserModuleApi`에 `createInitialAdmin(companyId, email, name)` 추가.
4. `org/api`: `OrgModuleApi`에 `createRootDepartment(companyId, name)` 추가.
5. `tenant/service`: `TenantService`에서 테넌트 생성 시 이벤트 발행.
6. `tenant/service`: `TenantProvisioningService` 구현 (리스너).
7. `tenant/controller`: Impersonation API 추가.

## 6. 검증 계획
- **Unit Test:** `JwtTokenProvider`의 impersonation 클레임 포함 여부 확인.
- **Integration Test:** 테넌트 생성 후 Admin 계정과 Root 부서가 DB에 정상 생성되는지 확인.
- **Security Test:** 일반 유저가 Impersonate API 접근 시 차단 확인.
