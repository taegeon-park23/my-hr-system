# Init.sql 업데이트 계획 (Init SQL Update Plan)

## 1. 개요 (Overview)
`init.sql` 파일에 누락된 테이블 정의(`vacation_balances`, `vacation_requests`, `approval_requests` 등)를 추가하여, 초기 데이터베이스 생성 시 스키마가 명확하게 정의되도록 합니다.
이는 Hibernate의 DDL Auto 기능에 의존하지 않고, 명시적인 스키마 관리를 가능하게 합니다.

## 2. 문제 분석 (Analysis)
- **현재 상태:** `init.sql`에는 `companies`, `users`, `departments`, `attendance_logs`, `access_grants` 5개 테이블만 정의되어 있음.
- **누락된 테이블:** `vacation_balances`, `vacation_requests`, `approval_requests`, `payrolls` 등.
- **영향:** 초기 배포 시 Hibernate가 테이블을 자동 생성하지만, 이 과정에서 의도치 않은 컬럼(예: 레거시 코드 잔재)이 생성되거나 제약조건이 누락될 수 있음.

## 3. 변경 내용 (Proposed Changes)
`init.sql` 파일 하단에 `docs/01_core/Database_Design_Specification.md`에 정의된 스키마를 반영하여 다음 테이블 생성 구문을 추가합니다:

1.  **vacation_balances** (연차 잔여량)
2.  **approval_requests** (결재 요청 - `requester_user_id` 사용 확인)
3.  **vacation_requests** (연차 신청 내역)
4.  **payrolls** (급여 - `id`, `company_id`, `user_id` 등)

### 3.1 DDL Script (Example)
```sql
-- 6. Vacation Balances
CREATE TABLE IF NOT EXISTS vacation_balances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    target_year INT NOT NULL,
    total_days FLOAT DEFAULT 0,
    used_days FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_vac_balance (user_id, target_year),
    FOREIGN KEY (user_id) REFERENCES users(id) -- Logical in spec, but enforce FK here for consistency if users table exists in init.sql
);
-- Note: Spec says 'No Physical Foreign Keys', but init.sql already uses FK in 'users' and 'departments'.
-- Action: I will follow the 'init.sql' convention of using FKs where applicable, or stick to the 'No Physical FK' rule if strictly enforced.
-- Decision: Init.sql currently has FKs. I will maintain consistency with existing init.sql style (Use FKs).

-- 7. Approval Requests
-- (Definition from Spec, ensuring requester_user_id is used)
```

### 3.2 Database Design Specification Update
`docs/01_core/Database_Design_Specification.md` 파일에 누락된 `vacation_requests` 테이블 정의를 추가하고, `approval_requests`의 컬럼명 명세가 정확한지 재확인(명시화)합니다.

#### [MODIFY] docs/01_core/데이터베이스 설계 정의서 (Database Design Specification).md
- **Add:** `VACATION_REQUESTS` Entity (ER Diagram & DDL)
  - `id`, `company_id`, `user_id`, `vacation_type`, `start_date`, `end_date`, `request_days`, `reason`, `status`, `approval_request_id`.
- **Verify:** `APPROVAL_REQUESTS` has `requester_user_id`.

## 4. 검증 계획 (Verification)
1.  **File Review:** `init.sql` 및 `Database_Design_Specification.md` 내용 육안 확인.
2.  **Dry Run (Optional):** Docker Volume 리셋 후 재구동 시 테이블 정상 생성 확인 (이번에는 파일 수정만 진행).
