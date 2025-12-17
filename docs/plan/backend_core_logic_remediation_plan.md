# Backend Core Logic Remediation Plan (핵심 로직 보완 및 미구현 기능 구현 계획)

## 1. 개요 (Overview)
본 계획은 프로젝트 분석 리포트에서 식별된 "미구현 기능(Unimplemented Features)"과 "하드코딩된 로직(Hardcoded Logic)"을 해결하여, 시스템을 프로토타입 단계에서 MVP(Minimum Viable Product) 단계로 발전시키는 것을 목표로 합니다.

## 2. 작업 목표 (Objectives)
1.  **급여(Payroll) 모듈 정상화**: 하드코딩된 급여/세금 계산 로직을 제거하고, 확장 가능한 계산기 구조(`TaxCalculator`)를 도입합니다.
2.  **알림(Notification) 모듈 안정성 확보**: 동기식 메일 발송 로직을 비동기(`@Async`)로 전환하고, 트랜잭션 분리를 통해 안정성을 확보합니다.
3.  **채용(Recruitment) 모듈 신설**: 누락된 채용 도메인의 기본 구조(Controller, Service, Repository, Entity)를 구현합니다.
4.  **결재(Approval) 모듈 고도화**: 단순 단건 결재 로직을 다중 결재 및 단계별 처리가 가능한 구조로 개선합니다.

## 3. 상세 구현 계획 (Implementation Details)

### 3.1 급여 모듈 (Payroll)
- **대상 파일**: `backend/modules/payroll/...`
- **변경 사항**:
    - `TaxCalculator` 인터페이스 및 `SimpleTaxCalculator` 구현체 추가.
    - 2024년 기준 간이 세액표(약식 구간)를 적용하여 소득세 계산 로직 현실화.
    - `SalaryCalculationService` 리팩토링: `TaxCalculator` 주입 및 식대/수당 파라미터화.

### 3.2 알림 모듈 (Notification)
- **대상 파일**: `backend/modules/notification/...`
- **변경 사항**:
    - `MailService.sendEmail` 메서드에 `@Async` 적용 (응답 지연 방지).
    - 메일 발송 로직과 로그 저장 로직의 트랜잭션 분리 (`@Transactional` 재검토).
    - `Spring Async` 설정 활성화.

### 3.3 채용 모듈 (Recruitment) [신규]
- **생성 경로**: `backend/modules/recruitment/...`
- **구현 내용**:
    - **Entity**: `JobPosting`(채용공고), `Applicant`(지원자).
    - **Repository**: JpaRepository 생성.
    - **Service**: 공고 생성/조회, 지원서 접수 로직.
    - **Controller**: `/api/recruitment/**` 엔드포인트 노출.

### 3.4 결재 모듈 (Approval)
- **대상 파일**: `backend/modules/approval/...`
- **변경 사항**:
    - `ApprovalRequest` 생성 시 다중 결재선 지원을 위한 로직 확장.
    - `ApprovalStep` 상태 관리 로직 개선.

## 4. 데이터베이스 변경 (Database Schema)
- **Recruitment 모듈 테이블 추가**:
    - `recruitment_job_postings`
    - `recruitment_applicants`
    - 공통 컬럼: `company_id` (Multi-tenant 필수 준수).

## 5. 검증 전략 (Verification Strategy)
1.  **ArchUnit 테스트**:
    - 모듈 간 순환 참조 여부 검증.
    - `recruitment` 모듈의 패키지 규칙 준수 여부 검증.
2.  **단위 테스트 (Unit Test)**:
    - `SimpleTaxCalculator`가 급여 구간별로 올바른 세금을 계산하는지 검증.
3.  **통합 테스트 (Manual)**:
    - API 호출을 통한 급여 계산 결과 확인 (JSON 응답의 `deductions` 항목 검증).
    - 메일 발송 시 로그가 정상 적재되고, 에러 발생 시 롤백되지 않는지 확인.

## 6. 일정 및 순서
1. `Payroll` 로직 개선 (즉시)
2. `Notification` 비동기 처리 (즉시)
3. `Recruitment` 모듈 스캐폴딩 (순차 진행)
4. `Approval` 로직 개선 (순차 진행)
