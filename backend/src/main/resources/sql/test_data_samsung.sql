-- =================================================================================
-- Test Data Script for Samsung Tenant (Approval Module Test)
-- Tenant: Samsung Electronics (samsung.com)
-- Password for all users: password123 (Hash: $2b$12$OFTye8u1rwIl50YiR2vzue8siiGLZbQ/aQO2eCXbZc76i9.o1RDnO)
-- =================================================================================

-- 1. Ensure Company Exists (Samsung Electronics)
INSERT INTO companies (name, domain, status, is_active, created_at, updated_at)
SELECT 'Samsung Electronics', 'samsung.com', 'ACTIVE', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE domain = 'samsung.com');

-- Get Company ID
SET @company_id = (SELECT id FROM companies WHERE domain = 'samsung.com');

-- 2. Create Departments
-- IT Development Team (Top Level)
INSERT INTO departments (company_id, name, path_string, depth, path)
SELECT @company_id, 'IT Development Team', 'IT Development Team', 0, NULL
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE company_id = @company_id AND name = 'IT Development Team');

SET @dept_it_id = (SELECT id FROM departments WHERE company_id = @company_id AND name = 'IT Development Team');

-- HR Team (Top Level)
INSERT INTO departments (company_id, name, path_string, depth, path)
SELECT @company_id, 'HR Team', 'HR Team', 0, NULL
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE company_id = @company_id AND name = 'HR Team');

SET @dept_hr_id = (SELECT id FROM departments WHERE company_id = @company_id AND name = 'HR Team');

-- 3. Create Users
-- Common Password Hash: $2b$12$OFTye8u1rwIl50YiR2vzue8siiGLZbQ/aQO2eCXbZc76i9.o1RDnO (password123)

-- 3.1 Kim Staff (Requester) - IT Dev Team
INSERT INTO users (company_id, email, password_hash, name, role, dept_id, created_at)
SELECT @company_id, 'kim.staff@samsung.com', '$2b$12$OFTye8u1rwIl50YiR2vzue8siiGLZbQ/aQO2eCXbZc76i9.o1RDnO', 'Kim Staff', 'USER', @dept_it_id, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'kim.staff@samsung.com');

-- 3.2 Lee Manager (Approver) - IT Dev Team Leader
INSERT INTO users (company_id, email, password_hash, name, role, dept_id, created_at)
SELECT @company_id, 'lee.manager@samsung.com', '$2b$12$OFTye8u1rwIl50YiR2vzue8siiGLZbQ/aQO2eCXbZc76i9.o1RDnO', 'Lee Manager', 'TENANT_ADMIN', @dept_it_id, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'lee.manager@samsung.com');

-- 3.3 Park HR (HR Manager) - HR Team
INSERT INTO users (company_id, email, password_hash, name, role, dept_id, created_at)
SELECT @company_id, 'park.hr@samsung.com', '$2b$12$OFTye8u1rwIl50YiR2vzue8siiGLZbQ/aQO2eCXbZc76i9.o1RDnO', 'Park HR', 'TENANT_ADMIN', @dept_hr_id, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'park.hr@samsung.com');

-- 4. Initial Vacation Balances
-- Note: Running DB uses 'target_year' instead of 'year', and lacks 'remaining_days'.
SET @user_kim_id = (SELECT id FROM users WHERE email = 'kim.staff@samsung.com');
SET @user_lee_id = (SELECT id FROM users WHERE email = 'lee.manager@samsung.com');

INSERT INTO vacation_balances (company_id, user_id, target_year, total_days, used_days)
VALUES 
(@company_id, @user_kim_id, YEAR(NOW()), 15, 0),
(@company_id, @user_lee_id, YEAR(NOW()), 20, 0)
ON DUPLICATE KEY UPDATE total_days = VALUES(total_days);

-- Summary Output
SELECT 'Test Data Insertion Completed' AS status;
SELECT id, email, name FROM users WHERE company_id = @company_id;
