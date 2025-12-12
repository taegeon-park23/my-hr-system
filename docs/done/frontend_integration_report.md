# Frontend Integration Phase 3 리포트

## 1. 개요
Frontend Mock API를 제거하고 실제 Backend Endpoint와 연동하는 작업을 수행했습니다.
가장 시급한 **인증(Auth)** 및 **근태(Attendance)** 기능을 우선적으로 통합했습니다.

## 2. 작업 상세

### 2.1 API Client Setup (`shared/api/client.ts`)
*   **Axios Instance 생성**: `baseURL`을 환경 변수 혹은 `http://localhost:8080`(Docker)으로 설정.
*   **Request Interceptor**: `localStorage`에 저장된 `accessToken`을 `Authorization: Bearer` 헤더에 자동 주입.
*   **Response Interceptor**: 401 Unauthorized 발생 시 자동 로그아웃 및 토큰 제거 처리.

### 2.2 Auth Integration (`features/auth`)
*   **Login API**: `POST /api/auth/login` 연동.
*   **JWT Decode**: Backend가 토큰만 반환하므로, Frontend에서 토큰의 Payload(Claims)를 파싱하여 User 정보(`id`, `email`, `role`, `companyId`)를 추출 및 저장하도록 개선.
*   **Persistence**: 로그인 성공 시 `localStorage`에 토큰 저장.

### 2.3 Attendance Integration (`features/attendance`)
*   **API**: `POST /api/attendance/check-in` 및 `check-out` 연동.
*   **UI (`AttendancePage`)**:
    *   **Check In 버튼**: 클릭 시 API 호출 및 성공 알림.
    *   **Check Out 버튼**: 추가 구현 및 API 연결.

## 3. 검증 결과
*   **로그인 Flow**: 로그인 시도 -> Backend 인증 -> 토큰 발급 -> Frontend 저장 -> 이후 모든 요청 헤더에 토큰 포함 확인.
*   **근태 Flow**: 대시보드에서 `Check In` 클릭 -> Backend `attendance_logs` 테이블 INSERT 확인 (예정).

## 4. 향후 과제
*   **Data Query Integration**: 아직 `getMonthlyAttendance` 등 조회 API는 Mock 상태입니다. Backend `queries` 모듈 구현 후 연동이 필요합니다.
*   **Error Handling**: Toast UI 컴포넌트를 도입하여 `alert()` 대신 세련된 에러 메시지 처리가 필요합니다.
