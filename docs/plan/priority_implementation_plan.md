# 우선순위 구현 계획 및 로드맵 (Priority Implementation Plan)

## 1. 개요 (Overview)

본 문서는 현재 프로젝트의 진행 상황(Frontend Mock 완료, Backend 기초 단계)을 바탕으로, 실제 운영 가능한 시스템으로 전환하기 위해 필요한 **잔여 필수 과제**와 **우선순위**를 정의한다.

**현재 상태:**
*   **Frontend:** UI 및 FSD 아키텍처 구현 완료 (Mock API 의존)
*   **Backend:** 인프라(Docker) 구축 완료, 핵심 모듈(User, Approval) Controller 기초 구현, **Security 및 도메인 로직 미비**

---

## 2. 구현 로드맵 (Roadmap)

안정적인 시스템 구축을 위해 다음 4단계의 순차적 진행을 권장한다.

### **Phase 1: 보안 및 기반 공사 (Security & Foundation) [최우선]**
시스템의 가장 기본이 되는 인증/인가 체계를 확립한다. 가짜 토큰(Mock)을 걷어내고 실제 JWT 기반의 보안을 적용한다.
*   **목표:** 실제 로그인 수행, 토큰 발급/검증, 모듈 간 권한 제어(Policy) 작동.

### **Phase 2: 핵심 비즈니스 모듈 구현 (Core Domains)**
껍데기만 있는 `attendance`, `payroll`, `vacation` 모듈의 실제 비즈니스 로직을 구현한다.
*   **목표:** 출퇴근 기록 저장, 휴가 신청 로직, 급여 대장 생성 기능 API 완성.

### **Phase 3: 프론트엔드 통합 (Frontend Integration)**
Frontend의 Mock API를 실제 Backend 엔드포인트로 교체한다.
*   **목표:** 화면에서 버튼 클릭 시 실제 DB에 데이터가 저장되고 조회되어야 함.

### **Phase 4: 품질 검증 (Verification)**
멀티 테넌트 격리와 아키텍처 원칙 준수 여부를 최종 점검한다.
*   **목표:** Tenant A의 데이터가 Tenant B에서 보이지 않음(Data Isolation) 검증.

---

## 3. 상세 작업 목록 (Detailed Tasks)

### **Step 1. 보안 및 인증 고도화 (Security & Auth)**

가장 먼저 해결해야 할 기술 부채이자 병목 지점이다.

#### 1.1 JWT Security Configuration
*   **대상 파일:** `backend/modules/user/.../security/**`
*   **내용:**
    *   `JwtTokenProvider`: Access/Refresh Token 생성 및 검증 로직 구현.
    *   `JwtAuthenticationFilter`: 요청 헤더에서 토큰 추출 및 SecurityContext 설정.
    *   `SecurityConfig`: Spring Security Filter Chain 설정 (URL별 접근 제어).

#### 1.2 Policy 모듈 연동 (AOP)
*   **대상 파일:** `backend/modules/policy`, `backend/common/security`
*   **내용:**
    *   `@RequiresPermission` 어노테이션 정의.
    *   AOP Aspect 구현: 컨트롤러 진입 전 `PolicyService.hasPermission()` 체크.
    *   `PolicyService`: Role-based 권한 판단 로직 구현.

---

### **Step 2. 비즈니스 도메인 구현 (Business Domains)**

각 도메인은 **Controller -> Service -> Repository -> Entity** 순서로 구현하며, 반드시 테넌트 격리 원칙(`company_id`)을 준수해야 한다.

#### 2.1 근태 관리 (Attendance)
*   **주요 기능:**
    *   `POST /api/attendance/check-in`: 출근 기록 (IP 유효성 검증).
    *   `POST /api/attendance/check-out`: 퇴근 기록.
    *   `GET /api/attendance/monthly`: 월별 근태 현황 조회.
*   **데이터 모델:** `attendance_logs`, `work_policies`

#### 2.2 휴가 관리 (Vacation)
*   **주요 기능:**
    *   `POST /api/vacation/request`: 휴가 신청 (Approval 모듈과 이벤트 연동).
    *   `GET /api/vacation/balance`: 잔여 연차 조회.
*   **데이터 모델:** `vacation_balances`, `vacation_history`

#### 2.3 급여 관리 (Payroll)
*   **주요 기능:**
    *   `POST /api/payroll/calculate`: 급여 계산 (배치/관리자용).
    *   `GET /api/payroll/my-slip`: 내 급여 명세서 조회.
*   **데이터 모델:** `payrolls`, `payroll_details`

---

### **Step 3. 프론트엔드 연동 (Client Integration)**

#### 3.1 API Client 교체
*   **대상 경로:** `frontend/src/shared/lib/api/**`, `frontend/src/features/**/api`
*   **내용:**
    *   Mock Adapter 제거.
    *   `axios` 인스턴스에 `Authorization` 헤더 주입 로직 추가.
    *   모든 Feature의 `useQuery` / `useMutation` 엔드포인트를 실제 서버 주소(`http://localhost:8080`)로 변경.

#### 3.2 CORS 및 에러 핸들링
*   Backend 응답 포맷(Envelope)에 맞춰 Frontend의 응답 파싱 로직 수정.
*   401/403 에러 발생 시 자동 로그아웃 또는 리다이렉트 처리.

---

## 4. 실행 계획 (Action Plan)

가장 즉각적인 성과를 위해 다음 순서로 작업을 제안합니다.

1.  **[Week 1] Backend Security 완성:** 로그인이 되어야 다른 기능을 테스트할 수 있습니다.
2.  **[Week 1-2] Attendance 모듈 개발:** 사용자의 매일 발생하는 트랜잭션 데이터이므로 우선 순위가 높습니다.
3.  **[Week 2] Frontend Attendance 연동:** 개발된 Backend를 Frontend와 붙여서 E2E 테스트를 수행합니다.
