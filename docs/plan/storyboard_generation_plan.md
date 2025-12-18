# StoryBoard 문서 생성 및 UI 기획 수립 계획 (PLAN-SB)

## 1. 개요
본 계획은 정보 구조 설계서(`Information_Architecture.md`)와 요구사항 명세서(`SPEC`), 그리고 디자인 시스템 가이드(`Design System Guide.md`)를 통합하여, 실제 화면 설계를 구체화하는 "StoryBoard 문서" 생성 전략을 정의합니다.

## 2. 생성 대상 화면 리스트
전체 시스템을 역할(Role)별로 구분하여 StoryBoard 문서를 생성합니다.

### A. 일반 사용자 포털 (Employee Portal) - 문서명: `SB_01_Employee_Portal.md`
| 화면 ID | 화면명 | 연결 SPEC | 주요 컴포넌트 |
| :--- | :--- | :--- | :--- |
| **SCR-EMP-01** | 개인 대시보드 | `SPEC_11` | QuickStats, MyRequestList, NoticeWidget |
| **SCR-EMP-02** | 근태 관리/조회 | `SPEC_05` | CalendarView, WorkTimeTable, CorrectionModal |
| **SCR-EMP-03** | 휴가 신청 | `SPEC_02` | LeaveBalanceCard, RequestForm, ApprovalLineSelector |
| **SCR-EMP-04** | 결재함 (My Inbox) | `SPEC_01` | DocFilterTab, DocListTable, StatusBadge |

### B. 관리자 콘솔 (Admin Console) - 문서명: `SB_02_Admin_Console.md`
| 화면 ID | 화면명 | 연결 SPEC | 주요 컴포넌트 |
| :--- | :--- | :--- | :--- |
| **SCR-ADM-01** | HR 현황 대시보드 | `SPEC_11` | OrgChartWidget, AttendanceAnomalies, VacationUsageGraph |
| **SCR-ADM-02** | 구성원 관리 (리스트) | `SPEC_04` | UserGrid, BulkActionToolbar, FilterPanel |
| **SCR-ADM-03** | 조직도 관리 | `SPEC_04` | TreeView, DeptDetailCard, DragDropArea |
| **SCR-ADM-04** | 결재 문서 전체 조회 | `SPEC_01` | AdminDocTable, ForceApprovalModal |

### C. 슈퍼 어드민 (Global Operations) - 문서명: `SB_03_Global_Admin.md`
| 화면 ID | 화면명 | 연결 SPEC | 주요 컴포넌트 |
| :--- | :--- | :--- | :--- |
| **SCR-GLB-01** | 테넌트 목록 | `SPEC_07` | TenantCardGrid, StatusToggle, PlanBadge |
| **SCR-GLB-02** | 테넌트 생성 마법사 | `SPEC_07` | Stepper, PlanSelectionCard, AdminAccountForm |
| **SCR-GLB-03** | 시스템 감사 로그 | `SPEC_07` | LogTable, DateRangePicker, JsonViewer |

## 3. StoryBoard 문서 표준 포맷
각 StoryBoard 문서는 다음과 같은 구조를 따릅니다.

```markdown
# [화면 ID] 화면명

## 1. 개요
- **목적**: 작업의 목적
- **사용자**: 접근 가능한 Role
- **연결 Spec**: SPEC 번호

## 2. 레이아웃 구조 (Wireframe Description)
* 텍스트로 레이아웃을 묘사 (Header, Sidebar, Main Content 영역 배치)
* 사용될 주요 컴포넌트 정의 (Design System Guide 참조)

## 3. 인터랙션 및 상태 (States)
- **Init**: 초기 로딩 상태
- **Empty**: 데이터 없음
- **Error**: API 실패
- **Action**: 버튼 클릭 시 동작 (모달 팝업, 페이지 이동 등)

## 4. 데이터 스펙 (Data Requirements)
- 필요 API: `GET /api/v1/...`
- 주요 필드: 화면에 표시될 데이터 필드
```

## 4. 실행 계획
1.  **Phase 1**: `SB_01_Employee_Portal.md` 생성 (가장 빈번하게 사용되는 화면)
2.  **Phase 2**: `SB_02_Admin_Console.md` 생성 (기능적 복잡도가 높은 화면)
3.  **Phase 3**: `SB_03_Global_Admin.md` 생성 (운영자 전용 화면)
4.  **Review**: 사용자에게 화면 구성 및 플로우 검토 요청

## 5. 승인 요청
위 계획대로 StoryBoard 문서를 순차적으로 생성하시겠습니까?
