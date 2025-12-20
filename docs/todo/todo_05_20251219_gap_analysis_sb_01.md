# 분석 요약
**SB_01_Employee_Portal.md** 스토리보드를 기반으로 갭 분석을 수행한 결과, 전반적인 페이지 레이아웃과 UI 컴포넌트는 구현되어 있으나, **실제 비즈니스 로직(API 연동)**과 **인터랙션(Modal, Alert 대체)** 부분에서 다수의 누락이 발견되었습니다. 특히 근태 체크, 결재 승인/반려, 휴가 신청 확인 등 핵심 액션이 `alert` 처리로 되어 있어 실제 데이터 처리가 불가능한 상태입니다.

---

## 1. Dashboard (SCR-EMP-01)

- **[UI/Logic] QuickStats 위젯 데이터 및 UI 불일치**
  - **위치:** `src/widgets/Dashboard/QuickStats.tsx`
  - **현황:** 현재 "Remaining Vacation(텍스트)", "Pending Evaluations", "Payslip", "Team Members"를 표시 중임.
  - **작업내용:** 스토리보드 스펙에 맞춰 위젯 구성 변경.
    1. **근태:** 오늘 출근/퇴근 시간 표시 (API 연동 필요).
    2. **휴가:** Progress Bar UI 추가 (`ProgressBar` 컴포넌트 활용).
    3. **결재:** "내 진행 문서" 건수 표시.
    4. **할일:** "승인 대기 문서" 건수 표시.
  - **중요도:** Medium

- **[Logic] 근태 출퇴근 알림(Alert) 로직 실구현**
  - **위치:** `src/app/dashboard/attendance/page.tsx`
  - **현황:** "출근하기", "퇴근하기" 버튼 클릭 시 `alert`만 표출됨.
  - **작업내용:** `onClick` 핸들러에 실제 API(`POST /api/attendance/check-in`, `check-out`) 호출 로직 구현. 성공 시 토스트 메시지 및 데이터 갱신(`mutate`).
  - **중요도:** High

## 2. Attendance (SCR-EMP-02)

- **[UI] 근태 요약 카드 항목 불일치**
  - **위치:** `src/features/attendance/ui/AttendanceSummaryCard.tsx`
  - **현황:** Absent/Vacation Used 표시 중.
  - **작업내용:** 스토리보드 스펙인 "총 근무 시간", "지각 횟수", "연장 근무 시간"으로 표시 항목 변경 및 매핑 수정.
  - **중요도:** Low

## 3. Vacation (SCR-EMP-03)

- **[Interaction] 휴가 신청 시 확인(Confirm) 모달 부재**
  - **위치:** `src/features/vacation/ui/VacationRequestForm.tsx`
  - **현황:** `onSubmit` 실행 시 즉시 API 호출 후 `alert` 띄움.
  - **작업내용:** "상신하기" 클릭 시 `ConfirmModal`("정말 신청하시겠습니까?")을 띄우고, 확인 시 API 호출하도록 흐름 개선.
  - **중요도:** Medium

- **[Logic] 신청 전 잔여 연차 가검증(Validation)**
  - **위치:** `src/features/vacation/ui/VacationRequestForm.tsx`
  - **현황:** 폼 레벨의 날짜/사유 유효성 검사만 존재.
  - **작업내용:** `deduction`(차감일)이 `remainingDays`(잔여일)보다 클 경우 제출 버튼을 비활성화하거나 경고 메시지 표시 로직 추가.
  - **중요도:** High

## 4. Approval (SCR-EMP-04)

- **[Logic] 결재 탭 데이터 소스 및 명칭 매핑 점검**
  - **위치:** `src/app/dashboard/approval/page.tsx`
  - **현황:** '기안한 문서(initiated)' 탭이 `useApprovalInbox` 훅을 사용 중. (Naming 혼란)
  - **작업내용:**
    1. `useApprovalInbox`가 "수신함(결재 대기)"인지 "기안함(발신)"인지 서버 API 스펙(`approvalApi.ts`) 재확인 후 훅 이름 또는 호출 대상 변경.
    2. 필요 시 `useApprovalOutbox` 훅 신설 또는 적용.
  - **중요도:** Medium

- **[Logic] 일괄 승인/반려 (Bulk Action) 미구현**
  - **위치:** `src/app/dashboard/approval/page.tsx`
  - **현황:** `handleBulkApprove` 함수가 `alert`만 띄움.
  - **작업내용:** 선택된 ID 배열(`selectedIds`)을 루프 돌거나 일괄 처리 API(`POST /api/approval/bulk-approve`)를 호출하도록 구현.
  - **중요도:** High

- **[Logic] 빠른 승인 (Quick Action) 미구현**
  - **위치:** `src/features/approval/ui/ApprovalList.tsx`
  - **현황:** 리스트 내 승인 버튼 클릭 시 `onQuickApprove`가 호출되나 상위에서 `alert`만 처리.
  - **작업내용:** 개별 승인 API 호출 로직 연결.
  - **중요도:** High
