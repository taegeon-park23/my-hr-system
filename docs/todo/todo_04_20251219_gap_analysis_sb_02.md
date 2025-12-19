# 분석 요약
- **User Management (SCR-ADM-02)**: 전체 기능(페이지 및 모달)이 누락되어 있어 가장 시급한 작업입니다.
- **Admin Documents (SCR-ADM-04)**: 관리자 전용 결재 모니터링 페이지가 부재합니다.
- **Org Tree (SCR-ADM-03)**: 트리 뷰는 존재하나, 우측 상세 패널 및 부서장 지정 로직이 미구현 상태입니다.

---

# Todo List (SB-02 Admin Console)

## SCR-ADM-02: 구성원 관리 (User Management)
- **[User] 구성원 목록 페이지 구현**
  - **위치:** `frontend/src/app/dashboard/users/page.tsx` (New), `frontend/src/features/user/ui/UserList.tsx` (New)
  - **현황:** 라우트 및 페이지 컴포넌트 부재.
  - **작업내용:**
    - `AgGrid` 또는 `TanStack Table`을 활용한 직원 목록 그리드 구현.
    - 검색(이름/부서) 및 필터(재직상태) Toolbar UI 컴포넌트 작성.
    - `useUserList` API 쿼리 훅 연결 (Backend `UserModuleApi` 스펙 확인 필요).
  - **중요도:** High

- **[User] 직원 등록/수정 모달 구현**
  - **위치:** `frontend/src/features/user/ui/UserUpsertModal.tsx` (New)
  - **현황:** 미구현.
  - **작업내용:**
    - 3-Tab 구조(기본/조직/계정) 폼 구현 (`react-hook-form` 사용 권장).
    - 조직정보 탭에서 `OrgTreeSelector` 컴포넌트 연동.
    - `createUser` 및 `updateUser` API Mutation 연결.
  - **중요도:** High

## SCR-ADM-04: 결재 문서 전체 조회
- **[Approval] 관리자용 전체 결재함 페이지**
  - **위치:** `frontend/src/app/dashboard/admin/approvals/page.tsx` (New)
  - **현황:** `admin/tenants` 외 관리자 기능 페이지 없음.
  - **작업내용:**
    - 전체 문서 조회용 API(`GET /admin/approvals`)와 연동된 리스트 뷰 구현.
    - Status Tabs (전체/진행/완료/반려)에 따른 필터링 로직 구현.
    - 일반 `ApprovalList` 컴포넌트 재사용 가능 여부 검토 및 Admin 전용 컬럼(Action) 확장.
  - **중요도:** Medium

- **[Approval] 관리자 강제 처리(Force Action) 기능**
  - **위치:** `frontend/src/features/approval/ui/AdminActionCell.tsx` (New)
  - **현황:** 미구현.
  - **작업내용:**
    - 리스트 내 `...` 버튼 클릭 시 '승인/반려' 옵션 메뉴(Dropdown) 구현.
    - 강제 처리 시 '사유 입력 모달' 팝업 및 `forceApprove/Reject` API 호출.
  - **중요도:** Medium

## SCR-ADM-03: 조직도 관리
- **[Org] 조직 상세 패널 및 부서장 지정**
  - **위치:** `frontend/src/features/org/ui/OrgDetailPanel.tsx` (New)
  - **현황:** 좌측 트리(`OrgTree`)만 존재하고 우측 상세 패널 없음.
  - **작업내용:**
    - 선택된 부서(`selectedNode`)의 메타정보(코드, 이름) 표시 폼.
    - 소속원 리스트 렌더링 및 '부서장(Manager)' Checkbox 이벤트 핸들러 구현.
    - Drag & Drop에 의한 부서 이동 시 낙관적 업데이트(Optimistic Update) 처리.
  - **중요도:** Medium

## SCR-ADM-01: HR 현황 대시보드
- **[Dashboard] 입/퇴사 추이 차트 추가**
  - **위치:** `frontend/src/widgets/Dashboard/HireResignChart.tsx` (New)
  - **현황:** `AttendanceChart`(근태)만 존재.
  - **작업내용:**
    - Recharts 라이브러리 활용하여 월별 입사/퇴사 Line Chart 구현.
    - `StatisticsModuleApi` 연동.
  - **중요도:** Low
