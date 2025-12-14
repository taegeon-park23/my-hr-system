# 결재 모듈 테스트 데이터 및 가이드 작성 계획

## 1. 개요 (Overview)
본 문서는 `samsung.com` 테넌트 기반으로 결재 모듈을 테스트하기 위해 필요한 **기초 데이터(Seed Data)** 생성 스크립트와 **테스트 가이드(Test Guide)** 작성 계획을 정의한다.

## 2. 목표 (Goals)
1.  **멀티 테넌트 환경 검증**: `samsung.com` 도메인을 사용하는 독립적인 테넌트 환경 구성.
2.  **결재 시나리오 수행 가능성 확보**: 기안자(Requester)와 결재자(Approver) 계정을 생성하여 실제 결재 프로세스(상신 -> 승인/반려)를 수행할 수 있도록 함.
3.  **사용자 매뉴얼 제공**: 개발자 및 QA가 쉽게 테스트를 재연할 수 있도록 상세 가이드 문서 제공.

## 3. 작업 범위 (Scope)

### 3.1 데이터 생성 (Data Generation)
-   **대상 테이블**: `companies`, `departments`, `users`
-   **데이터 명세**:
    -   **Company**: 삼성전자 (Samsung Electronics) / 도메인: `samsung.com`
    -   **Departments**:
        -   IT 개발팀 (상위 부서)
        -   인사팀 (관리 부서)
    -   **Users**:
        1.  `kim.staff@samsung.com` (기안자 / IT 개발팀 사원)
        2.  `lee.manager@samsung.com` (결재자 / IT 개발팀 팀장)
        3.  `park.hr@samsung.com` (인사 담당자 / 인사팀)
    -   **Password**: 모든 계정의 비밀번호는 `password1234!` (BCrypt 암호화 적용)로 통일.

### 3.2 문서 작성 (Documentation)
-   **파일 위치**: `docs/guides/manual_approval_test_kr.md`
-   **내용**:
    1.  데이터 셋업 방법 (SQL 실행)
    2.  로그인 및 접속 정보
    3.  시나리오 1: 휴가 신청 및 결재 (Happy Path)
    4.  시나리오 2: 반려 및 재상신 (Alternative Path)

## 4. 데이터베이스 스키마 및 쿼리 전략 (DB Strategy)

### 4.1 Companies Insert
```sql
INSERT INTO companies (name, domain, status, is_active, created_at, updated_at)
VALUES ('Samsung Electronics', 'samsung.com', 'ACTIVE', 1, NOW(), NOW());
```

### 4.2 Departments Insert
`companies` 테이블에서 `samsung.com`의 ID를 조회하여 FK로 사용.

### 4.3 Users Insert
`companies` 및 `departments` ID를 매핑하여 생성.

## 5. 검증 계획 (Verification Plan)
1.  **데이터 적재 확인**:
    -   MySQL Client 접속 후 `SELECT * FROM users WHERE email LIKE '%@samsung.com'` 쿼리로 데이터 확인.
2.  **로그인 테스트**:
    -   프론트엔드(`localhost:3000`) 접속.
    -   `kim.staff@samsung.com` 으로 로그인 성공 여부 확인.
3.  **결재 상신 테스트**:
    -   로그인 후 [휴가 신청] 메뉴 접근 및 신청서 작성 가능 여부 확인.

## 6. 산출물 (Deliverables)
1.  `docs/guides/manual_approval_test_kr.md` (테스트 가이드)
2.  `backend/src/main/resources/sql/test_data_samsung.sql` (데이터 생성 스크립트)
