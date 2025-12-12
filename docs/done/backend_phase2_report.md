# Backend Phase 2 작업 리포트

## 1. 개요
백엔드 핵심 모듈(Core Modules)의 엔티티 및 리포지토리를 구현하고, 멀티 모듈 구조의 기반을 마련했습니다.

## 2. 작업 상세 내용

### 2.1 Tenant Module (`modules/tenant`)
- **Entity**: `Company`
    - 멀티 테넌시의 기준이 되는 회사 정보.
    - `domain` 필드를 통해 접속 URL 기반 테넌트 식별 가능.
- **Repository**: `CompanyRepository`

### 2.2 User & Org Module (`modules/user`, `modules/org`)
- **Entity**:
    - `User`: 사용자 정보. `company_id`로 소속 회사 구분. `dept_id`로 부서 연결 (Logical FK).
    - `Department`: 부서 정보. `path` 필드를 포함하여 계층 구조 표현 가능.
- **Repository**: `UserRepository`, `DepartmentRepository`.

### 2.3 Queries Module (`queries`)
- **Service**: `OrgChartQueryService`
    - **CQRS 패턴 적용**: 조회 전용 모듈 분리.
    - **Recursive Query**: JDBC Template을 사용하여 `company_id` 기준 전체 부서 목록을 조회 후, 메모리에서 트리 구조(`OrgChartNode`)로 변환.
    - **Data Isolation**: 모든 쿼리에 `WHERE company_id = ?` 조건 강제.

## 3. 기술적 검증
- **Tenant Isolation**: 모든 엔티티 및 쿼리에 `company_id` 포함 확인.
- **Module Separation**: 도메인 간 물리적 FK 제거 및 Logical ID 참조 방식 적용.

## 4. 커밋 예정 사항
- `backend/modules/**` (tenant, user, org)
- `backend/queries/**`
