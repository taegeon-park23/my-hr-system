# Backend Attendance Module 구현 완료 리포트

## 1. 개요
우선순위 계획의 Phase 2에 해당하는 **근태 관리 (Attendance) 모듈**의 핵심 기능을 구현했습니다.
사용자의 출근(Check-in) 및 퇴근(Check-out) 기록을 저장하고 관리하는 REST API를 제공합니다.

## 2. 구현 상세

### 2.1 데이터 모델 (`domain`)
*   **`AttendanceLog`**:
    *   `attendance_logs` 테이블과 매핑.
    *   `company_id`를 포함하여 멀티 테넌트 격리 지원.
    *   `check_in_time`, `check_out_time`, `work_type`, `ip_address` 저장.
    *   하루에 한 명의 유저는 하나의 레코드만 가짐 (`userId` + `date` 유니크 조건 논리적 적용).

### 2.2 비즈니스 로직 (`service`)
*   **`AttendanceService`**:
    *   `checkIn()`: 
        *   오늘 날짜의 기록이 이미 존재하는지 확인 (`IllegalStateException` 방지).
        *   없다면 새로운 `AttendanceLog` 생성 및 저장.
    *   `checkOut()`:
        *   오늘 날짜의 출근 기록을 조회.
        *   없다면 예외 발생 (출근 안 하고 퇴근 불가).
        *   퇴근 시간 업데이트 (Dirty Checking).

### 2.3 API 엔드포인트 (`controller`)
*   **`AttendanceController`**:
    *   `POST /api/attendance/check-in`: 출근. `UserPrincipal`에서 `userId`, `companyId` 자동 추출.
    *   `POST /api/attendance/check-out`: 퇴근.

## 3. 변경 사항 검증
*   **코드 구조**: Controller -> Service -> Repository -> Entity의 계층 구조 준수.
*   **보안 연동**: `@AuthenticationPrincipal`을 사용하여 앞서 구현한 `UserPrincipal`을 정상적으로 주입받아 사용.
*   **트랜잭션**: Service 계층에 `@Transactional` 적용 완료.

## 4. 향후 계획
*   **Frontend 연동**: Phase 3에서 프론트엔드의 "출근하기/퇴근하기" 버튼과 이 API를 연동합니다.
*   **월별 조회**: 캘린더 뷰를 위한 `GET /api/attendance/monthly` API 추가 구현이 필요합니다 (Query 모듈 권장).
