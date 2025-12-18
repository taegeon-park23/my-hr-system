# Phase 3: 대시보드(Dashboard) 기능 구현 상세 설계서

## 1. 개요
테넌트 관리자 및 유저가 시스템의 전반적인 현황을 한눈에 파악할 수 있도록 통계 데이터를 제공하는 대시보드를 구현합니다. CQRS 원칙에 따라 조회 전용 계층(`queries`)에 구현합니다.

## 2. 주요 제공 데이터 (KPI)
- **인력 현황 (Headcount):** 테넌트 전체 인원수, 부서별 인원 통계.
- **결재 현황 (Approval Status):** 현재 진행 중(PENDING)인 결재 건수, 승인/반려 통계.
- **근태 현황 (Attendance):** 오늘 출근자 수, 지각/결근자 수 (Attendance 모듈 연동).

## 3. 구현 설계
### 3.1 DTO 정의
- `DashboardSummaryDto`: 전체 카운트 데이터.
- `DepartmentStatDto`: 부서별 통계.

### 3.2 DashboardQueryService
- `queries` 모듈에 위치.
- `EntityManager` 또는 `JdbcTemplate`를 사용하여 여러 테이블(`users`, `departments`, `approval_requests`, `attendance`)을 JOIN 또는 Aggregate 조회.
- **테넌트 격리:** 모든 쿼리에 `company_id` 필터 강제 적용.

### 3.3 DashboardController
- `GET /api/dashboard/summary`: 요약 데이터 반환.
- `GET /api/dashboard/dept-stats`: 부서별 상세 통계.

## 4. 작업 순서
1. `queries` 모듈 내 `com.hr.queries.dashboard` 패키지 생성.
2. DTO 클래스 구현.
3. `DashboardQueryService` 구현 (복잡 쿼리 작성).
4. `DashboardController` 구현.
5. `queries/build.gradle` 의존성 확인 (user, org, approval 모듈 등).

## 5. 검증 계획
- **조회 정합성:** DB에 수동으로 데이터를 넣고 대시보드 카운트가 일치하는지 확인.
- **테넌트 격리:** 다른 테넌트의 데이터가 섞이지 않는지 SQL 바인딩 파라미터 확인.
- **ArchUnit:** `queries` 모듈에서 `modules` 엔티티 참조가 허용되는지 재확인.
