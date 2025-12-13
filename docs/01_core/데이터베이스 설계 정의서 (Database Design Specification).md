# **데이터베이스 설계 정의서 (Database Design Specification)**

## **1\. 개요 (Overview)**

본 문서는 HR 시스템의 데이터 저장소 구조를 정의한다. 모듈형 모놀리스 아키텍처 원칙에 따라, 논리적으로는 관계(Relation)를 맺고 있지만 물리적으로는 제약(Constraint)을 걸지 않는 방식을 채택한다.  
특히 멀티 테넌트(Multi-Tenant) 환경을 지원하기 위해 companies 테이블을 최상위에 두고, 모든 데이터 테이블에 company\_id를 포함하여 데이터 격리를 수행한다.

### **1.1 설계 원칙**

1. **No Physical Foreign Keys:** 추후 DB 분리를 대비해 FOREIGN KEY 제약조건 미사용.  
2. **Tenant Isolation:** 모든 테넌트별 데이터 테이블은 company\_id를 PK 또는 복합 Unique Key의 첫 번째 컬럼으로 포함하여 인덱스 효율성을 높이고 격리를 보장한다.  
3. **Audit Columns:** 모든 테이블에는 created\_at, updated\_at, created\_by, updated\_by 포함.

## **2\. 논리적 데이터 모델 (Logical Data Model)**

모듈(Bounded Context) 단위로 그룹화된 엔티티 관계도입니다. COMPANIES 엔티티가 최상위 루트가 됩니다.

erDiagram  
    %% \==========================================  
    %% 0\. System & Tenant Module (Root)  
    %% \==========================================  
    COMPANIES {  
        bigint id PK  
        string name  
        string domain  
        string status  
    }

    %% \==========================================  
    %% 1\. User & Organization Module  
    %% \==========================================  
    USERS {  
        bigint id PK  
        bigint company\_id FK "Tenant Isolation"  
        bigint dept\_id  
        string role "SUPER\_ADMIN | TENANT\_ADMIN | ..."  
    }  
    DEPARTMENTS {  
        bigint id PK  
        bigint company\_id FK  
        bigint parent\_id  
        string path\_string  
    }  
      
    COMPANIES ||--o{ USERS : "employs"  
    COMPANIES ||--o{ DEPARTMENTS : "contains"  
    DEPARTMENTS ||--o{ DEPARTMENTS : "parent/child"  
    DEPARTMENTS |o--o{ USERS : "belongs to"

    %% \==========================================  
    %% 2\. Approval Module  
    %% \==========================================  
    APPROVAL\_REQUESTS {  
        bigint id PK  
        bigint company\_id FK  
        string resource\_type  
        bigint resource\_id  
    }  
    APPROVAL\_STEPS {  
        bigint id PK  
        bigint approval\_request\_id  
    }  
    APPROVAL\_ASSIGNEES {  
        bigint id PK  
        bigint approval\_step\_id  
        bigint user\_id  
    }

    APPROVAL\_REQUESTS ||--o{ APPROVAL\_STEPS : has  
    APPROVAL\_STEPS ||--o{ APPROVAL\_ASSIGNEES : assigned

    %% \==========================================  
    %% 3\. Policy Module  
    %% \==========================================  
    ACCESS\_GRANTS {  
        bigint id PK  
        bigint grantee\_user\_id  
        string resource\_type  
    }

    %% \==========================================  
    %% 4\. HR Domain Modules  
    %% \==========================================  
    VACATION\_BALANCES {  
        bigint id PK  
        bigint company\_id FK  
        bigint user\_id  
    }  
    PAYROLLS {  
        bigint id PK  
        bigint company\_id FK  
        bigint user\_id  
    }  
    ATTENDANCE\_LOGS {  
        bigint id PK  
        bigint company\_id FK  
        bigint user\_id  
    }  
    EVALUATIONS {  
        bigint id PK  
        bigint company\_id FK  
    }  
    ASSETS {  
        bigint id PK  
        bigint company\_id FK  
        string status
        string category
    }

    %% Logical Relationships  
    USERS ||--o{ ACCESS\_GRANTS : "granted"  
    USERS ||--o{ VACATION\_BALANCES : "owns"  
    USERS ||--o{ PAYROLLS : "receives"  
    USERS ||--o{ ATTENDANCE\_LOGS : "logs"  
    USERS ||--o{ EVALUATIONS : "evaluated"  
    USERS ||--o{ ASSETS : "assigned"

## **3\. 물리적 데이터 모델 (Physical DDL)**

DBMS: MySQL 8.0+ / MariaDB 10.5+  
Charset: utf8mb4

### **3.0 시스템 및 테넌트 모듈 (System Core) \- \[NEW\]**

-- 1. Companies (테넌트 마스터)
CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT '회사명',
    domain VARCHAR(255) NOT NULL COMMENT '전용 도메인 (hr.samsung.com)',
    business_number VARCHAR(255) DEFAULT NULL COMMENT '사업자등록번호',
    
    status ENUM('ACTIVE','INACTIVE','SUSPENDED') DEFAULT NULL,
    plan_type VARCHAR(20) DEFAULT NULL COMMENT 'BASIC, PRO, ENTERPRISE',
    expired_at DATE NULL COMMENT '서비스 만료일',
    is_active BIT(1) DEFAULT NULL,
    
    created_at DATETIME(6) DEFAULT NULL,
    updated_at DATETIME(6) DEFAULT NULL,
    
    UNIQUE KEY uk_company_domain (domain)
) ENGINE=InnoDB COMMENT='고객사(테넌트) 정보';

### **3.1 공통 모듈 (User & Organization)**

-- 2. Users (사용자)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL COMMENT 'Tenant ID (0=System Admin)',
    dept_id BIGINT NULL,
    
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    
    -- employee_number removed in current impl or simplified
    role VARCHAR(50) NOT NULL COMMENT 'SUPER_ADMIN, TENANT_ADMIN, USER etc',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_email (email),
    FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE=InnoDB COMMENT='사용자 정보';

-- 3. Departments (조직)
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL COMMENT 'Tenant ID',
    parent_id BIGINT NULL,
    
    name VARCHAR(255) NOT NULL,
    path_string VARCHAR(1000) NULL,
    depth INT DEFAULT 0,
    path VARCHAR(255) NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE=InnoDB COMMENT='부서 정보';

### **3.2 결재 모듈 (Approval Engine)**

-- 4. Approval Requests
CREATE TABLE approval_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL COMMENT 'Tenant ID',
    
    resource_type VARCHAR(50) NOT NULL,
    resource_id BIGINT NOT NULL,
    requester_user_id BIGINT NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    current_step_order INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'PENDING',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE=InnoDB;

-- 10. Approval Steps
CREATE TABLE approval_steps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL,
    step_order INT NOT NULL,
    approver_id BIGINT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    
    CONSTRAINT fk_approval_steps_request FOREIGN KEY (request_id) REFERENCES approval_requests(id)
) ENGINE=InnoDB;

### **3.3 정책 모듈 (Policy & Security)**

-- 5. Access Grants (동적 권한)
CREATE TABLE access_grants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grantee_user_id BIGINT NOT NULL,
    
    resource_type VARCHAR(50) NOT NULL,
    resource_id BIGINT NOT NULL,
    permission VARCHAR(50) NOT NULL,
    
    expires_at DATETIME NOT NULL
) ENGINE=InnoDB;

### **3.4 도메인 모듈 (HR Functions)**

-- 6. Vacation Balances
CREATE TABLE vacation_balances (
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
) ENGINE=InnoDB;

-- 7. Vacation Requests (연차 신청 내역)
CREATE TABLE vacation_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL, 
    user_id BIGINT NOT NULL,
    
    vacation_type ENUM('ANNUAL','HALF_AM','HALF_PM','SICK','UNPAID') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    request_days DOUBLE NOT NULL,
    reason VARCHAR(255) NULL,
    
    status VARCHAR(255) DEFAULT NULL,
    approval_request_id BIGINT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME(6),
    
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 8. Payrolls (급여)
CREATE TABLE payrolls (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- NOTE: Running DB uses tenant_id/company_id as VARCHAR/String in some contexts, but here we reflect the schema.
    company_id VARCHAR(50) NOT NULL, 
    tenant_id VARCHAR(50) NOT NULL, 
    
    title VARCHAR(100) NOT NULL,
    target_year INT NOT NULL,
    target_month VARCHAR(7) NOT NULL, -- YYYY-MM
    payment_date DATE NOT NULL,
    
    total_amount DECIMAL(19, 2) NOT NULL,
    status ENUM('DRAFT', 'CONFIRMED', 'PAID') NOT NULL,
    
    created_at DATETIME(6),
    updated_at DATETIME(6),
    
    INDEX idx_payroll_tenant (tenant_id, company_id, target_month)
) ENGINE=InnoDB;

-- 11. Payslips (급여 명세서 헤더)
CREATE TABLE payslips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payroll_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    
    total_allowance DECIMAL(19, 2) NOT NULL,
    total_deduction DECIMAL(19, 2) NOT NULL,
    net_pay DECIMAL(19, 2) NOT NULL,
    
    CONSTRAINT fk_payslips_payroll FOREIGN KEY (payroll_id) REFERENCES payrolls(id)
) ENGINE=InnoDB;

-- 12. Payslip Items (급여 항목)
CREATE TABLE payslip_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payslip_id BIGINT NOT NULL,
    item_type ENUM('ALLOWANCE', 'DEDUCTION') NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    
    CONSTRAINT fk_payslip_items_payslip FOREIGN KEY (payslip_id) REFERENCES payslips(id)
) ENGINE=InnoDB;

-- 9. Attendance (근태)
CREATE TABLE attendance_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL, 
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    
    check_in_time DATETIME NULL,
    check_out_time DATETIME NULL,
    work_type VARCHAR(50) DEFAULT NULL,
    ip_address VARCHAR(50) DEFAULT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

### **3.5 인사평가 모듈 (Evaluations) - [NEW]**

-- 13. Evaluation Cycles
CREATE TABLE evaluation_cycles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL COMMENT '예: 2025년 상반기 정기 평가',
    year INT NOT NULL,
    type ENUM('PERFORMANCE', 'COMPETENCY', 'KPI') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('DRAFT', 'OPEN', 'CLOSED', 'ARCHIVED') DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE=InnoDB;

-- 14. Evaluations
CREATE TABLE evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cycle_id BIGINT NOT NULL,
    target_user_id BIGINT NOT NULL COMMENT '피평가자',
    total_score DECIMAL(5,2) DEFAULT 0,
    final_grade VARCHAR(10) DEFAULT NULL COMMENT 'S, A, B, C, D',
    status ENUM('READY', 'SELF_EVAL', 'PEER_EVAL', 'MANAGER_EVAL', 'COMPLETED') DEFAULT 'READY',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_eval_target (cycle_id, target_user_id),
    FOREIGN KEY (cycle_id) REFERENCES evaluation_cycles(id),
    FOREIGN KEY (target_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 15. Evaluation Records
CREATE TABLE evaluation_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evaluation_id BIGINT NOT NULL,
    rater_user_id BIGINT NOT NULL COMMENT '평가자 (본인 포함)',
    rater_type ENUM('SELF', 'PEER', 'MANAGER') NOT NULL,
    score DECIMAL(5,2) DEFAULT 0,
    comment TEXT NULL,
    submitted_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evaluation_id) REFERENCES evaluations(id),
    FOREIGN KEY (rater_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

### **3.6 자산 관리 모듈 (Assets) - [NEW]**

-- 16. Assets
CREATE TABLE assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    current_user_id BIGINT NULL COMMENT '현재 사용자 (NULL이면 미사용)',
    
    category ENUM('LAPTOP', 'DESKTOP', 'MONITOR', 'ACCESSORY', 'SOFTWARE', 'FURNITURE', 'OTHER') NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(255) NULL,
    
    purchase_date DATE NULL,
    purchase_price DECIMAL(15,2) DEFAULT 0,
    
    status ENUM('AVAILABLE', 'ASSIGNED', 'BROKEN', 'REPAIRING', 'DISCARDED') NOT NULL DEFAULT 'AVAILABLE',
    note TEXT NULL COMMENT '비고 (상세 스펙 등)',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_asset_serial (company_id, serial_number), -- 회사 내 시리얼 중복 방지
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (current_user_id) REFERENCES users(id)
) ENGINE=InnoDB COMMENT='자산 정보';



