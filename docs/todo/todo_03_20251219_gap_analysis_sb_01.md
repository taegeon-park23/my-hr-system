# Storyboard Gap Analysis: SB-01 Employee Portal

**분석 일시**: 2025-12-18
**대상**: `docs/04_storyboards/SB_01_Employee_Portal.md` vs `frontend/src/app/dashboard/**`

## 1. 분석 요약
현재 구현된 `Employee Portal`은 기획서(`SB-01`)와 구조적, 기능적 차이가 큽니다.
특히 **대시보드**는 관리자용 위젯이 혼용되어 있어 전면적인 수정이 필요하며, **휴가 신청** 및 **결재함**은 핵심 편의 기능(정보 패널, 일괄 처리 등)이 누락되어 있습니다.

---

## 2. 상세 Todo List

### [Dashboard] SCR-EMP-01 개인 대시보드 재구축
- **위치**: `frontend/src/app/dashboard/page.tsx`
- **현황**: `ManagerStats`, `DepartmentHeadcount` 등 관리자용 컴포넌트가 배치됨. `QuickStats`만 일부 일치.
- **작업내용**:
  - `ManagerStats` 및 `DepartmentHeadcount` 제거.
  - **[Left Panel]** `NoticeWidget` (공지사항) 및 `AttendanceChart` (근태 요약) 컴포넌트 신규 개발 및 배치.
  - **[Right Panel]** `QuickActionWidget` (휴가/증명서) 및 `TeamVacationWidget` (팀원 휴가 현황) 배치.
  - `Header`에 "안녕하세요, {Name}님" 및 현재 시간 표시 로직 추가.
- **중요도**: **High**

### [Attendance] SCR-EMP-02 근태 관리 UI 고도화
- **위치**: `frontend/src/app/dashboard/attendance/page.tsx`
- **현황**: 단일 페이지에 근태/휴가가 혼재됨. 필터 바와 요약 카드가 누락됨.
- **작업내용**:
  - `AttendanceFilterBar` 구현 (년/월 선택 DatePicker).
  - `AttendanceSummaryCard` 구현 (총 근무, 지각, 연장 근무 시간 표시).
  - `ToggleButton` (List vs Calendar) 추가 및 `DataGrid` 기반의 **List View** 구현 (Default).
  - `CorrectionModal` (근태 수정 요청) 구현 및 연동.
- **중요도**: Medium

### [Vacation] SCR-EMP-03 휴가 신청 정보 패널 추가
- **위치**: `frontend/src/app/dashboard/vacation/request/page.tsx`, `VacationRequestForm.tsx`
- **현황**: 입력 폼만 존재함. 잔여 연차 및 결재선 확인 불가.
- **작업내용**:
  - 레이아웃을 2-Column (Form vs Info)으로 변경.
  - **[Right Panel]** `MyVacationStatusCard` (잔여 연차 표시) 재사용 또는 배치.
  - **[Right Panel]** `ApprovalLinePreview` (결재선 미리보기) 컴포넌트 추가.
  - **[Form]** 기간 선택 시 "예상 차감 일수" 자동 계산 및 표시 로직(`useWatch` 활용) 추가.
- **중요도**: **High** (사용자 경험 핵심)

### [Approval] SCR-EMP-04 결재함 기능 보강
- **위치**: `frontend/src/app/dashboard/approval/page.tsx`, `ApprovalList.tsx`
- **현황**: 단순 리스트 나열. 검색 및 일괄 처리 불가.
- **작업내용**:
  - `ApprovalActionToolbar` 추가 (검색바, 일괄 승인 버튼).
  - 탭 구성 변경: [결재할 문서] / [기안한 문서] / **[완료함]**(Archive) 추가.
  - `ApprovalList` 아이템 우측에 **Quick Action** (승인/반려 아이콘) 버튼 추가.
  - 다중 선택을 위한 Checkbox 로직 추가 (`ApprovalList` 내).
- **중요도**: Medium
