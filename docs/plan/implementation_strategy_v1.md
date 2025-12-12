# **HR 시스템 구현 전략 수립 (Implementation Strategy)**

## **1. 개요 (Overview)**
본 문서는 **Modular Monolith** 아키텍처와 **CQRS** 패턴을 기반으로 하는 HR 시스템의 단계별 구현 계획을 정의합니다. `Project_Technical_Definition.md`와 `Database_Design_Specification.md`에 정의된 원칙을 준수하며, 위험 요소를 최소화하고 결과물의 품질을 보장하는 순서로 진행합니다.

## **2. 단계별 로드맵 (Phased Roadmap)**

### **Phase 1: 인프라 및 기반 구축 (Infrastructure & Foundation)**
**목표:** 로컬 개발 환경을 구성하고, 백엔드/프론트엔드 공통 모듈을 구현하여 개발 생산성을 확보한다.

1.  **Repository Setup**
    *   Monorepo 구조 미사용 (Backend/Frontend 별도 디렉토리 관리 or Gradle Multi-module + Next.js)
    *   `.gitignore`, `.editorconfig` 설정
    *   Git Flow 브랜치 전략 수립
2.  **Docker Environment**
    *   `docker-compose.yml` 작성 (MySQL, Redis, MailHog)
    *   DB 초기화 스크립트(`init.sql`) 작성: 테넌트 테이블 및 초기 슈퍼 어드민 계정
3.  **Backend Core (Spring Boot)**
    *   Multi-module 구조 세팅 (`modules`, `queries`, `common`)
    *   **Architecture Enforcement:** ArchUnit 테스트 코드 작성 (모듈 간 순환 참조 방지)
    *   **Common Lib:** Global Exception Handler, Response Envelope (DTO)
    *   **Security:** Spring Security + JWT, `PolicyModule` 연동을 위한 AOP Skeleton
4.  **Frontend Core (Next.js)**
    *   Next.js 14+ App Router 초기화
    *   Tailwind CSS 및 Design Token 설정
    *   Storybook 초기화 및 `shared/ui` 기본 컴포넌트(Button, Input) 작성
    *   API Client Wrapper (Axios + Interceptor)

### **Phase 2: 핵심 모듈 구현 (Core Modules)**
**목표:** 시스템의 뼈대가 되는 사용자, 조직, 권한 관리 기능을 구현하여 "로그인이 되고 메뉴가 보이는" 상태를 만든다.

1.  **System & Tenant Module (Backend)**
    *   `TenantConfig` 기반 동적 설정 구현
    *   슈퍼 어드민용 테넌트 CRUD API
2.  **User & Org Module (Backend)**
    *   사용자 및 부서 CRUD
    *   **계층형 쿼리(Recursive Query)** 구현 및 최적화
3.  **Policy Module (Backend)**
    *   `DataScope` 로직 구현 (Role + Dept + Tenant)
    *   `@RequiresPermission` AOP 동작 검증
4.  **Auth & Layout (Frontend)**
    *   로그인 페이지 (`features/auth`)
    *   `AuthGuard` 구현 및 동적 메뉴 렌더링
    *   사이드바 및 헤더 레이아웃 (`widgets/Sidebar`)

### **Phase 3: 비즈니스 도메인 구현 (Business Domain)**
**목표:** 실제 HR 업무(결재, 근태)를 처리하는 복잡한 로직을 구현한다.

1.  **Approval Engine (Backend)**
    *   `ApprovalRequest` 생성 및 상태 관리
    *   Strategy Pattern을 이용한 결재선 생성 로직 유연화
2.  **Vacation & Attendance (Backend/Frontend)**
    *   CQRS 적용: `VacationalBalance` 계산(Write) vs 잔여 연차 조회(Read) 분리
    *   근태 캘린더 컴포넌트 (`features/attendance`)
    *   결재 신청/승인 UI 및 연동
3.  **Payroll (Backend)**
    *   민감 데이터 암호화/마스킹
    *   급여 계산 배치(Batch) 로직 (테넌트별 Custom Logic 적용 구조)

### **Phase 4: 안정화 및 프로덕션 준비 (Stabilization)**
1.  **Testing**
    *   Core Module 단위 테스트 (Unit Test)
    *   주요 시나리오 통합 테스트 (Integration Test)
2.  **Monitoring & Logging**
    *   Logback 설정 (JSON Logs)
    *   Prometheus + Grafana 연동 준비

---

## **3. 주차별 상세 계획 (Weekly Plan)**

### **Week 1: Project Setup & Core Modules**
*   [ ] Docker Compose 환경 구성 및 DB 스키마(`users`, `companies`, `departments`) 적용
*   [ ] Spring Boot 멀티 모듈 프로젝트 생성 및 의존성 설정
*   [ ] Next.js 프로젝트 생성 및 Storybook/Tailwind 설정
*   [ ] `common` 모듈 (Error Handling, API Envelope) 구현

### **Week 2: Identity & Organization**
*   [ ] User/Dept 도메인 엔티티 및 Repository 구현
*   [ ] 로그인/JWT 발급 및 검증 로직 구현 (`PolicyModule` 기초)
*   [ ] Frontend 로그인 페이지 및 레이아웃 구현
*   [ ] 조직도(Tree View) 조회 기능 구현 (Recursive Query)

### **Week 3: Approval & Policy**
*   [ ] `PolicyModule` 심화: `@RequiresPermission`, `DataScope` 구현
*   [ ] 결재 엔진 (`modules/approval`) 스키마 및 기본 로직 구현
*   [ ] 프론트엔드 `AuthGuard` 적용 및 메뉴별 권한 제어

---

## **4. 검증 전략 (Verification Strategy)**

*   **아키텍처 검증:** `ArchUnit`을 모든 빌드 시점에 실행하여 모듈 간 참조 위반 시 빌드 실패 처리.
*   **테넌트 격리 검증:** Integration Test에서 `company_id`가 다른 데이터를 조회할 수 없는지 검증하는 케이스 필수 작성.
*   **API 계약 검증:** 프론트엔드 개발 전 Swagger/Postman Collection을 통해 API 명세 확정 및 Mock Server 활용.
