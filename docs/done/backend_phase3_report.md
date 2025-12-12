# Backend Phase 3 작업 리포트

## 1. 개요
인별 업무(결재, 근태, 급여)를 처리하기 위한 비즈니스 로직 모듈들을 구현했습니다.

## 2. 작업 상세 내용

### 2.1 Approval Module (`modules/approval`)
- **Entities**:
    - `ApprovalRequest`: 결재 요청 본문. `content` 필드는 유연성을 위해 TEXT 타입 사용. `status`(PENDING, APPROVED, REJECTED) 관리.
    - `ApprovalStep`: 순차적 결재선을 위한 단계별 정보.
- **Repository**: `ApprovalRequestRepository` (기안자별 조회 쿼리 포함).

### 2.2 Vacation & Attendance Modules (`modules/vacation`, `modules/attendance`)
- **Vacation**:
    - `VacationBalance`: 연도별 연차 잔여일수 및 사용일수 관리.
    - `VacationBalanceRepository`: 사용자/연도별 조회 메소드.
- **Attendance**:
    - `AttendanceLog`: 일별 출퇴근 기록 및 근태 상태(지각, 결근 등) 관리.
    - `AttendanceLogRepository`: 날짜 범위(월별) 조회 메소드.

### 2.3 Payroll Module (`modules/payroll`)
- **Entity**:
    - `Payroll`: 월별 급여 명세서 정보. 기본급, 공제액(세금/보험), 실수령액 저장.
    - `status`(DRAFT, CONFIRMED, PAID)를 통해 급여 정산 프로세스 단계 표현.
- **Repository**: `PayrollRepository` (월별 조회).

## 3. 결과물
- **모듈 확장**: `settings.gradle`에 3개 모듈 추가.
- **도메인 모델**: 각 비즈니스 영역에 필요한 핵심 Entity 구축 완료.

## 4. 커밋 예정 사항
- `backend/modules/approval/**`
- `backend/modules/vacation/**`
- `backend/modules/attendance/**`
- `backend/modules/payroll/**`
