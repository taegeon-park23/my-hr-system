# 인사평가 모듈 구현 계획 (Evaluations Module Implementation Plan)

## 1. 개요 (Overview)
* **목표**: 임직원 성과 관리를 위한 인사평가(Evaluations) 모듈의 백엔드 기능을 구현한다.
* **범위**: DB 스키마 설계 및 구현, 핵심 비즈니스 로직(평가 회차 관리, 평가 수행), REST API 개발.
* **특이사항**: DB 설계서에 없는 신규 기능이므로, 본 계획 단계에서 데이터 모델을 확정해야 한다.

## 2. 데이터베이스 설계 (Database Schema Design)
다음과 같이 3개의 핵심 테이블을 신규 생성한다.

### 2.1 `evaluation_cycles` (평가 회차)
평가 기간 및 종류를 정의하는 메타 데이터.
```sql
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
) ENGINE=InnoDB COMMENT='평가 회차 정보';
```

### 2.2 `evaluations` (평가 대상자/인스턴스)
특정 회차에 특정 직원이 받는 평가의 상태 관리.
```sql
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
) ENGINE=InnoDB COMMENT='개인별 평가 인스턴스';
```

### 2.3 `evaluation_records` (평가 상세 기록)
자기평가, 동료평가, 상향평가 등 실제 평가 내용 저장.
```sql
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
) ENGINE=InnoDB COMMENT='세부 평가 기록';
```

## 3. 구현 상세 (Implementation Steps)

### Step 1: 모듈 구조 생성 및 Entity 구현
*   **패키지**: `com.hr.modules.evaluation` 생성.
*   **파일**:
    *   `domain/EvaluationCycle.java`, `Evaluation.java`, `EvaluationRecord.java`
    *   `repository/EvaluationCycleRepository.java` 등 생성.

### Step 2: 비즈니스 로직 (Service) 구현
*   **EvaluationCycleService**:
    *   `createCycle()`: 회차 생성 및 대상자 자동 선정(선택사항).
    *   `startCycle()`: 상태 변경 (DRAFT -> OPEN).
*   **EvaluationService**:
    *   `getMyEvaluations()`: 본인이 대상자인 평가 목록.
    *   `getToDoEvaluations()`: 본인이 평가해야 할 목록(본인/동료/부하).
    *   `submitEvaluation()`: 점수 및 코멘트 저장. 점수 집계 로직 포함.

### Step 3: API 컨트롤러 구현
*   **Admin API** (`/api/admin/evaluations`): 회차 관리, 현황 조회.
*   **User API** (`/api/evaluations`): 나의 평가 조회, 평가 수행.

### Step 4: 통합 및 문서화 (Integration & Documentation)
*   **UserModuleApi 연동**: 사용자 정보 검증 및 부서 정보 조회.
*   **DB 스키마 동기화**:
    *   `init.sql` 업데이트: 신규 테이블(`evaluation_cycles`, `evaluations`, `evaluation_records`) DDL 추가.
    *   `docs/01_core/데이터베이스 설계 정의서 (Database Design Specification).md` 업데이트: "4. Future Implementations"에 있던 내용을 정식 섹션("3.5 인사평가 모듈")으로 이동 및 상세화.

## 4. 검증 시나리오 (Verification)
1.  **Schema Sync**: `init.sql` 및 설계 문서가 실제 구현 코드와 일치하는지 확인.
2.  **Schema**: 로컬 DB 초기화 시 에러 없이 신규 테이블 생성 확인.
3.  **Cycle**: 관리자 계정으로 평가 회차 생성 및 시작 확인.
4.  **Process**:
    *   User A가 자신에 대한 자기평가(SELF) 제출.
    *   User B(팀장)가 User A에 대한 상위평가(MANAGER) 제출.
    *   User A의 `evaluations` 상태가 진행됨에 따라 점수/등급 산출 확인.

## 5. 예상 소요 (Estimated Effort)
*   총 15 Tools Steps 내외 예상.
