# StoryBoard: 슈퍼 어드민 (SB-03)

## 0. 개요
본 문서는 SaaS 플랫폼 운영자(Super Admin)가 전체 테넌트와 시스템 상태를 관리하는 **Global Admin Console**의 주요 화면을 정의한다.
이 영역은 일반 사용자나 기업 관리자에게는 절대 노출되지 않으며, 별도의 URL 경로(`/super`)를 가진다.

---

## **1. SCR-GLB-01: 테넌트 목록 (Tenant List)**

### **1.1 개요**
*   **목적**: 서비스에 가입된 모든 고객사(Tenant) 리스트를 조회하고 상태(활성/정지)를 관리한다.
*   **연결 Spec**: `SPEC_07`

### **1.2 레이아웃**
*   **Stats Bar**: 전체 테넌트 수 | 활성 테넌트 | 이번 달 신규 가입 | 매출 요약
*   **Card Grid View**: 테넌트 정보를 카드 형태로 나열.
    *   **Card Content**: 로고, 회사명, 도메인 주소(slug), 플랜(Basic/Pro), 상태 배지, 가입일.
    *   **Actions**: [관리 콘솔 접속(Switch)], [설정], [정지]

### **1.3 인터랙션**
*   **Impersonation (Switch Context)**:
    *   "관리 콘솔 접속" 버튼 클릭 → 경고 팝업 ("Tenant A의 관리자 권한으로 접속합니다. 모든 이력이 기록됩니다.")
    *   승인 시 → 프론트엔드 세션 교체 후 해당 기업의 대시보드(`/admin/dashboard`)로 이동.
    *   **Global Header**에 붉은색 배너 고정 ("현재 관리자 모드로 접속 중입니다").

---

## **2. SCR-GLB-02: 테넌트 생성 마법사 (Provisioning Wizard)**

### **2.1 개요**
*   **목적**: 신규 고객사를 시스템에 등록하고 초기 환경(DB, 관리자 계정)을 세팅한다.
*   **연결 Spec**: `SPEC_07`

### **2.2 레이아웃 (Step-by-Step)**
*   **Step 1: 기본 정보**: 회사명, 사업자 번호, 대표 도메인(Slug) 입력 (중복 체크 필수).
*   **Step 2: 플랜 선택**: 요금제(Free, Basic, Pro, Enterprise) 선택 카드.
*   **Step 3: 관리자 설정**: 초기 최고 관리자 이메일, 임시 비밀번호 설정.
*   **Step 4: 검토 및 생성**: 입력 정보 요약 확인 후 "생성" 실행.

### **2.3 인터랙션**
*   **생성 로딩**: 버튼 클릭 시 백엔드 프로비저닝 작업 수행 (수 초 소요).
*   **완료 화면**: "테넌트 생성이 완료되었습니다." 메시지와 함께 초기 접속 정보(URL, ID, PW) 표시.

---

## **3. SCR-GLB-03: 시스템 감사 로그 (Audit Logs)**

### **3.1 개요**
*   **목적**: 시스템 전반의 보안 이벤트, 특히 슈퍼 어드민의 접근 이력을 추적한다.
*   **연결 Spec**: `SPEC_07`, `Security Policy`

### **3.2 레이아웃**
*   **Filter Panel**:
    *   기간(DateRange), 행위자(Actor), 대상 회사(Target Tenant), 이벤트 유형(Login, Switch, Delete).
*   **Log Table**:
    *   Cols: 타임스탬프 | 행위자 ID | IP 주소 | 행위(Action) | 대상 리소스 | 결과(성공/실패) | 상세
*   **Detail Viewer**:
    *   특정 로그 클릭 시 JSON 형태의 Request/Response 스냅샷 표시 (사이드 패널).

### **3.3 주요 이벤트 유형**
*   **SYSTEM_LOGIN**: 슈퍼 어드민 로그인.
*   **TENANT_SWITCH**: 테넌트 컨텍스트 전환.
*   **TENANT_SUSPEND**: 테넌트 서비스 정지.
*   **DATA_EXPORT**: 대량 데이터 다운로드.
