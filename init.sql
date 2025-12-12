-- ==========================================
-- 1. Companies (Tenant Master)
-- ==========================================
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Company Name',
    domain VARCHAR(100) NULL COMMENT 'Domain (e.g., hr.samsung.com)',
    business_number VARCHAR(20) NULL COMMENT 'Business Registration Number',
    
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, SUSPENDED',
    plan_type VARCHAR(20) DEFAULT 'BASIC' COMMENT 'BASIC, PRO, ENTERPRISE',
    expired_at DATE NULL COMMENT 'Service Expiration Date',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_company_domain (domain)
) ENGINE=InnoDB COMMENT='Tenant Info';

-- ==========================================
-- 2. Users (Common)
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL COMMENT 'Tenant ID (0=System Admin)',
    dept_id BIGINT NULL,
    
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    
    employee_number VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' COMMENT 'SUPER_ADMIN, TENANT_ADMIN, DEPT_MANAGER, USER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    
    hire_date DATE NOT NULL,
    resign_date DATE NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_email (email),
    UNIQUE KEY uk_user_emp_no (company_id, employee_number),
    
    INDEX idx_user_company (company_id),
    INDEX idx_user_dept (dept_id)
) ENGINE=InnoDB COMMENT='User Info';

-- ==========================================
-- 3. Departments (Organization)
-- ==========================================
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL COMMENT 'Tenant ID',
    parent_id BIGINT NULL,
    leader_user_id BIGINT NULL,
    
    name VARCHAR(100) NOT NULL,
    path_string VARCHAR(500) NULL COMMENT 'Ancestor Path',
    depth INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_dept_company (company_id),
    INDEX idx_dept_parent (parent_id)
) ENGINE=InnoDB COMMENT='Department Info';

-- ==========================================
-- Initial Data Seeding
-- ==========================================

-- 1. System Admin Tenant (ID: 0 or 1, let's use 1 for first tenant)
INSERT INTO companies (id, name, domain, status, plan_type) 
VALUES (1, 'System Admin', 'admin.hr-system.com', 'ACTIVE', 'ENTERPRISE')
ON DUPLICATE KEY UPDATE name=name;

-- 2. Demo Tenant (Samsung Electronics)
INSERT INTO companies (id, name, domain, status, plan_type)
VALUES (2, 'Samsung Electronics', 'samsung.hr-system.com', 'ACTIVE', 'PRO')
ON DUPLICATE KEY UPDATE name=name;

-- 3. Super Admin User
-- Password: 'password' (bcrypt hash placeholder)
INSERT INTO users (company_id, email, password_hash, name, employee_number, role, hire_date)
VALUES (1, 'admin@hr-system.com', '$2a$10$NotRealHashJustPlaceholder', 'Super Admin', 'SYS-001', 'SUPER_ADMIN', CURDATE())
ON DUPLICATE KEY UPDATE name=name;
