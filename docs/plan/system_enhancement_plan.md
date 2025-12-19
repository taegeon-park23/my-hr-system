# 시스템 고도화 상세 계획 (System Enhancement Plan)

## 1. 개요
본 문서는 "임직원 포털 Backend 통합 결과 보고서"에서 도출된 향후 계획을 구체화하여, 알림 시스템의 데이터베이스화, 결재선 로직의 고도화, 그리고 실시간 알림 기능 도입을 위한 기술적 설계 및 구현 계획을 정의합니다.

## 2. 세부 구현 목표

### A. 공지사항 및 알림 시스템 고도화 (Notification Module)
현재 정적 데이터로 제공되는 공지사항을 DB 기반으로 전환하고, 관리자 기능을 구현합니다.
- **DB Schema 설계**:
  - `announcement`: 공지사항 본문 (제목, 내용, 작성자, 중요도, 게시 기간 등)
  - `notification`: 개인별 알림 (수신자, 메시지, 읽음 여부, 링크, 생성일 등)
- **API 구현**:
  - `POST /api/admin/announcements`: 공지사항 등록 (Admin Only)
  - `GET /api/announcements`: 공지사항 목록 조회 (Paging, Filtering)
  - `GET /api/notifications`: 개인 알림 내역 조회
  - `PUT /api/notifications/{id}/read`: 알림 읽음 처리

### B. 결재선 로직 고도화 (Approval Module)
단순 "신청자 -> 매니저" 구조를 넘어, 부서 및 직책 기반의 동적 결재선 생성 로직을 구현합니다.
- **전결 규정 모델링**:
  - `approval_rule`: 결재 유형별(휴가, 비용 등) 전결 규정 (예: 휴가는 팀장 전결, 비용 100만 원 이상은 본부장 결재 등)
- **동적 결재선 생성**:
  - `ApprovalLineService` 구현: 기안자의 부서, 직책, 요청 유형/금액을 분석하여 결재 라인(Steps)을 자동 생성
  - `UserModuleApi` 활용: 조직도 상의 상위 부서장 조회 기능 강화

### C. 실시간 알림 (Real-time Notification)
중요 이벤트 발생 시 사용자에게 즉시 알림을 전달합니다.
- **기술 스택**: Server-Sent Events (SSE) (WebSocket 대비 오버헤드가 적고 단방향 알림에 적합)
- **연동 시나리오**:
  - 결재 요청 도착 시 → 결재자에게 알림
  - 결재 완료/반려 시 → 기안자에게 알림
  - 긴급 공지 등록 시 → 전 직원에게 알림

## 3. 단계별 실행 계획 (Roadmap)

### Phase 1: 알림/공지사항 DB화 및 Admin API
1. `modules:notification`에 Entity (`Announcement`, `Notification`) 및 Repository 생성
2. `NotificationService` 구현 (CRUD 로직)
3. Admin용 Controller 구현 및 기존 조회 API를 DB 연동으로 변경
4. ArchUnit 테스트 수행

### Phase 2: 결재선 고도화
1. `modules:approval`에 전결 규정 로직(`ApprovalRuleStrategy`) 도입
2. `UserModuleApi`에 상위 부서장 재귀 조회 메소드 추가 (`getLineManager`, `getDeptHead`)
3. `ApprovalService`의 `createRequest` 및 `getLinePreview` 로직에 전결 규정 적용

### Phase 3: SSE 기반 실시간 연동
1. `modules:notification`에 SSE Controller (`/api/sse/subscribe`) 구현
2. Spring Event Listener 도입:
   - `ApprovalCreatedEvent`, `ApprovalDecisionEvent` 리스너에서 `NotificationService` 호출
   - 알림 생성과 동시에 SSE Emitter로 이벤트 전송
3. Frontend: `useSSE` 훅 구현 및 전역 알림 컨텍스트(Toast) 연결

### Phase 4: 문서화 및 스키마 동기화
1. `docs/01_core/데이터베이스 설계 정의서.md`에 신규 테이블(`announcement`, `notification`, `approval_rule`) 스키마 정의 추가
2. `init.sql`에 신규 테이블 DDL 구문 추가하여 로컬 개발 환경 동기화

## 4. 사용자 리뷰 요청 사항
- **결재 규정**: 현재 구체적인 전결 규정(금액별/휴가일수별)이 정의되어 있지 않습니다. 임의의 표준 규정(팀장 -> 본부장 -> 대표)으로 구현해도 될까요?
- **SSE 타임아웃**: SSE 연결 유지 시간을 표준(30분)으로 설정하고, 만료 시 클라이언트에서 자동 재연결하도록 구현 예정입니다.
