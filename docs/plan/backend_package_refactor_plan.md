# 백엔드 패키지 구조 리팩토링 계획 (Backend Package Structure Refactoring Plan)

## 1. 분석 (Analysis)
### 1.1 배경 (Background)
프로젝트 기술 정의서(Technical Specification) 3.2항에 따르면, 비즈니스 모듈은 `com.hr.modules.{module_name}` 패키지 구조를 따라야 합니다. 현재 대부분의 모듈이 `com.hr.{module_name}` 구조를 따르거나, 일부 모듈(Tenant)은 두 구조가 혼재되어 있어 아키텍처 원칙에 위배됩니다.

### 1.2 현황 (Current Status)
- **User Module:** `com.hr.user` (계층 위반)
- **Approval Module:** `com.hr.approval` (계층 위반)
- **Vacation Module:** `com.hr.vacation` (계층 위반)
- **Tenant Module:** `com.hr.tenant` 와 `com.hr.modules.tenant` 혼재 (심각한 위반)
- **Common Module:** `com.hr.common` (정상)

## 2. 변경 범위 (Scope)

### 2.1 대상 모듈 (Target Modules)
아래 8개 모듈의 소스 코드를 `com.hr.modules.{name}` 패키지로 이동합니다.
1. `user`
2. `approval`
3. `tenant` (두 패키지 병합)
4. `vacation`
5. `attendance`
6. `payroll`
7. `org`
8. `policy`

### 2.2 제외 대상 (Exclusions)
- `common` 모듈 (현재 `com.hr.common` 유지)
- `queries` 모듈 (현재 `com.hr.queries` 유지)

## 3. 상세 구현 계획 (Implementation Steps)

### 3.1 파일 이동 (Move Files)
각 모듈별로 디렉토리 구조를 변경합니다.
- **Before:** `backend/modules/{name}/src/main/java/com/hr/{name}`
- **After:** `backend/modules/{name}/src/main/java/com/hr/modules/{name}`

### 3.2 코드 수정 (Code Modification)
1. **Package Declaration:** 모든 `.java` 파일의 최상단 `package com.hr.xxx;` 를 `package com.hr.modules.xxx;` 로 수정합니다.
2. **Imports:** 다른 모듈 또는 같은 모듈 내의 참조를 `import com.hr.modules.xxx;` 형태로 일괄 수정합니다.
3. **Application Main Class:** 스프링 부트 애플리케이션의 `@SpringBootApplication` 및 `@ComponentScan` 설정이 올바른 패키지를 스캔하도록 확인합니다.

## 4. 검증 전략 (Verification Strategy)

### 4.1 빌드 검증 (Build Verification)
- **명령어:** `./gradlew clean build -x test`
- **기대 결과:** 컴파일 에러 없이 `BUILD SUCCESS` 메시지 출력.

### 4.2 의존성 순환 확인 (Circular Dependency Check)
- 구조 변경 후 모듈 간 잘못된 참조(import)가 남아있는지 확인합니다.

### 4.3 어플리케이션 실행 (Application Run)
- **명령어:** `./gradlew bootRun`
- **기대 결과:** 서버가 8080 포트에서 정상적으로 시작되어야 함.
