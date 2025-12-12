# **프로젝트 문서화 로드맵 (Project Documentation Roadmap)**

## **1\. 개발 착수 전 필수 문서 (Development Phase)**

아키텍처가 확정된 후, 실제 코드를 작성하기 위해 개발자 간 약속을 정의하는 문서들입니다.

### **1.1 API 명세서 (API Specification)**

* **목적:** 프론트엔드와 백엔드 개발의 병렬 진행을 위한 인터페이스 약속.  
* 표준 포맷 (JSON Envelope):  
  모든 API 응답은 아래 포맷을 엄격히 준수한다.  
  {  
    "success": true, // 성공 여부  
    "data": { ... }, // 실제 데이터 payload (실패 시 null)  
    "error": {       // 성공 시 null  
      "code": "ERR\_AUTH\_003",  
      "message": "접근 권한이 없습니다."  
    }  
  }

* **핵심 내용:**  
  * 모듈별 엔드포인트 정의 (예: POST /api/approval/request)  
  * **중요:** viewMode 파라미터('MY', 'TEAM')에 따른 응답 필드 차이 정의.  
  * 공통 에러 코드 정의.  
* **추천 도구:** Swagger (OpenAPI 3.0) \- 코드 기반 자동화.

### **1.2 보안 정책 매트릭스 (Security Policy Matrix) ★ 중요**

* **상태:** **\[작성 완료\]** (Security\_Policy\_Matrix.md 참조)  
* **주요 내용:**  
  * **Multi-Tenant:** SUPER\_ADMIN vs TENANT\_ADMIN 권한 분리.  
  * **Isolation:** 테넌트 간 데이터 격리 규칙.  
  * **Dynamic Scope:** 환경 및 결재 상태에 따른 동적 권한.

### **1.3 모듈 인터페이스 정의서 (Module Interface Definition)**

* **상태:** **\[작성 완료\]** (Module\_Interface\_Definition.md 참조)  
* **주요 내용:**  
  * **Module API:** UserModuleApi, PolicyModuleApi 등 모듈 간 호출 규약.  
  * **Events:** ApprovalCompletedEvent 등 도메인 이벤트 목록.  
  * **DTO:** 모듈 간 데이터 교환 포맷.

## **2\. 품질 보증 및 테스트 문서 (QA Phase)**

### **2.1 테스트 시나리오 (Test Cases)**

* **단위 테스트 (Unit):**  
  * PayrollService: 세전/세후 급여 계산 로직 정확성 검증.  
  * PolicyEnforcementService: Role과 Env 조건에 따른 DataScope 반환 값 검증.  
* **통합 테스트 (Integration):**  
  * **\[시나리오 1\] 결재 프로세스:** 휴가 신청(User) \-\> 알림 발송 \-\> 승인(Manager) \-\> 연차 차감(Vacation) \-\> 결과 통보.  
  * **\[시나리오 2\] 동적 권한:** 일반 사원이 /admin/payroll 접근 시도 시 AuthGuard 차단 확인 \-\> 권한 신청 승인 후 접근 허용 확인.  
* **보안 테스트:** 권한 없는 유저가 URL로 강제 접근 시 차단되는지 검증 (AuthGuard 및 AOP 작동 확인).

## **3\. 협업 및 유지보수 문서 (Operation Phase)**

### **3.1 깃 전략 및 코드 컨벤션 (Git Strategy & Convention)**

* **Branch Strategy:** Git Flow  
  * main: 운영 배포용 (Tag: v1.0.0)  
  * develop: 개발 통합용 (CI 통과 필수)  
  * feature/hr-001: 기능 개발 (Jira 티켓 번호 기준)  
* **Commit Message:** Conventional Commits  
  * feat: 결재 모듈 초기 구현  
  * fix: 휴가 계산 로직 오류 수정  
  * docs: API 명세서 업데이트

### **3.2 에러 코드 정의서 (Error Code Dictionary)**

* 프론트엔드에서 사용자에게 어떤 메시지를 보여줄지 결정하는 기준.

| 코드 (Code) | 메시지 (Message) | 조치 방법 |
| :---- | :---- | :---- |
| ERR\_AUTH\_001 | 인증이 만료되었습니다. | 로그인 페이지로 리다이렉트 |
| ERR\_AUTH\_003 | 접근 권한이 없습니다. | 403 페이지 표시 또는 권한 신청 팝업 유도 |
| ERR\_VAC\_001 | 잔여 연차가 부족합니다. | 신청 차단 및 잔여일 안내 |
| ERR\_APR\_002 | 이미 결재 진행 중인 건입니다. | 중복 상신 방지 |

