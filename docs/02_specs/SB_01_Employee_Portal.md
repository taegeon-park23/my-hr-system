# StoryBoard: 일반 사용자 포털 (SB-01)

## 0. 개요
본 문서는 일반 직원(User Role)이 일상적으로 사용하는 **Self-Service Portal**의 주요 화면 구성을 정의한다.
레이아웃과 디자인 요소는 `docs/03_guides/디자인 시스템 가이드.md`를 준수한다.

---

## **1. SCR-EMP-01: 개인 대시보드 (Personal Dashboard)**

### **1.1 개요**
*   **목적**: 로그인 직후 첫 화면으로, 나의 근태, 휴가, 결재 현황을 한눈에 파악하고 빠른 바로가기를 제공한다.
*   **사용자**: All Employees
*   **연결 Spec**: `SPEC_11`

### **1.2 레이아웃 (Layout Strategy)**
*   **Grid System**: 12-column Grid (Mobile 1-col, Tablet 2-col, Desktop 4-col)
*   **Components**:
    *   **Header**: Welcome Message ("안녕하세요, {Name}님 👋") + 현재 날짜/시간
    *   **QuickStats (Top Row)**: 4장의 카드 위젯
        1.  **근태**: 오늘 출근 시간 / 퇴근 예정 시간 (상태 배지 포함)
        2.  **휴가**: 잔여 연차 / 총 연차 (Progress Bar 형태)
        3.  **결재**: 진행 중인 내 문서 (건수)
        4.  **할일**: 내가 승인해야 할 문서 (건수, `Waiting` 상태)
    *   **Main Content (2-Column Split)**:
        *   **Left (2/3)**: [최근 공지사항] + [이번 달 근태 요약 차트]
        *   **Right (1/3)**: [Quick Action Buttons] (휴가 신청, 증명서 발급) + [팀원 휴가 현황]

### **1.3 인터랙션 및 상태**
*   **Init**: 위젯별 Skeleton UI 로딩.
*   **Quick Action**: "휴가 신청" 클릭 시 → `SCR-EMP-03` 로 이동.
*   **Timer**: 근태 카드의 "현재 시간"은 초 단위 갱신.

---

## **2. SCR-EMP-02: 근태 관리 (My Attendance)**

### **2.1 개요**
*   **목적**: 자신의 월간 근태 기록을 조회하고, 누락된 내역에 대해 수정을 요청한다.
*   **연결 Spec**: `SPEC_05`

### **2.2 레이아웃**
*   **Filter Toolbar**: [년/월 선택(DatePicker)]
*   **Content area**:
    *   **Summary Card**: 선택된 달의 총 근무 시간, 지각 횟수, 연장 근무 시간 표시.
    *   **Calendar View / List View Toggle**:
        *   **List View (Default)**: `DataGrid` 컴포넌트 사용.
            *   Cols: 날짜 | 요일 | 출근 시각 | 퇴근 시각 | 근무 시간 | 상태(지각/정상) | 비고
            *   Row Click: 상세 모달 오픈.

### **2.3 인터랙션**
*   **수정 요청**: 특정 Row의 "수정 요청" 버튼 클릭 → **CorrectionModal** 오픈.
    *   **Modal**: 변경 사유 입력(Textarea) -> "요청" -> 결재 모듈 연동.
*   **상태 표시**: 지각(`Warning` color), 결근(`Danger` color), 휴가(`Info` color).

---

## **3. SCR-EMP-03: 휴가 신청 (Vacation Request)**

### **3.1 개요**
*   **목적**: 연차, 반차, 병가 등 다양한 휴가를 신청한다.
*   **연결 Spec**: `SPEC_02`, `SPEC_01`

### **3.2 레이아웃**
*   **Left Panel (신청 폼)**:
    *   **휴가 유형**: `Select Box` (연차, 반차, 경조사 등)
    *   **기간 선택**: `DateRangePicker`
    *   **반차 선택 시**: 오전/오후 라디오 버튼 동적 노출.
    *   **사유**: `TextArea`
    *   **예상 차감 일수**: 기간 선택 시 자동 계산되어 표시 ("총 3.0일 차감 예정").
*   **Right Panel (정보 패널)**:
    *   **내 연차 현황**: 카드 형태 (총 15일 / 사용 5일 / 잔여 10일).
    *   **결재선 미리보기**: 자동으로 지정된 결재 라인(팀장 -> 본부장) 표시 (`Timeline` 컴포넌트).

### **3.3 인터랙션**
*   **Validation**:
    *   잔여 연차보다 신청 일수가 많으면 "잔여 연차가 부족합니다" 에러 메시지(`Validation Check`).
    *   이미 신청된 날짜와 중복 시 차단.
*   **Submit**: "상신하기" 클릭 → Confirm 모달 ("정말 신청하시겠습니까?") → 완료 시 `SCR-EMP-04`로 이동.

---

## **4. SCR-EMP-04: 결재함 (Approval Box)**

### **4.1 개요**
*   **목적**: 내가 기안한 문서의 상태를 확인하거나, 나에게 요청된 문서를 승인/반려한다.
*   **연결 Spec**: `SPEC_01`

### **4.2 레이아웃**
*   **Tab Interface**: [결재할 문서 (Inbox)] / [기안한 문서 (Sent)] / [완료함 (Archive)]
*   **Search Bar**: 제목, 기안자 검색.
*   **Approval List**: `DataGrid`
    *   **Inbox Cols**: 기안일 | 제목 | 기안자 | 유형 | 현재 단계 | Action(승인/반려)
*   **Quick Action**: 리스트 우측 끝에 "승인", "반려" 아이콘 버튼 배치 (빠른 처리).

### **4.3 인터랙션**
*   **Bulk Action**: 문서 다중 선택(Checkbox) 후 상단 "일괄 승인" 버튼 활성화.
*   **Detail View**: 리스트 클릭 시 우측 슬라이드 패널(Drawer) 또는 페이지 이동으로 상세 내용 표시.
