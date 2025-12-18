# 백엔드 미비 기능 보완 및 고도화 마스터 플랜

## 1. 개요
본 문서는 `docs/todo/todo_01_20251218.md`에서 식별된 백엔드 기능 누락 및 기술적 부채를 해결하기 위한 단계별 실행 계획입니다.

**문서 기준:** 2025-12-18
**참조 문서:** `docs/todo/todo_01_20251218.md`, `SPEC_01`, `SPEC_02`

---

## 2. Phase 1: Approval 모듈 고도화 (Priority 1)
**목표:** 단순 1단계 승인(MVP)을 다단계(Sequential/Parallel) 결재 프로세스로 정상화.

### Step 1.1: 상세 설계 및 분석
- [ ] **Task:** `SPEC_01` (전자결재) 워크플로우 재분석 (직렬/병렬 조건 확인 및 상태 전이도 작성).
- [ ] **Task:** DB 스키마 설계 (`ApprovalLine`, `ApprovalStep` 추가 및 `ApprovalRequest` 관계 재설정).
- [ ] **Task:** API 명세 업데이트 (결재선 지정 파라미터, 다건 승인/반려 API 등).

### Step 1.2: 도메인 레이어 구현
- [ ] **Task:** `ApprovalLine` (결재선) 및 `ApprovalStep` (결재 단계) 엔티티 구현.
- [ ] **Task:** `ApprovalRequest` 엔티티 수정 (단순 Status 필드 → 결재선 연동, CurrentStep 필드 추가).
- [ ] **Task:** `ApprovalPolicy` 도메인 서비스 구현 (다음 결재자 지정, 전결 처리 로직).

### Step 1.3: 서비스 및 API 구현
- [ ] **Task:** `ApprovalService.approve()` 로직 수정 (현재 단계 승인 처리 -> 다음 단계 활성화 or 최종 승인).
- [ ] **Task:** `ApprovalService.reject()` 로직 구현 (반려 시 전체 프로세스 종료 및 반려 사유 저장).
- [ ] **Task:** 결재 진행 상황 조회 API 구현 (API Resonse에 결재선 상태 포함).

### Step 1.4: 검증 (Verification)
- [ ] **Task:** 다단계 결재 시나리오(신청 -> 중간승인 -> 최종승인) 통합 테스트 코드 작성.
- [ ] **Task:** `ArchUnit` 아키텍처 규칙 검증 실행 (Cycle Check).

### Step 1.5: 결과 보고
- [ ] **Task:** `docs/done/phase1_approval_report.md` 작성 및 등록.

---

## 3. Phase 2: Tenant 관리 기능 강화 (Priority 1)
**목표:** 슈퍼 어드민의 테넌트 제어력 확보(Impersonation) 및 테넌트 생성 시 자동화된 환경 구성(Provisioning).

### Step 2.1: 상세 설계
- [ ] **Task:** Impersonation 토큰 발급 흐름 및 보안 정책(Audit Log 포함, 기존 토큰 만료 처리 등) 설계.
- [ ] **Task:** Tenant 생성 시 초기 데이터(Admin 계정, 권한, 기본 부서) 템플릿 설계.

### Step 2.2: Impersonation 구현
- [ ] **Task:** `TokenProvider`: `is_impersonated` 클레임 추가 및 JWT 생성/검증 로직 구현.
- [ ] **Task:** `TenantService`: 슈퍼 어드민용 테넌트 접속 토큰 발급 API 구현.
- [ ] **Task:** `SecurityConfig`: Impersonation 토큰 사용 시 권한 제어 필터 확인.

### Step 2.3: Provisioning 로직 구현
- [ ] **Task:** `TenantCreatedEvent` 정의 및 로직 바인딩 (Event Publisher/Listener 패턴).
- [ ] **Task:** `TenantProvisioningService`: 초기 Admin Member 생성, 기본 Role(ADMIN, USER) 및 Root Dept 생성.

### Step 2.4: 검증 (Verification)
- [ ] **Task:** 테넌트 생성 직후 Admin 로그인 및 기본 데이터 존재 여부 확인 테스트.
- [ ] **Task:** 슈퍼 어드민의 타 테넌트 API 호출 테스트 (Impersonation).
- [ ] **Task:** `ArchUnit` 검증.

### Step 2.5: 결과 보고
- [ ] **Task:** `docs/done/phase2_tenant_report.md` 작성 및 등록.

---

## 4. Phase 3: Dashboard 모듈 신설 (Priority 2)
**목표:** 누락된 대시보드 모듈 구현 및 데이터 시각화 API 제공.

### Step 3.1: 모듈 구조 설계
- [ ] **Task:** `backend/modules/dashboard` 패키지 구조 생성.
- [ ] **Task:** 타 모듈(Leave, Employee 등) 데이터 집계 전략 수립 (ModuleAPI 활용).

### Step 3.2: 구현
- [ ] **Task:** 위젯(Widget) 메타데이터 엔티티 및 Repository 구현.
- [ ] **Task:** `DashboardService`: 각 도메인 모듈(API)로부터 통계 데이터 수집 로직 구현 (결재 대기 건수, 휴가 사용자 수 등).
- [ ] **Task:** 메인 대시보드 조회 API 구현 (Envelope 포맷 준수).

### Step 3.3: 검증 (Verification)
- [ ] **Task:** 통계 데이터 정확성 검증 (Mock 데이터 활용).
- [ ] **Task:** 모듈 간 참조 위반 여부 `ArchUnit`으로 점검.

### Step 3.4: 결과 보고
- [ ] **Task:** `docs/done/phase3_dashboard_report.md` 작성 및 등록.

---

## 5. Phase 4: 아키텍처 및 보안 최종 점검 (Priority 3)
**목표:** 전체 시스템의 무결성 및 격리 수준 검증.

### Step 4.1: 심층 아키텍처 검증
- [ ] **Task:** 전체 모듈 대상 `ArchUnit` CI 레벨 점검 (Layered Architecture, Cycle, Module Isolation).
- [ ] **Task:** `company_id` 누락된 쿼리/엔티티 전수 조사 및 수정.

### Step 4.2: 보안 점검
- [ ] **Task:** `Security_Policy_Matrix.md` 대비 실제 어노테이션(`@PreAuthorize`) 적용 현황 크로스 체크.
- [ ] **Task:** 주요 민감 정보(개인정보) 마스킹 처리 여부 확인.

### Step 4.3: 최종 보고
- [ ] **Task:** `docs/done/phase4_architecture_report.md` 작성.
