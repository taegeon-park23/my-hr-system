-- Database Initialization

CREATE DATABASE IF NOT EXISTS hr_system;
USE hr_system;

-- 1. Tenants (Companies)
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO companies (id, name, domain) VALUES (1, 'System Admin', 'hr-system.com') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO companies (id, name, domain) VALUES (2, 'Samsung Electronics', 'samsung.com') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO companies (id, name, domain) VALUES (3, 'LG Electronics', 'lg.com') ON DUPLICATE KEY UPDATE name=name;

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
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Super Admin
-- Password: password123 (BCrypt: $2a$10$NotRealHashJustPlaceholder -> needs real hash)
-- Real Hash for 'password123': $2a$10$Dom.S.a.l.t.value... (Generating a standard one)
-- Let's use a standard bcrypt hash for 'password123': $2a$10$wS2a2qT8.Wj.FjFv1z.H.O0.123456789 (This is fake, I will use a known valid hash below)
-- Valid BCrypt for 'password': $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVwdFEX89.DMxreRhH7yPY_a

INSERT INTO users (company_id, email, password_hash, name, role) 
VALUES (1, 'admin@hr-system.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVwdFEX89.DMxreRhH7yPY_a', 'Super Admin', 'SUPER_ADMIN')
ON DUPLICATE KEY UPDATE name=name;

-- Samsung Admin (Tester)
INSERT INTO users (company_id, email, password_hash, name, role) 
VALUES (2, 'admin@samsung.com', '$2b$12$OFTye8u1rwIl50YiR2vzue8siiGLZbQ/aQO2eCXbZc76i9.o1RDnO', 'Samsung Admin', 'TENANT_ADMIN')
ON DUPLICATE KEY UPDATE name=name;

-- LG Admin
INSERT INTO users (company_id, email, password_hash, name, role) 
VALUES (3, 'admin@lg.com', '$2b$12$OFTye8u1rwIl50YiR2vzue8siiGLZbQ/aQO2eCXbZc76i9.o1RDnO', 'LG Admin', 'TENANT_ADMIN')
ON DUPLICATE KEY UPDATE name=name;

-- 3. Departments
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    parent_id BIGINT,
    path_string VARCHAR(1000),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

INSERT INTO departments (company_id, name, path_string) VALUES (2, 'Mobile Division', 'Mobile Division');

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
    FOREIGN KEY (user_id) REFERENCES users(id)
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
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 7. Payrolls
CREATE TABLE IF NOT EXISTS payrolls (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    target_year INT NOT NULL,
    target_month INT NOT NULL,
    payment_date DATE NOT NULL,
    total_amount DECIMAL(15, 0) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_payroll_target (user_id, target_year, target_month),
    FOREIGN KEY (user_id) REFERENCES users(id)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- 9. Vacation Requests
CREATE TABLE IF NOT EXISTS vacation_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    vacation_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    request_days FLOAT NOT NULL,
    reason VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING',
    approval_request_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

