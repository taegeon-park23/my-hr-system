# 급여(Payroll) 모듈 구현 계획

## 1. 개요 (Overview)
본 문서는 HR 시스템의 핵심 기능인 **급여(Payroll) 모듈**의 구현 계획을 정의한다.
급여 모듈은 근태(Attendance) 데이터와 직원(User) 정보를 기반으로 급여를 계산하고, 명세서를 발행하는 기능을 담당한다.

## 2. 목표 (Goals)
- **급여 대장(Payroll) 관리**: 특정 귀속월(YYYY-MM)에 대한 급여 대장 생성 및 확정.
- **급여 명세(Payslip) 생성**: 직원별 기본급, 수당, 공제 항목이 포함된 명세서 생성.
- **모듈 격리 준수**: User, Attendance 모듈과 직접 조인하지 않고 API/ID 기반으로 연동.

## 3. 데이터베이스 설계 (Database Schema)

### 3.1 ERD 설계
급여 모듈은 독립적인 스키마를 가지며 `payrolls`와 `payslips`를 핵심 엔티티로 한다.

```sql
-- 1. 급여 대장 (Payroll Master)
CREATE TABLE payrolls (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id       VARCHAR(50) NOT NULL COMMENT '테넌트 ID',
    company_id      VARCHAR(50) NOT NULL COMMENT '회사 ID',
    title           VARCHAR(100) NOT NULL COMMENT '급여 대장 제목 (예: 2024년 12월 정기 급여)',
    target_month    VARCHAR(7)  NOT NULL COMMENT '귀속월 (YYYY-MM)',
    payment_date    DATE        NOT NULL COMMENT '지급일',
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '상태 (DRAFT, CONFIRMED, PAID)',
    total_amount    DECIMAL(19, 2) NOT NULL DEFAULT 0 COMMENT '총 지급액',
    created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_payroll_tenant (tenant_id, company_id, target_month)
) COMMENT '급여 대장 마스터';

-- 2. 개인별 급여 명세 (Participant/Payslip)
CREATE TABLE payslips (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    payroll_id      BIGINT      NOT NULL COMMENT '급여 대장 ID',
    user_id         BIGINT      NOT NULL COMMENT '사용자 ID (Logical FK)',
    user_name       VARCHAR(100) NOT NULL COMMENT '사용자 이름 (Snapshot)',
    department_name VARCHAR(100) COMMENT '부서명 (Snapshot)',
    base_salary     DECIMAL(19, 2) NOT NULL DEFAULT 0 COMMENT '기본급',
    total_allowance DECIMAL(19, 2) NOT NULL DEFAULT 0 COMMENT '수당 총액',
    total_deduction DECIMAL(19, 2) NOT NULL DEFAULT 0 COMMENT '공제 총액',
    net_amount      DECIMAL(19, 2) NOT NULL DEFAULT 0 COMMENT '실 수령액',
    
    FOREIGN KEY (payroll_id) REFERENCES payrolls(id) ON DELETE CASCADE,
    INDEX idx_payslip_user (user_id)
) COMMENT '개인별 급여 명세';

-- 3. 급여 상세 항목 (Items) - JSON으로 단순화 가능하지만, 확장성을 위해 테이블 분리 고려
-- MVP 단계에서는 payslips 테이블의 JSON 컬럼이나 별도 테이블로 관리. 
-- 여기서는 상세 내역을 별도 테이블로 정의함.
CREATE TABLE payslip_items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    payslip_id  BIGINT      NOT NULL,
    item_type   VARCHAR(20) NOT NULL COMMENT 'ALLOWANCE(지급), DEDUCTION(공제)',
    item_name   VARCHAR(50) NOT NULL COMMENT '항목명 (식대, 소득세 등)',
    amount      DECIMAL(19, 2) NOT NULL DEFAULT 0,
    
    FOREIGN KEY (payslip_id) REFERENCES payslips(id) ON DELETE CASCADE
) COMMENT '급여 명세 상세 항목';
```

## 4. API 인터페이스 설계 (API Specification)

모든 응답은 `ApiResponse<T>` 포맷을 준수한다.

### 4.1 급여 대장 관리
| Method | URI | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/payrolls` | 급여 대장 생성 (초안) |
| `GET` | `/api/v1/payrolls` | 급여 대장 목록 조회 |
| `GET` | `/api/v1/payrolls/{id}` | 급여 대장 상세 조회 |
| `POST` | `/api/v1/payrolls/{id}/confirm` | 급여 확정 (상태 변경) |

### 4.2 개인별 명세 조회
| Method | URI | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/payrolls/{payrollId}/payslips` | 대장 내 전체 명세 조회 (관리자용) |
| `GET` | `/api/v1/my-payslips` | 내 급여 명세 목록 조회 (사용자용) |
| `GET` | `/api/v1/payslips/{id}` | 명세 상세 조회 |

## 5. 구현 상세 (Implementation Details)

### 5.1 패키지 구조
`backend/modules/payroll`
- `controller`: `PayrollController`, `PayslipController`
- `service`: `PayrollService`, `SalaryCalculationService` (계산 로직)
- `domain`: `Payroll` (Aggregate Root), `Payslip`
- `repository`: `PayrollRepository`, `PayslipRepository`
- `dto`: `PayrollRequest`, `PayrollResponse`

### 5.2 모듈 간 통신
- **User Module**: 급여 대상자 목록을 가져오기 위해 `UserModuleApi` 사용.
- **Attendance Module**: 초과 근무 수당 계산을 위해 `AttendanceModuleApi` 사용 (추후 고도화 시 적용, MVP는 수동 입력 가정).

### 5.3 테넌트 격리
- 모든 쿼리 및 로직에 `company_id` 필터링 필수 적용.
- `SecurityContext`에서 현재 사용자의 company_id를 가져와 검증.

## 6. 검증 계획 (Verification Plan)
1. **DB 스키마 적용**: `init.sql` 업데이트는 보류하고, JPA `ddl-auto` 검증 후 수동 쿼리 테스트 진행.
2. **단위 테스트**: `SalaryCalculationService`의 계산 로직 테스트.
3. **API 테스트**:
    - 관리자 계정으로 급여 대장 생성 및 조회.
    - 일반 직원 계정으로 본인 명세 조회 (타인 명세 조회 불가 확인).

## 7. 프론트엔드 작업 (Frontend)
- `features/payroll` 폴더 생성.
- `PayrollList`: 급여 대장 관리 테이블.
- `PayrollDetail`: 대장 내 직원별 급여 입력 폼.
- `MyPayslip`: 사용자용 명세서 조회 UI.
