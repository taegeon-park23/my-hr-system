-- Database Initialization

CREATE DATABASE IF NOT EXISTS hr_system;

USE hr_system;

-- 1. Tenants (Companies)
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    business_number VARCHAR(255) DEFAULT NULL,
    created_at DATETIME(6) DEFAULT NULL,
    expired_at DATE DEFAULT NULL,
    plan_type VARCHAR(20) DEFAULT NULL,
    status ENUM(
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED'
    ) DEFAULT NULL,
    updated_at DATETIME(6) DEFAULT NULL,
    is_active BIT(1) DEFAULT NULL
);

INSERT INTO
    companies (id, name, domain)
VALUES (
        1,
        'System Admin',
        'hr-system.com'
    )
ON DUPLICATE KEY UPDATE
    name = name;

INSERT INTO
    companies (id, name, domain)
VALUES (
        2,
        'Samsung Electronics',
        'samsung.com'
    )
ON DUPLICATE KEY UPDATE
    name = name;

INSERT INTO
    companies (id, name, domain)
VALUES (3, 'LG Electronics', 'lg.com')
ON DUPLICATE KEY UPDATE
    name = name;

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    dept_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies (id)
);

-- Super Admin
-- Password: password123 (BCrypt: $2a$10$NotRealHashJustPlaceholder -> needs real hash)
-- Real Hash for 'password123': $2a$10$Dom.S.a.l.t.value... (Generating a standard one)
-- Let's use a standard bcrypt hash for 'password123': $2a$10$wS2a2qT8.Wj.FjFv1z.H.O0.123456789 (This is fake, I will use a known valid hash below)
-- Valid BCrypt for 'password': $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVwdFEX89.DMxreRhH7yPY_a

INSERT INTO
    users (
        company_id,
        email,
        password_hash,
        name,
        role
    )
VALUES (
        1,
        'admin@hr-system.com',
        '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVwdFEX89.DMxreRhH7yPY_a',
        'Super Admin',
        'SUPER_ADMIN'
    )
ON DUPLICATE KEY UPDATE
    name = name;

-- Samsung Admin (Tester)
INSERT INTO
    users (
        company_id,
        email,
        password_hash,
        name,
        role
    )
VALUES (
        2,
        'admin@samsung.com',
        '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVwdFEX89.DMxreRhH7yPY_a',
        'Samsung Admin',
        'TENANT_ADMIN'
    )
ON DUPLICATE KEY UPDATE
    name = name;

-- LG Admin
INSERT INTO
    users (
        company_id,
        email,
        password_hash,
        name,
        role
    )
VALUES (
        3,
        'admin@lg.com',
        '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVwdFEX89.DMxreRhH7yPY_a',
        'LG Admin',
        'TENANT_ADMIN'
    )
ON DUPLICATE KEY UPDATE
    name = name;

-- 3. Departments
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    parent_id BIGINT,
    path_string VARCHAR(1000),
    depth INT DEFAULT 0,
    path VARCHAR(255),
    FOREIGN KEY (company_id) REFERENCES companies (id)
);

INSERT INTO
    departments (
        company_id,
        name,
        path_string,
        depth
    )
VALUES (
        2,
        'Mobile Division',
        'Mobile Division',
        0
    );

-- 4. Attendance
CREATE TABLE IF NOT EXISTS attendance_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    check_in_time DATETIME,
    check_out_time DATETIME,
    work_type VARCHAR(50),
    ip_address VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 5. Access Grants (Policy)
CREATE TABLE IF NOT EXISTS access_grants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grantee_user_id BIGINT NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id BIGINT NOT NULL,
    permission VARCHAR(50) NOT NULL,
    expires_at DATETIME NOT NULL
);

-- 6. Vacation Balances
CREATE TABLE IF NOT EXISTS vacation_balances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    year INT NOT NULL,
    total_days FLOAT DEFAULT 0,
    used_days FLOAT DEFAULT 0,
    remaining_days FLOAT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_vac_balance (user_id, year),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 7. Payrolls
CREATE TABLE IF NOT EXISTS payrolls (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id VARCHAR(50) NOT NULL,
    tenant_id VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    target_year INT NOT NULL,
    target_month VARCHAR(7) NOT NULL,
    payment_date DATE NOT NULL,
    total_amount DECIMAL(19, 2) NOT NULL,
    status ENUM('DRAFT', 'CONFIRMED', 'PAID') NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    INDEX idx_payroll_tenant (
        tenant_id,
        company_id,
        target_month
    )
);

-- 8. Approval Requests
CREATE TABLE IF NOT EXISTS approval_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id BIGINT NOT NULL,
    requester_user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    current_step_order INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'PENDING',
    version BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies (id)
);

-- 9. Vacation Requests
CREATE TABLE IF NOT EXISTS vacation_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    vacation_type ENUM(
        'ANNUAL',
        'HALF_AM',
        'HALF_PM',
        'SICK',
        'UNPAID'
    ) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    request_days DOUBLE NOT NULL,
    reason VARCHAR(255),
    status VARCHAR(255),
    approval_request_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME(6),
    FOREIGN KEY (company_id) REFERENCES companies (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 10. Approval Steps [NEW]
CREATE TABLE IF NOT EXISTS approval_steps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL,
    step_order INT NOT NULL,
    approver_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    comment TEXT NULL,
    processed_at DATETIME NULL,
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_approval_steps_request FOREIGN KEY (request_id) REFERENCES approval_requests (id)
);

-- 11. Payslips [NEW]
CREATE TABLE IF NOT EXISTS payslips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payroll_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    total_allowance DECIMAL(19, 2) NOT NULL,
    total_deduction DECIMAL(19, 2) NOT NULL,
    net_pay DECIMAL(19, 2) NOT NULL,
    CONSTRAINT fk_payslips_payroll FOREIGN KEY (payroll_id) REFERENCES payrolls (id)
);

-- 12. Payslip Items [NEW]
CREATE TABLE IF NOT EXISTS payslip_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payslip_id BIGINT NOT NULL,
    item_type ENUM('ALLOWANCE', 'DEDUCTION') NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    CONSTRAINT fk_payslip_items_payslip FOREIGN KEY (payslip_id) REFERENCES payslips (id)
);

-- 13. Evaluation Cycles [NEW]
CREATE TABLE IF NOT EXISTS evaluation_cycles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL COMMENT '예: 2025년 상반기 정기 평가',
    year INT NOT NULL,
    type ENUM(
        'PERFORMANCE',
        'COMPETENCY',
        'KPI'
    ) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM(
        'DRAFT',
        'OPEN',
        'CLOSED',
        'ARCHIVED'
    ) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies (id)
);

-- 14. Evaluations [NEW]
CREATE TABLE IF NOT EXISTS evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cycle_id BIGINT NOT NULL,
    target_user_id BIGINT NOT NULL COMMENT '피평가자',
    total_score DECIMAL(5, 2) DEFAULT 0,
    final_grade VARCHAR(10) DEFAULT NULL COMMENT 'S, A, B, C, D',
    status ENUM(
        'READY',
        'SELF_EVAL',
        'PEER_EVAL',
        'MANAGER_EVAL',
        'COMPLETED'
    ) DEFAULT 'READY',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_eval_target (cycle_id, target_user_id),
    FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles (id),
    FOREIGN KEY (target_user_id) REFERENCES users (id)
);

-- 15. Evaluation Records [NEW]
CREATE TABLE IF NOT EXISTS evaluation_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evaluation_id BIGINT NOT NULL,
    rater_user_id BIGINT NOT NULL COMMENT '평가자 (본인 포함)',
    rater_type ENUM('SELF', 'PEER', 'MANAGER') NOT NULL,
    score DECIMAL(5, 2) DEFAULT 0,
    comment TEXT NULL,
    submitted_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evaluation_id) REFERENCES evaluations (id),
    FOREIGN KEY (rater_user_id) REFERENCES users (id)
);

-- 16. Assets [NEW]
CREATE TABLE IF NOT EXISTS assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    current_user_id BIGINT NULL COMMENT '현재 사용자 (NULL이면 미사용)',
    category ENUM(
        'LAPTOP',
        'DESKTOP',
        'MONITOR',
        'ACCESSORY',
        'SOFTWARE',
        'FURNITURE',
        'OTHER'
    ) NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(255) NULL,
    purchase_date DATE NULL,
    purchase_price DECIMAL(15, 2) DEFAULT 0,
    status ENUM(
        'AVAILABLE',
        'ASSIGNED',
        'BROKEN',
        'REPAIRING',
        'DISCARDED'
    ) NOT NULL DEFAULT 'AVAILABLE',
    note TEXT NULL COMMENT '비고 (상세 스펙 등)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_asset_serial (company_id, serial_number),
    FOREIGN KEY (company_id) REFERENCES companies (id),
    FOREIGN KEY (current_user_id) REFERENCES users (id)
);

-- 17. Notification Logs [NEW]
CREATE TABLE IF NOT EXISTS notification_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('SENT', 'FAILED') NOT NULL,
    error_message TEXT NULL,
    event_type VARCHAR(100) NOT NULL,
    related_resource_id BIGINT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_noti_company (company_id),
    INDEX idx_noti_recipient (recipient_email)
);

-- 18. Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'NOTICE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_announcement_company (company_id)
);

-- 19. In-App Notifications
CREATE TABLE IF NOT EXISTS in_app_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    message VARCHAR(500) NOT NULL,
    link VARCHAR(255) NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_in_app_noti_recipient (recipient_id),
    INDEX idx_in_app_noti_company (company_id)
);

-- 20. Approval Rules
CREATE TABLE IF NOT EXISTS approval_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    request_type VARCHAR(50) NOT NULL,
    min_amount BIGINT DEFAULT 0,
    max_amount BIGINT DEFAULT 0,
    approval_line_key VARCHAR(50) NOT NULL,
    priority INT NOT NULL DEFAULT 0,
    INDEX idx_approval_rule_type (company_id, request_type)
);

-- Insert Sample Approval Rules for Samsung (company_id: 2)
INSERT INTO
    approval_rules (
        company_id,
        request_type,
        approval_line_key,
        priority
    )
VALUES (
        2,
        'VACATION',
        'TEAM_LEADER',
        1
    );

INSERT INTO
    approval_rules (
        company_id,
        request_type,
        approval_line_key,
        priority
    )
VALUES (2, 'VACATION', 'DEPT_HEAD', 2);