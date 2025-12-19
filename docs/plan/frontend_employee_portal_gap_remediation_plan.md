# [Frontend] Employee Portal Gap Remediation Implementation Plan

## 1. 개요
본 플랜은 `docs/todo/todo_03_20251219_gap_analysis_sb_01.md`에서 도출된 Employee Portal의 기획서(SB-01)와 실제 구현 간의 차이를 해소하기 위한 프론트엔드 작업 계획입니다.
대시보드, 근태 관리, 휴가 신청, 결재함의 UI/UX를 기획서 스펙에 맞춰 재구축하여 사용자 경험을 개선합니다.

## 2. User Review Required (중요 변경 사항)
> [!IMPORTANT]
> **대시보드 전면 개편 (Dashboard Rebuild)**: 
> 기존 관리자 중심의 위젯(`ManagerStats`, `DepartmentHeadcount`)은 제거되며, 개인화된 위젯(`NoticeWidget`, `AttendanceChart`, `MyVacationStatus`)으로 대체됩니다.

> [!IMPORTANT]
> **휴가 신청 레이아웃 변경**: 
> 기존 단일 폼(Form-only) 형태에서 **2-Column (좌측 입력 폼 / 우측 연차 정보 및 결재선)** 구조로 변경됩니다.

## 3. 상세 작업 내용 (Proposed Changes)

### 3.1 [Dashboard] SCR-EMP-01 개인 대시보드 재구축
- **Target File**: `frontend/src/app/dashboard/page.tsx`
- **신규 컴포넌트**:
  - `widgets/dashboard/NoticeWidget.tsx`: 공지사항 목록 (최신 5건).
  - `widgets/dashboard/AttendanceChart.tsx`: 개인 근태 요약 (지각, 연장 등) 및 근무 시간 Progress Bar.
  - `widgets/dashboard/QuickActionWidget.tsx`: 휴가 신청, 증명서 발급 등 바로가기 아이콘.
  - `widgets/dashboard/TeamVacationWidget.tsx`: 소속 팀원의 휴가 현황 리스트.
- **주요 변경**:
  - `Layout`: Grid 시스템을 활용한 좌/우 2-Column 배치.
  - `Header`: "안녕하세요, {Name}님" 문구 및 실시간 시계 컴포넌트 추가.

### 3.2 [Attendance] SCR-EMP-02 근태 관리 UI 고도화
- **Target File**: `frontend/src/app/dashboard/attendance/page.tsx`
- **신규 컴포넌트**:
  - `features/attendance/ui/AttendanceFilterBar.tsx`: 년/월 선택 DatePicker.
  - `features/attendance/ui/AttendanceSummaryCard.tsx`: 총 근무 시간, 지각 횟수, 잔여 연차 등 요약 정보 카드.
  - `features/attendance/ui/CorrectionModal.tsx`: 근태 이상 발생 시 수정 요청 모달.
- **주요 변경**:
  - List View를 기본으로 하며, Calendar View와 전환 가능한 Toggle 버튼 구현.
  - DataGrid를 활용하여 일자별 근태 상세 내역 표시.

### 3.3 [Vacation] SCR-EMP-03 휴가 신청 정보 패널 추가
- **Target File**: `frontend/src/app/dashboard/vacation/request/page.tsx`
- **신규/수정 컴포넌트**:
  - `features/vacation/ui/MyVacationStatusCard.tsx`: 현재 잔여 연차 및 사용 예정 연차 표시.
  - `features/approval/ui/ApprovalLinePreview.tsx`: 선택된 결재 라인 미리보기.
  - `features/vacation/ui/VacationRequestForm.tsx`: `useWatch` 훅을 활용한 실시간 예상 차감 일수 계산 로직 추가.
- **주요 변경**:
  - 화면 레이아웃을 2-Column으로 분리하여 정보 접근성 강화.

### 3.4 [Approval] SCR-EMP-04 결재함 기능 보강
- **Target File**: `frontend/src/app/dashboard/approval/page.tsx`
- **신규 컴포넌트**:
  - `features/approval/ui/ApprovalActionToolbar.tsx`: 다중 선택 후 일괄 승인/반려 처리를 위한 툴바.
- **주요 변경**:
  - **Tabs**: [결재할 문서] / [기안한 문서] / [완료함(Archive)] 3개 탭으로 구성.
  - **Quick Action**: 리스트 아이템 우측에 승인/반려 바로가기 버튼 배치.
  - **Bulk Action**: 리스트 내 Checkbox 추가 및 다중 건 처리 로직 구현.

## 4. 검증 계획 (Verification Plan)

### 4.1 자동화 테스트 (Automated Tests)
- `npm run lint`: ESLint 규칙 준수 여부 및 컴포넌트 임포트 경로 오류 확인.
- `npm run build`: 프로덕션 빌드 성공 여부 확인 (타입 오류 및 번들링 문제 점검).

### 4.2 수동 검증 (Manual Verification)
1. **대시보드 위젯 로딩 확인**: 각 위젯(공지, 근태, 팀휴가)이 정상적으로 렌더링되고 데이터가 표시되는지 확인.
2. **휴가 신청 계산 로직**: 반차/연차 선택 및 기간 변경에 따라 "예상 차감 일수"가 정확히 변경되는지 확인.
3. **근태 필터링**: 년/월 변경 시 해당 월의 근태 데이터만 리스트에 노출되는지 확인.
4. **결재함 탭 이동**: 탭 전환 시 문서 리스트가 올바르게 필터링(대기/기안/완료)되는지 확인.
