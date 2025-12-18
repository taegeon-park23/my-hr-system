# **심층 요구사항 명세서: 시스템 및 테넌트 관리 (SPEC-07)**

## **0. 문서 이력 (Version History)**

| 버전 | 일자 | 작성자 | 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-12-18 | System | 최초 작성 | 테넌트 생성 로직 및 슈퍼 어드민 스위칭 기능 정의 |

## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 SaaS 플랫폼의 핵심인 **멀티 테넌트(Multi-Tenancy)** 관리 기능을 정의한다.
슈퍼 어드민(Super Admin)이 수행하는 고객사(Company) 생성, 구독 모델 관리, 그리고 문제 해결을 위한 **테넌트 스위칭(Impersonation)** 메커니즘을 명세한다.

### **1.2 범위**
* **테넌트 수명주기:** 생성(Provisioning) -> 활성(Active) -> 정지(Suspended) -> 삭제(Deleted)
* **전역 설정:** 비밀번호 정책, IP 화이트리스트 등 테넌트 공통/개별 설정.
* **스위칭(Switching):** 슈퍼 어드민의 타 테넌트 조회를 위한 Context 전환.

---

## **2. 핵심 결정 테이블 (Decision Table)**

### **2.1 테넌트 상태 전이 규칙**

| 현재 상태 | 이벤트 | 조건 | **다음 상태** | 액션 |
| :--- | :--- | :--- | :--- | :--- |
| **NONE** | `createCompany()` | 사업자번호 유효 | **ACTIVE** | 기본 Admin 계정 발급, DB 논리 파티션 확인 |
| **ACTIVE** | `suspendCompany()` | 요금 미납 등 | **SUSPENDED** | 모든 소속 사용자 로그인 차단 |
| **SUSPENDED** | `activateCompany()` | 요금 납부 완료 | **ACTIVE** | 로그인 차단 해제 |
| **ANY** | `deleteCompany()` | 유예 기간 경과 | **DELETED** | 데이터 보존 정책에 따라 백업 후 Soft Delete |

### **2.2 테넌트 스위칭 접근 제어 (Truth Table)**

| 케이스 | 조건 1: 요청자 Role | 조건 2: 대상 테넌트 존재 | 조건 3: 감사 사유 입력 | **결과** | **비고** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SW-TC1** | **SUPER_ADMIN** | True | True | **성공** | Audit Log에 'Admin Access' 기록 필수 |
| **SW-TC2** | SUPER_ADMIN | True | False | **실패** | "접근 사유를 입력해야 합니다." |
| **SW-TC3** | TENANT_ADMIN | - | - | **실패** | 타 테넌트 접근 절대 불가 |

---

## **3. 핵심 로직 의사 코드 (Pseudo-code)**

### **3.1 테넌트 프로비저닝 (`provisionTenant`)**

```java
FUNCTION ProvisionTenant(companyName, adminEmail, planType)
    // 1. 중복 검사
    IF repository.existsByName(companyName) THEN
        THROW Exception("Company name already exists.")
    END IF

    // 2. 테넌트 생성
    company = NEW Company(name=companyName, plan=planType, status=ACTIVE)
    savedCompany = companyRepository.save(company)
    
    // 3. 초기 관리자 계정 생성
    initialPassword = generateRandomPassword()
    adminUser = NEW User(
        email=adminEmail, 
        role=TENANT_ADMIN, 
        companyId=savedCompany.id
    )
    userRepository.save(adminUser)
    
    // 4. 기본 데이터 시딩 (Optional)
    // 기본 직급/직책/공휴일 데이터 등
    DataSeeder.run(savedCompany.id)
    
    RETURN { companyId: savedCompany.id, initialPassword: initialPassword }
END FUNCTION
```

### **3.2 테넌트 컨텍스트 스위칭 (`switchTenantContext`)**

```java
FUNCTION SwitchTenantContext(superAdminUser, targetCompanyId, reason)
    // 1. 권한 검증
    IF superAdminUser.role != SUPER_ADMIN THEN
        THROW AuthorizationException("Only Super Admin can switch context.")
    END IF
    
    targetCompany = companyRepository.findById(targetCompanyId)
    
    // 2. 감사 로그 기록 (Critical)
    auditLogRepository.save(
        actor=superAdminUser.id, 
        action="TENANT_SWITCH", 
        target=targetCompanyId, 
        reason=reason,
        timestamp=NOW()
    )
    
    // 3. 세션/토큰 재발급 (Impersonation Token)
    // 기존 세션을 유지하되, current_company_id만 변경된 임시 토큰 발급
    impersonationToken = tokenProvider.createToken(
        userId=superAdminUser.id,
        role=TENANT_ADMIN, // 해당 테넌트의 Admin 권한으로 동작
        companyId=targetCompanyId,
        isImpersonated=True
    )
    
    RETURN impersonationToken
END FUNCTION
```

---

## **4. 엣지 케이스 및 예외 처리**

| 상황 | 설명 | 처리 방침 |
| --- | --- | --- |
| **자기 자신 스위칭** | 슈퍼 어드민이 본인 소속(관리용 테넌트)으로 스위칭 | **허용**. 일반적인 Reset Context 동작. |
| **정지된 테넌트 접근** | 서비스 정지된 테넌트로 스위칭 시도 | **허용**. 관리자는 데이터 백업/복구를 위해 접근 가능해야 함. |
| **스위칭 상태에서 결재** | 스위칭한 상태로 휴가 결재 승인 시도 | **Audit 기록 강화**. `actor`는 슈퍼 어드민 ID로 명확히 기록되어야 함. |

## **5. 데이터 모델 참조**

* **Company:** `id`, `name`, `status`, `plan_type`, `created_at`
* **TenantConfig:** `company_id`, `password_policy`, `ip_whitelist`
* **AuditLog:** `actor_id`, `action`, `target_company_id`, `reason`
