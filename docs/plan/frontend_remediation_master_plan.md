# Frontend Gap Remediation Master Plan (Phase 5-8)

## 0. 개요
- **목적:** `docs/todo/todo_02_20251218.md`에서 식별된 프론트엔드 기능 누락 및 UX 미비 사항을 체계적으로 보완.
- **대상:** `frontend/src`

## 1. 상세 추진 계획

### Phase 5: Critical Fixes (필수 기능 복구)
**목표:** 사용자가 시스템을 '사용'할 수 있는 최소한의 기능(결재 처리, 안정적 로그인) 확보.
- **Step 1: Approval Action UI**
  - `dashboard/approval/[id]`: 주석 처리된 승인/반려 버튼 UI 복구 및 API 연동.
  - 상태 변경 후 UI 즉시 반영 (React Query invalidation).
- **Step 2: Authentication UX**
  - `features/auth`: 로그인 실패 시 명확한 에러 메시지 표시.
  - 토큰 만료 시(401) 로그인 페이지로 리다이렉트 또는 Refresh Token 로직 점검.

### Phase 6: Dashboard Expansion (대시보드 확장)
**목표:** 정적인 대시보드를 실 데이터 기반의 동적 대시보드로 전환하고, 관리자용 뷰 추가.
- **Step 1: Widget Implementation**
  - `widgets/Dashboard`: 현재 하드코딩된 숫자를 백엔드 `DashboardController` (`/api/dashboard/summary`)와 연동.
  - 부서별 인원 통계 차트(Recharts 등 활용) 추가.
- **Step 2: Team Dashboard View**
  - 팀장(Manager) 권한 로그인 시 '팀 근태 현황', '휴가 캘린더' 위젯 표시.

### Phase 7: Global Admin Console (슈퍼 관리자)
**목표:** 멀티 테넌트 SaaS 플랫폼 관리를 위한 슈퍼 어드민 전용 콘솔 구축.
- **Step 1: Admin Layout & Navigation**
  - `Sidebar`: 사용자 권한(ROLE_SUPER_ADMIN)에 따른 메뉴 분기 처리.
  - `/admin` 라우트 및 하위 페이지 스캐폴딩.
- **Step 2: Tenant Management UI**
  - `/admin/tenants`: 테넌트 목록 조회, 생성, 삭제 기능 구현.
  - **Impersonation UI:** 테넌트 목록에서 '관리자로 접속(Impersonate)' 버튼 구현 및 토큰 교체 로직.

### Phase 8: UX Polish (사용자 경험 개선)
**목표:** 시스템의 완성도를 높이는 시각적/기능적 디테일 보완.
- **Step 1: Approval Timeline**
  - 결재 상세 화면에 단계별(Step-by-step) 진행 상황을 보여주는 타임라인 컴포넌트 추가.
- **Step 2: Error Handling & Validation**
  - Form 입력 시 유효성 검사 메시지 통일.
  - API 에러 발생 시 공통 Toast 메시지 또는 Error Boundary 처리.

## 2. 일정 계획
- 각 Phase는 약 1~2일 소요 예상.
- Phase 5 완료 시점부터 부분적 배포/테스트 가능.

## 3. 검증 전략
- **Manual Testing:** 각 UI 컴포넌트의 동작 및 백엔드 연동 확인.
- **Storybook (Optional):** 주요 컴포넌트(Timeline, Widgets) 독립 테스트.
