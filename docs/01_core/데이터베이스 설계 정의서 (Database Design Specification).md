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

\-- 1\. Companies (테넌트 마스터)  
CREATE TABLE companies (  
    id BIGINT AUTO\_INCREMENT PRIMARY KEY,  
    name VARCHAR(100) NOT NULL COMMENT '회사명',  
    domain VARCHAR(100) NULL COMMENT '전용 도메인 (hr.samsung.com)',  
    business\_number VARCHAR(20) NULL COMMENT '사업자등록번호',  
      
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, SUSPENDED',  
    plan\_type VARCHAR(20) DEFAULT 'BASIC' COMMENT 'BASIC, PRO, ENTERPRISE',  
    expired\_at DATE NULL COMMENT '서비스 만료일',  
      
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP,  
      
    UNIQUE KEY uk\_company\_domain (domain)  
) ENGINE=InnoDB COMMENT='고객사(테넌트) 정보';

### **3.1 공통 모듈 (User & Organization)**

\-- 2\. Users (사용자)  
CREATE TABLE users (  
    id BIGINT AUTO\_INCREMENT PRIMARY KEY,  
    company\_id BIGINT NOT NULL COMMENT 'Tenant ID (0=System Admin)',  
    dept\_id BIGINT NULL,  
      
    email VARCHAR(100) NOT NULL,  
    password\_hash VARCHAR(255) NOT NULL,  
    name VARCHAR(50) NOT NULL,  
      
    employee\_number VARCHAR(20) NOT NULL,  
    \-- SUPER\_ADMIN: 전체 관리자 (company\_id=0)  
    \-- TENANT\_ADMIN: 해당 테넌트 관리자  
    \-- DEPT\_MANAGER: 부서장  
    \-- USER: 일반 사용자  
    role VARCHAR(20) NOT NULL DEFAULT 'USER',  
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  
      
    hire\_date DATE NOT NULL,  
    resign\_date DATE NULL,  
      
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP,  
      
    UNIQUE KEY uk\_user\_email (email),  
    UNIQUE KEY uk\_user\_emp\_no (company\_id, employee\_number), \-- 테넌트별 사번 중복 방지  
      
    INDEX idx\_user\_company (company\_id),  
    INDEX idx\_user\_dept (dept\_id)  
) ENGINE=InnoDB COMMENT='사용자 정보';

\-- 3\. Departments (조직)  
CREATE TABLE departments (  
    id BIGINT AUTO\_INCREMENT PRIMARY KEY,  
    company\_id BIGINT NOT NULL COMMENT 'Tenant ID',  
    parent\_id BIGINT NULL,  
    leader\_user\_id BIGINT NULL,  
      
    name VARCHAR(100) NOT NULL,  
    path\_string VARCHAR(500) NULL,  
    depth INT DEFAULT 0,  
      
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP,  
      
    INDEX idx\_dept\_company (company\_id),  
    INDEX idx\_dept\_parent (parent\_id)  
) ENGINE=InnoDB COMMENT='부서 정보';

### **3.2 결재 모듈 (Approval Engine)**

\-- 4\. Approval Requests  
CREATE TABLE approval\_requests (  
    id BIGINT AUTO\_INCREMENT PRIMARY KEY,  
    company\_id BIGINT NOT NULL COMMENT 'Tenant ID',  
      
    resource\_type VARCHAR(50) NOT NULL,  
    resource\_id BIGINT NOT NULL,  
    requester\_user\_id BIGINT NOT NULL,  
      
    title VARCHAR(200) NOT NULL,  
    current\_step\_order INT DEFAULT 1,  
    status VARCHAR(20) DEFAULT 'PENDING',  
      
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP,  
      
    INDEX idx\_app\_company\_resource (company\_id, resource\_type),  
    INDEX idx\_app\_requester (requester\_user\_id)  
) ENGINE=InnoDB;

\-- (Steps, Assignees 테이블은 상위 Request ID를 참조하므로 company\_id 중복 생략 가능하나,   
\--  조회 편의성을 위해 역정규화하여 포함할 수도 있음. 여기서는 정규화 유지)  
CREATE TABLE approval\_steps ( ... );  
CREATE TABLE approval\_assignees ( ... );

### **3.3 정책 모듈 (Policy & Security)**

\-- 5\. Access Grants (동적 권한)  
CREATE TABLE access\_grants (  
    id BIGINT AUTO\_INCREMENT PRIMARY KEY,  
    \-- 권한 부여는 특정 유저에게 귀속되므로 user\_id를 통해 company 식별 가능  
    grantee\_user\_id BIGINT NOT NULL,   
      
    resource\_type VARCHAR(50) NOT NULL,  
    resource\_id BIGINT NOT NULL,  
    permission\_type VARCHAR(50) NOT NULL,  
      
    expiration\_time TIMESTAMP NOT NULL,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
      
    INDEX idx\_grant\_check (grantee\_user\_id, resource\_type, expiration\_time)  
) ENGINE=InnoDB;

### **3.4 도메인 모듈 (HR Functions)**

모든 도메인 테이블에 company\_id를 추가하여 **Tenant Isolation**을 물리적으로 지원합니다.

\-- 6\. Vacation Balances  
CREATE TABLE vacation\_balances (  
    id BIGINT AUTO\_INCREMENT PRIMARY KEY,  
    company\_id BIGINT NOT NULL, \-- Tenant ID  
    user\_id BIGINT NOT NULL,  
    year INT NOT NULL,  
      
    total\_days FLOAT DEFAULT 0,  
    used\_days FLOAT DEFAULT 0,  
    remaining\_days FLOAT DEFAULT 0,  
      
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP,  
      
    UNIQUE KEY uk_vac_balance (user_id, year),  
    INDEX idx_vac_company (company_id)  
) ENGINE=InnoDB;

-- 7. Vacation Requests (연차 신청 내역)
CREATE TABLE vacation_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL, -- Tenant ID
    user_id BIGINT NOT NULL,
    
    vacation_type VARCHAR(50) NOT NULL COMMENT 'ANNUAL, SICK, etc.',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    request_days FLOAT NOT NULL,
    reason VARCHAR(200) NULL,
    
    status VARCHAR(20) DEFAULT 'PENDING',
    approval_request_id BIGINT NULL COMMENT '결재 요청 ID',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_vac_req_company (company_id),
    INDEX idx_vac_req_user (user_id)
) ENGINE=InnoDB;

\-- 8\. Payrolls  
CREATE TABLE payrolls (  
    id BIGINT AUTO\_INCREMENT PRIMARY KEY,  
    company\_id BIGINT NOT NULL, \-- Tenant ID  
    user\_id BIGINT NOT NULL,  
      
    target\_year INT NOT NULL,  
    target\_month INT NOT NULL,  
    payment\_date DATE NOT NULL,  
      
    total\_amount DECIMAL(15, 0\) NOT NULL,  
    status VARCHAR(20) DEFAULT 'DRAFT',  
      
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
      
    UNIQUE KEY uk\_payroll\_target (user\_id, target\_year, target\_month),  
    INDEX idx\_payroll\_company\_date (company\_id, payment\_date)  
) ENGINE=InnoDB;

\-- 9\. Attendance (근태)  
CREATE TABLE attendance\_logs (  
    id BIGINT AUTO\_INCREMENT PRIMARY KEY,  
    company\_id BIGINT NOT NULL, \-- Tenant ID  
    user\_id BIGINT NOT NULL,  
    work\_date DATE NOT NULL,  
      
    check\_in\_time DATETIME NULL,  
    check\_out\_time DATETIME NULL,  
    work\_type VARCHAR(20) DEFAULT 'NORMAL',  
      
    INDEX idx\_att\_company\_date (company\_id, work\_date),  
    INDEX idx\_att\_user\_date (user\_id, work\_date)  
) ENGINE=InnoDB;

\-- 10\. Assets (자산)  
CREATE TABLE assets (  
    id BIGINT AUTO\_INCREMENT PRIMARY KEY,  
    company\_id BIGINT NOT NULL, \-- Tenant ID  
      
    category VARCHAR(50) NOT NULL,  
    model\_name VARCHAR(100) NOT NULL,  
    status VARCHAR(20) DEFAULT 'IN\_STOCK',  
    current\_user\_id BIGINT NULL,  
      
    INDEX idx\_asset\_company (company\_id),  
    INDEX idx\_asset\_user (current\_user\_id)  
) ENGINE=InnoDB;  
