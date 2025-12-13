# 데이터베이스 스키마 동기화 계획 (Database Schema Synchronization Plan)

## 1. 개요 (Overview)
현재 실행 중인 데이터베이스(Running DB)의 스키마가 `init.sql` 및 `데이터베이스 설계 정의서`와 불일치함.
"현재 구현된 DB 정보"를 기준으로 문서를 동기화하고 `init.sql`을 최신화하여, 향후 배포 및 개발 시 일관성을 보장한다.

## 2. 분석 결과 (Analysis)
현재 Running DB와 문서 간의 주요 차이점은 다음과 같다.

### 2.1 불일치 항목
1.  **신규 테이블 존재 (Running DB 기준)**
    -   `approval_steps`: 결재 단계 정보를 저장.
    -   `payslips`: 급여 명세서 헤더 정보.
    -   `payslip_items`: 급여 명세서 항목(수당/공제).
    -   문서상 존재하던 `assets`, `evaluations` 테이블은 Running DB에 존재하지 않음.

2.  **테이블 구조 차이**
    -   **payrolls**:
        -   Running DB: `tenant_id` (VARCHAR) 사용, `company_id` 컬럼 없음(또는 정의 불분명), `user_id` 유지.
        -   init.sql: `company_id` (BIGINT) 사용.
        -   *Note*: Backend Entity(`Payroll.java`)는 `tenantId`, `companyId`를 모두 String으로 정의하고 있어 추가적인 정리가 필요하나, 본 작업에서는 **Running DB 스키마**를 그대로 반영한다.
    -   **vacation_requests**:
        -   Running DB: `vacation_type`이 `ENUM` 타입으로 구현됨.
        -   init.sql: `VARCHAR` 타입.
    -   **approval_requests**:
        -   Running DB 구현에 맞춰 컬럼 정의 최신화 필요.


### 2.2 데이터베이스 레벨 점검 (Database Level Check)
-   Running DB 인스턴스 점검 결과, 추가된 사용자 정의 Database는 없음 (`hr_system` 단일 운영).
-   따라서 "추가/변경된 데이터베이스 반영" 요청은 `hr_system` 스키마 내의 **신규 테이블 추가(ADDED)** 및 **기존 테이블 변경(MODIFIED)** 반영으로 정의하여 진행함.

## 3. 변경 범위 (Scope)

### 3.1 파일 변경
1.  **`init.sql`**
    -   **[NEW]** `approval_steps`, `payslips`, `payslip_items` 테이블 추가.
    -   **[MODIFY]** `payrolls` (tenant_id, company_id 이슈), `vacation_requests` (ENUM), `approval_requests` 등 기존 테이블 현행화.
    -   **[CHECK]** 기타 Running DB에만 존재하는 모든 제약조건 및 컬럼 속성 반영.

2.  **`docs/01_core/데이터베이스 설계 정의서 (Database Design Specification).md`**
    -   **3.2 결재 모듈**: `approval_steps`, `approval_assignees` 섹션 현행화.
    -   **3.4 도메인 모듈**: `payrolls` 정보 갱신, `payslips` 및 `payslip_items` 추가.
    -   **3.0 ~ 3.4 전반**: Running DB 기준으로 모든 "Changed" 내역(컬럼 타입, Nullable 여부 등) 상세 업데이트.
    -   미구현 테이블(`assets`, `evaluations`)은 "Future Implementations" 섹션으로 이동.

## 4. 데이터베이스 스키마 정의 (Target DDL)
*Running DB 추출 정보를 바탕으로 작성될 예정임.*

### 주요 변경 테이블 (예시)
```sql
CREATE TABLE approval_steps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    approver_id BIGINT NOT NULL,
    status ENUM('PENDING','APPROVED','REJECTED') NOT NULL,
    step_order INT NOT NULL,
    request_id BIGINT NOT NULL,
    FOREIGN KEY (request_id) REFERENCES approval_requests(id)
);

CREATE TABLE payslips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    payroll_id BIGINT NOT NULL,
    total_allowance DECIMAL(19,2) NOT NULL,
    total_deduction DECIMAL(19,2) NOT NULL,
    net_pay DECIMAL(19,2) NOT NULL,
    FOREIGN KEY (payroll_id) REFERENCES payrolls(id)
);
```

## 5. 검증 계획 (Verification Plan)

### 5.1 구문 검증
-   수정된 `init.sql`을 로컬 MySQL 컨테이너에서 실행하여 에러 없이 테이블이 생성되는지 확인.
    -   Command: `docker-compose exec hr-db mysql -u root -proot -e "SOURCE /docker-entrypoint-initdb.d/init.sql.test"` (테스트 파일로 마운트하여 실행)

### 5.2 정합성 확인
-   `Database Design Specification.md`의 ERD 및 테이블 정의가 수정된 `init.sql`과 일치하는지 육안 검토.
