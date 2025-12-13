# 프로젝트 분석 및 향후 업무 로드맵 (Project Analysis & Roadmap)

## 1. 개요 (Overview)
본 문서는 프로젝트의 현재 상태를 분석하고, 'Modular Monolith' 아키텍처와 'Feature-Sliced Design' 원칙에 입각하여 향후 진행해야 할 핵심 업무를 정의합니다.

## 2. 현황 분석 (Current Status)

### 2.1 문서 (Documentation)
- **4대 핵심 문서 확보 완료:**
  - 프로젝트 기술 정의서 (Technical Specification)
  - 데이터베이스 설계 정의서 (Database Design Specification)
  - 보안 정책 매트릭스 (Security Policy Matrix)
  - API 설계 표준 정의서 (API Design Guidelines)

### 2.2 백엔드 (Backend)
- **구조:** Gradle Multi-module 기반의 Modular Monolith 구조.
- **모듈 현황:**
  - `modules:user`, `modules:approval`, `modules:tenant`, `modules:policy`, `modules:org`, `modules:vacation`, `modules:attendance`, `modules:payroll` 존재 확인.
  - `common`, `queries` 모듈 존재 확인.
- **아키텍처 위반 사항 (Non-compliance):**
  - **패키지 명명 규칙 불일치:**
    - 문서 정의: `com.hr.modules.{module_name}` (예: `com.hr.modules.user`)
    - 실제 코드:
      - `com.hr.user` (User 모듈)
      - `com.hr.modules.tenant` (Tenant 모듈) -> 문서 준수
      - `com.hr.approval` (Approval 모듈)
    - **조치 필요:** 모든 모듈의 루트 패키지를 `com.hr.modules.{name}`으로 통일하여 구조적 일관성 확보 필요.

### 2.3 프론트엔드 (Frontend)
- **구조:** Next.js (App Router) + FSD (Feature-Sliced Design).
- **모듈 현황:**
  - `features/auth`, `features/approval` 등 핵심 기능별 분리 확인.
  - `app/(auth)/login` 등 라우팅 구조 확인.
  - 구조적으로 양호함.

## 3. 향후 우선순위 업무 (Priority Tasks)

다음 단계로 진행해야 할 업무 리스트입니다.

### [Task 1] 백엔드 패키지 구조 리팩토링 (Backend Refactoring)
- **목표:** 모든 백엔드 모듈의 패키지명을 `com.hr.modules.{name}` 규칙에 맞춰 표준화.
- **이유:** 모듈 간 격리 및 문서와의 일치성을 위해 필수. 현재 혼용된 상태로는 추후 모듈 분리 시 혼란 야기.
- **세부 작업:**
  - `modules/user` -> `com.hr.modules.user` 로 이동.
  - `modules/approval` -> `com.hr.modules.approval` 로 이동.
  - 기타 모듈 일괄 적용.

### [Task 2] Policy 모듈 (PDP) 핵심 로직 검증 및 구현 (Policy Implementation)
- **목표:** `Security_Policy_Matrix.md`에 정의된 권한 제어 로직(AOP 기반)이 실제로 동작하는지 검증 및 구현.
- **이유:** 보안은 프로젝트의 가장 중요한 비기능 요구사항임. 비즈니스 로직 구현 전 기반이 마련되어야 함.

### [Task 3] TenantConfig (멀티테넌트 설정) 구현 (Multi-tenancy)
- **목표:** DB 기반의 테넌트 설정 로직 구현.
- **이유:** 소스 코드 수정 없이 테넌트별 기능을 제어(Feature Flag)할 수 있는 기반 필요.

### [Task 4] 공통 CI/CD 파이프라인 구축 (DevOps)
- **목표:** GitHub Actions 등을 활용한 자동 빌드/테스트 환경 구성.
- **이유:** 안정적인 통합과 배포를 위해 초기 단계부터 구축 권장.

## 4. 결론 (Conclusion)
현재 프로젝트의 기본 골격은 잘 잡혀 있으나, 백엔드 패키지 구조의 정리가 최우선 과제입니다. 이후 보안(Policy)과 멀티테넌트 설정(TenantConfig)을 우선적으로 구현하여 비즈니스 로직 확장의 기반을 다지는 것을 제안합니다.
