# 프론트엔드 휴가 모듈 연동 계획 (Frontend Vacation Integration Plan)

## 1. 개요 (Overview)
백엔드에 구현된 휴가 관리 API(`VacationController`)를 프론트엔드(`Next.js`)와 연동하여, 사용자가 실제로 휴가를 조회하고 신청할 수 있는 UI를 구현한다.

## 2. 작업 목표 (Goals)
1. **API 연동:** `VacationService` (Frontend hook/service) 구현.
2. **UI 구현:**
   - **내 휴가 현황 위젯:** 대시보드 또는 전용 페이지에서 잔여 연차 확인.
   - **휴가 신청 페이지:** 날짜 선택, 사유 입력, 신청 버튼.
   - **신청 이력 조회:** 신청 상태(대기/승인/반려) 목록 표시.
3. **통합 테스트:** 신청 시 백엔드 DB 저장 및 결재 요청 생성 확인.

## 3. 구현 상세 (Implementation Details)

### 3.1 디렉토리 구조 (Directory Structure)
```
frontend/src/app/dashboard/vacation/
├── page.tsx        # 휴가 관리 메인 페이지 (잔여 현황 + 신청 이력)
├── request/
│   └── page.tsx    # 휴가 신청 폼 페이지
```

### 3.2 API Client (`src/lib/api/vacation.ts`)
백엔드 `VacationController`와 통신하는 함수 정의.
- `getVacationBalance(year)`
- `getVacationRequests()`
- `requestVacation(data)`

### 3.3 UI 컴포넌트 (Components)
- **`VacationBalanceCard`**: 잔여/사용/총 연차 시각화.
- **`VacationRequestList`**: 테이블 형태의 신청 이력.
- **`VacationRequestForm`**: React Hook Form 사용. DatePicker 연동.

## 4. 화면 설계 (Screen Draft)
- **메인 (/dashboard/vacation)**
  - 상단: `VacationBalanceCard` (Grid Layout)
  - 중단: "휴가 신청하기" 버튼 (-> `/request` 이동)
  - 하단: `VacationRequestList`
- **신청 (/dashboard/vacation/request)**
  - 폼: 휴가 종류(Select), 시작/종료일(DateRange), 사유(Textarea)

## 5. 검증 계획 (Verification Plan)
- **Manual Test:** 
  1. 로그인 (Mock User).
  2. `/dashboard/vacation` 접속하여 잔여 연차 조회 확인.
  3. 휴가 신청(연차, 내일~모레).
  4. 목록에서 'PENDING' 상태 확인.
  5. DB(`vacation_requests`, `approval_requests`) 데이터 확인 (Docker logs or CLI).

## 6. 일정 (Schedule)
- **예상 소요 시간:** 2시간
- **진행 순서:** API Client -> Page Skeleton -> Components -> Integration
