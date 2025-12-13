# 급여(Payroll) 모듈 백엔드 구현 완료 보고서

## 1. 개요 (Overview)
- **작업명:** 급여 모듈 백엔드 구현 (Level 13)
- **기간:** 2025-12-13
- **목표:** 급여 대장 생성 및 명세서 조회 기능을 위한 핵심 로직 및 API 구현.

## 2. 구현 내용 (Implemented Features)

### 2.1 Domain & Schema
- `Payroll`: 급여 대장 (Master) - `company_id` 및 `target_month` 기반 관리.
- `Payslip`: 개인별 명세서 - User 모듈과 논리적 연동.
- `PayslipItem`: 급여 상세 항목 (수당/공제) - JSON 대신 별도 테이블로 정규화하여 구현.

### 2.2 Core Logic
- **SalaryCalculationService**: 
    - 기본급 기반 4대보험 및 소득세 자동 계산 로직 구현 (MVP: 단순 요율 적용).
    - 식대 등 고정 수당 자동 추가.
- **PayrollService**:
    - 대장 생성 시 해당 회사의 재직자(`User`) 전체를 조회하여 자동으로 `Payslip` 생성.
    - 테넌트 격리 로직 적용 (`SecurityUtils.getCurrentCompanyId()` 사용).

### 2.3 Integration
- **User Module 연동**:
    - `UserModuleApi`에 `getUsersByCompanyId()` 추가 및 구현.
    - `SecurityUtils` 구현을 통해 JWT UserPrincipal에서 `companyId` 추출 기능 추가.

### 2.4 API Endpoint
| Method | URI | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/payrolls` | 급여 대장 생성 |
| `GET` | `/api/v1/payrolls` | 대장 목록 조회 |
| `GET` | `/api/v1/payrolls/{id}` | 대장 상세 조회 |
| `GET` | `/api/v1/payrolls/{id}/payslips` | 대장 내 전체 명세 조회 |
| `GET` | `/api/v1/my-payslips` | 내 명세서 조회 |
| `GET` | `/api/v1/payslips/{id}` | 명세 상세 조회 |

## 3. 검증 결과 (Verification)
- **빌드 테스트:** `./gradlew :modules:payroll:compileJava` ✅ 성공.
- **모듈 격리:** `modules:payroll`에서 `User` 엔티티 직접 참조 없이 `UserModuleApi`만 사용함 확인.

## 4. 향후 계획 (Next Steps)
- 프론트엔드 연동 (`features/payroll`)
- 급여 계산 로직 고도화 (근태 데이터 연동)
