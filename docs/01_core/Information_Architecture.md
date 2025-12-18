# **프로젝트 정보 구조 설계서 (Information Architecture)**

## **0. 문서 이력 (Version History)**

| 버전 | 일자 | 작성자 | 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2025-12-18 | Assistant | 최초 작성 | 전체 스펙 문서를 기반으로 IA 통합 정의 |

---

## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 HR SaaS 시스템의 **메뉴 구조(Sitemap)**, **네비게이션(Navigation)**, 그리고 **사용자 동선(User Flow)**을 정의한다.  
`SPEC_01` ~ `SPEC_11`에 정의된 모든 기능 모듈을 역할(Role) 기반으로 구조화하여, Frontend 개발 및 디자인의 기준점으로 삼는다.

### **1.2 사용자 역할 정의 (User Roles)**
시스템은 크게 세 가지 주요 페르소나를 가진다.
1.  **Global Admin (슈퍼 관리자)**: 플랫폼 전체 관리, 테넌트 생성/관리.
2.  **Tenant Admin (기업 관리자)**: 해당 기업(Company)의 조직, 인사, 결재, 휴가 등 운영 관리.
3.  **User (일반 직원)**: 본인의 근태/휴가/급여 조회 및 결재 상신.

---

## **2. 글로벌 네비게이션 구조 (GNB/LNB)**

시스템은 **좌측 사이드바(LNB)**를 메인 네비게이션으로 사용하며, 상단 바(Header)는 유틸리티 영역으로 활용한다.

### **2.1 상단 헤더 (Global Header)**
*   **공통 요소**:
    *   로고 (홈으로 이동)
    *   검색 바 (통합 검색)
    *   알림 아이콘 (Notifications)
    *   프로필 드롭다운 (내 정보, 비밀번호 변경, 로그아웃)
*   **슈퍼 관리자 전용**:
    *   **Impersonation Banner**: 특정 테넌트로 접속 중일 때, "현재 [Company A] 관리자로 접속 중입니다. [복귀하기]" 배너 노출.

### **2.2 좌측 사이드바 (Main Navigation)**
접속한 사용자의 **Role**에 따라 메뉴 노출이 동적으로 변경된다.

---

## **3. 상세 사이트 맵 (Sitemap by Role)**

### **3.1 일반 직원 (User) - "Self-Service Portal"**

| 1 Depth (대메뉴) | 2 Depth (소메뉴) | URL Path | 연결 Spec | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| **대시보드** | 요약 (Summary) | `/dashboard` | `SPEC_11` | 근태/휴가 요약, 공지사항 |
| **근태 관리** | 내 근태 현황 | `/attendance/my` | `SPEC_05` | 출퇴근 기록, 근무 시간 조회 |
|  | 근태 조정 신청 | `/attendance/request` | `SPEC_05` | 누락 수정 요청 |
| **휴가 관리** | 내 휴가 조회 | `/vacation/my` | `SPEC_02` | 잔여 연차, 사용 내역 |
|  | 휴가 신청 | `/vacation/request` | `SPEC_02` | 휴가 기안 작성 |
| **급여 조회** | 급여 명세서 | `/payroll/myslip` | `SPEC_03` | 월별 급여 명세 및 원천징수 |
| **인사 평가** | 자기 평가 | `/evaluation/self` | `SPEC_08` | 할당된 평가 진행 |
|  | 평가 결과 조회 | `/evaluation/my-result` | `SPEC_08` | (확정 후) 결과 열람 |
| **결재함** | 기안함 (보낸 결재) | `/approval/sent` | `SPEC_01` | 내가 올린 문서 상태 |
|  | 결재함 (받은 결재) | `/approval/inbox` | `SPEC_01` | 내가 승인해야 할 문서 |
| **지원/문의** | 자산 신청 | `/assets/request` | `SPEC_10` | 노트북 등 지급 신청 |

---

### **3.2 기업 관리자 (Tenant Admin) - "HR Management Console"**
*(일반 직원 메뉴 포함, 아래는 관리자 전용 메뉴)*

| 1 Depth (대메뉴) | 2 Depth (소메뉴) | URL Path | 연결 Spec | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| **관리자 대시보드**| HR 현황판 | `/admin/dashboard` | `SPEC_11` | 부서별 통계, 이상 근태 감지 |
| **조직 관리** | 조직도 관리 | `/admin/org/tree` | `SPEC_04` | 부서 생성/이동, 발령 |
|  | 구성원 관리 | `/admin/org/users` | `SPEC_04` | 직원 입/퇴사 처리, 정보 수정 |
| **결재 관리** | 결재선 설정 | `/admin/approval/lines` | `SPEC_01` | 전결 규정, 양식별 라인 설정 |
|  | 전체 문서 조회 | `/admin/approval/all` | `SPEC_01` | 회사 내 모든 결재 문서 모니터링 |
| **휴가/근태 설정**| 휴가 정책 설정 | `/admin/policy/vacation` | `SPEC_02, 06` | 발생 기준, 회계년도/입사일 기준 |
|  | 근무 유형 설정 | `/admin/policy/worktime` | `SPEC_05` | 시차출퇴근, 재택 등 유형 정의 |
| **급여 정산** | 급여 대장 | `/admin/payroll/ledger` | `SPEC_03` | 월별 급여 계산 및 확정 |
|  | 공제/수당 설정 | `/admin/payroll/config` | `SPEC_03` | 과세/비과세 항목 관리 |
| **평가 관리** | 평가 시즌 설정 | `/admin/evaluation/seasons`| `SPEC_08` | 평가표 배포, 시즌 시작/마감 |
| **채용 관리** | 공고 관리 | `/admin/recruitment/jobs` | `SPEC_09` | 채용 공고 등록 및 지원자 관리 |
| **설정 (Config)** | 권한/보안 설정 | `/admin/settings/security` | `SPEC_07` | IP 화이트리스트, 비밀번호 정책 |

---

### **3.3 슈퍼 관리자 (Global Admin) - "System Operations"**
*별도 레이아웃 또는 최상위 모드 사용*

| 1 Depth (대메뉴) | 2 Depth (소메뉴) | URL Path | 연결 Spec | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| **테넌트 관리** | 테넌트 목록 | `/super/tenants` | `SPEC_07` | 전체 고객사 리스트, 상태값 |
|  | 테넌트 생성 | `/super/tenants/new` | `SPEC_07` | 신규 고객사 프로비저닝 |
| **구독 관리** | 플랜/결제 | `/super/billing` | `SPEC_07` | 테넌트별 라이선스 관리 |
| **시스템 관리** | 감사 로그 (Audit) | `/super/audit-logs` | `SPEC_07` | 접속 로그, 스위칭 이력 조회 |
|  | 시스템 헬스 | `/super/system-health` | - | 서버 상태 모니터링 |

---

## **4. 주요 사용자 흐름 (Key User Flows)**

### **4.1 휴가 신청 및 승인 흐름**
1.  **[User]** 메인 대시보드 → 잔여 연차 확인 위젯 클릭
2.  `GET /vacation/my` → 남은 일수 확인
3.  "휴가 신청" 버튼 클릭 → `/vacation/request` 이동
4.  날짜 선택 및 사유 입력 → "상신"
5.  **[System]** 결재 모듈(`SPEC_01`)로 요청 전달 → 팀장에게 알림 발송
6.  **[Manager]** 알림 클릭 또는 `/approval/inbox` 접속
7.  문서 검토 후 "승인" 클릭
8.  **[System]** 최종 승인 시 휴가 차감(`SPEC_02`) 및 알림 발송

### **4.2 관리자 모드 진입 (Impersonation)**
1.  **[Global Admin]** `/super/tenants` 접속
2.  대상 회사(Company A) 검색
3.  "관리 콘솔 접속" (Switch Context) 아이콘 클릭
4.  **[System]** 프론트엔드 토큰 교체 → Company A의 `Tenant Admin` 권한 획득
5.  화면이 Company A의 대시보드(`/admin/dashboard`)로 리다이렉트 (상단 배너 노출)
6.  작업 완료 후 배너의 "복귀하기" 클릭 → 본래 슈퍼 어드민 세션 복구

---

## **5. 기술적 고려사항 (Routing Strategy)**

### **5.1 URL 구조 (Next.js App Router)**
*   **Public**: `/login`, `/register`, `/reset-password`
*   **App (User)**: `/dashboard`, `/attendance/*`, `/vacation/*` ...
*   **Admin (Tenant)**: `/admin/*` (GNB 메뉴가 관리자용으로 변경됨)
*   **Super (Global)**: `/super/*` (완전히 독립된 레이아웃 권장)

### **5.2 권한 가드 (Auth Guard)**
*   모든 페이지 진입 시 `middleware` 또는 `HOC`에서 Role 체크.
*   `/admin/*` 접근 시 -> `user.role`이 `TENANT_ADMIN` 이상인지 검증.
*   `/super/*` 접근 시 -> `user.role`이 `SUPER_ADMIN` 인지 검증.
