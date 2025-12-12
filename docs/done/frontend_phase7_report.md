# Frontend Phase 7 작업 리포트

## 1. 개요
급여 명세서(Payroll Stub)를 목록 형태로 조회할 수 있는 기능을 구현했습니다.

## 2. 작업 상세 내용

### 2.1 Payroll Feature Slice
`features/payroll` 경로에 구현.
- **Model**: `PayrollStub` (급여 대장) 타입 정의 (기본급, 공제액, 실수령액 등 포함).
- **API**: `getMyPayrolls` - 사용자의 급여 목록을 Mocking하여 반환.
- **UI**: `PayrollList` - 급여 지급 내역을 테이블(Table) 형태로 시각화.

### 2.2 Payroll Page
- `app/dashboard/payroll/page.tsx`: 급여 조회 페이지.
- 테이블 뷰를 통해 지급월, 지급일, 총액, 실수령액, 상태(지급완료/확정)를 확인.

## 3. 결과물
- **급여 조회 메뉴**: `/dashboard/payroll` 접속.
- **기능**:
    - 월별 급여 명세 목록 조회.
    - 금액(KRW) 포맷팅 적용.
    - 'View Slip' 버튼 (상세 보기 Placeholder).

## 4. 커밋 예정 사항
- `features/payroll` 전체.
- `app/dashboard/payroll` 페이지.
