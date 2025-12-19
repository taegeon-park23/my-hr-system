# 기획서: 직원 포털(Employee Portal) 백엔드 통합 및 Mock 제거

## 1. 개요
직원 포털 프론트엔드 구현(대시보드, 근태, 휴가, 결재) 완료에 따라, 현재 Mock 데이터로 동작하는 컴포넌트들을 실제 백엔드 API와 연동합니다. 이를 위해 백엔드 모듈에 부족한 엔드포인트(Summary, Team Info, Notice 등)를 추가하고, 프론트엔드 API 클라이언트를 업데이트합니다.

## 2. 현황 분석 및 Gap 리스트

### 2.1 대시보드 (Dashboard)
| 컴포넌트 | 현재 상태 (Frontend) | 필요 API (Backend) | 조치 사항 |
|---|---|---|---|
| `NoticeWidget` | Mock List 고정 | `GET /api/notifications/announcements` | Notification 모듈에 컨트롤러 및 엔드포인트 추가 |
| `AttendanceChart` | Mock Stats 고정 | `GET /api/attendance/summary` | Attendance 모듈에 요약 정보 조회 API 추가 |
| `TeamVacationWidget` | Mock List 고정 | `GET /api/vacations/team` | Vacation 모듈에 팀원 휴가 조회 API 추가 (Org 연동 필요) |
| `QuickActionWidget` | 정적 링크 | - | 연동 불필요 (Client Side Routing) |

### 2.2 근태 관리 (Attendance)
| 컴포넌트 | 현재 상태 (Frontend) | 필요 API (Backend) | 조치 사항 |
|---|---|---|---|
| `AttendanceSummaryCard` | Hardcoded Props | `GET /api/attendance/summary` | 위와 동일 API 사용 |
| `AttendanceFilterBar` | Local State | `GET /api/attendance/my?year={y}&month={m}` | 기존 API(`getMyLog`)에 날짜 필터링 파라미터 지원 확인/추가 |

### 2.3 휴가 신청 (Vacation Request)
| 컴포넌트 | 현재 상태 (Frontend) | 필요 API (Backend) | 조치 사항 |
|---|---|---|---|
| `MyVacationStatusCard` | `useMyVacationBalance` | `GET /api/vacations/balance` | **기존 API 연동 완료** |
| `ApprovalLinePreview` | Mock Steps | `GET /api/approval/line/preview` | Approval 모듈에 결재선 미리보기 API 추가 |

### 2.4 결재함 (Approval)
| 컴포넌트 | 현재 상태 (Frontend) | 필요 API (Backend) | 조치 사항 |
|---|---|---|---|
| `ApprovalList (Archive)` | Mock/Pending Filter | `GET /api/approval/archive` | Approval 모듈에 완료/반려 문서 조회 API 추가 |
| `ActionToolbar` | Mock Action | `POST /api/approval/steps/{id}/approve` | **기존 API 연동 완료** (단, 일괄 처리 API 검토) |

## 3. 백엔드 변경 계획 (Backend Implementation)

### 3.1 Attendance Module
- **Controller:** `AttendanceController`
    - `GET /my`: `year`, `month` 파라미터 처리 로직 보완
    - `GET /summary`: 당월 근무 시간, 지각/결근 횟수 집계 반환
- **Service:** `AttendanceService`
    - `getMonthlySummary(userId, year, month)` 구현

### 3.2 Vacation Module
- **Controller:** `VacationController`
    - `GET /team`: 사용자가 소속된 팀의 휴가 현황 조회
- **Service:** `VacationService`
    - `OrganizationModuleApi`를 호출하여 동료(Peer) ID 목록 획득 후 휴가 조회

### 3.3 Approval Module
- **Controller:** `ApprovalController`
    - `GET /archive`: `status`가 APPROVED/REJECTED인 문서 조회
    - `GET /line/preview`: 기안 유형에 따른 기본 결재선 반환 (ex: 본인 -> 팀장 -> 본부장)

### 3.4 Notification Module (New Controller)
- **Controller:** `NotificationController` (신규 생성)
    - `GET /announcements`: 전사 공지사항 조회 (우선 간단한 메모리/DB 조회)

## 4. 프론트엔드 변경 계획 (Frontend Integration)

### 4.1 API Client Update (`src/features/**/api/*.ts`)
- 각 모듈별 신규 API에 대한 SWR Hook 및 호출 함수 추가
    - `useAttendanceSummary()`
    - `useTeamVacation()`
    - `useApprovalArchive()`
    - `useAnnouncements()`
    - `useApprovalLinePreview()`

### 4.2 UI Binding
- `page.tsx` 및 Widget 컴포넌트에서 Mock Data 제거
- SWR Hook 데이터 바인딩 및 Loading/Error 상태 처리

## 5. 검증 계획
- **Backend:** `./gradlew test` (Unit Test 추가)
- **Frontend:** 브라우저에서 실제 데이터 로딩 확인
- **ArchUnit:** 모듈 간 참조 제약 위반 여부 확인
