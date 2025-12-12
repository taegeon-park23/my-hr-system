# Frontend Phase 6 작업 리포트

## 1. 개요
근태(Attendance) 관리와 연차(Vacation) 현황을 한눈에 볼 수 있는 대시보드 페이지를 구현했습니다.

## 2. 작업 상세 내용

### 2.1 Feature Slices
- **Vacation (`features/vacation`)**
    - `VacationBalance` 모델 및 API 구현.
    - `VacationStatus`: 잔여 연차 및 사용률을 시각적으로 보여주는 카드 컴포넌트.
- **Attendance (`features/attendance`)**
    - `AttendanceLog` 모델 및 API 구현.
    - `AttendanceCalendar`: 월별 출퇴근 기록 및 상태(지각, 결근, 휴가)를 달력 형태로 표시.

### 2.2 Attendance Page
- `app/dashboard/attendance/page.tsx`: 근태/휴가 통합 페이지.
- **Grid Layout**: 좌측에 연차 현황 카드, 우측에 근태 캘린더 배치.
- **Data Fetching**: `Promise.all`을 사용하여 두 도메인의 데이터를 병렬로 조회.

## 3. 결과물
- **근태/휴가 메뉴**: `/dashboard/attendance` 접속.
- **기능**:
    - 나의 잔여 연차 확인.
    - 이번 달 출퇴근 기록 및 상태 확인.
    - 출근 체크(Check In) 버튼 (현재 Mock 동작).

## 4. 커밋 예정 사항
- `features/vacation`, `features/attendance` 전체.
- `app/dashboard/attendance` 페이지.
