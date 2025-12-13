# **커밋 및 PR 가이드라인 (Commit & PR Guidelines)**

## **1\. 개요**

본 문서는 HR 시스템 프로젝트의 코드 품질 유지와 효율적인 협업을 위한 Git 커밋 메시지 및 Pull Request(PR) 작성 규칙을 정의한다. 모든 기여자는 이 가이드를 준수해야 한다.

## **2\. 커밋 메시지 컨벤션 (Commit Message Convention)**

우리는 [Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따른다.

### **2.1 메시지 구조**

\<type\>(\<scope\>): \<subject\>  \<\!-- 필수: 제목 \--\>

\<body\>                      \<\!-- 선택: 본문 \--\>

\<footer\>                    \<\!-- 선택: 꼬리말 (Jira 티켓 번호 등) \--\>

### **2.2 Type (카테고리)**

커밋의 성격을 나타내는 키워드로, 반드시 소문자로 작성한다.

| Type | 설명 | 예시 |
| :---- | :---- | :---- |
| **feat** | 새로운 기능 추가 | feat: 결재 상신 API 구현 |
| **fix** | 버그 수정 | fix: 연차 계산 로직 오류 수정 |
| **docs** | 문서 수정 (README, Swagger 등) | docs: API 명세서 업데이트 |
| **style** | 코드 포맷팅, 세미콜론 누락 (로직 변경 없음) | style: 들여쓰기 수정 |
| **refactor** | 리팩토링 (기능 변경 없음) | refactor: 유저 서비스 메서드 분리 |
| **test** | 테스트 코드 추가/수정 | test: 급여 계산 단위 테스트 작성 |
| **chore** | 빌드 설정, 패키지 매니저 설정 등 | chore: 라이브러리 버전 업데이트 |
| **perf** | 성능 개선 | perf: 대시보드 쿼리 인덱스 최적화 |
| **ci** | CI 설정 파일 수정 | ci: GitHub Actions 스크립트 수정 |

### **2.3 Scope (적용 범위) \- *Optional***

변경된 모듈이나 기능을 명시한다. HR 시스템의 모듈명을 사용하는 것을 권장한다.

* (auth), (user), (approval), (payroll), (ui), (common) 등

### **2.4 Subject (제목)**

* **한글 작성을 원칙**으로 한다. (팀 합의에 따라 영어 사용 가능)  
* 문장 끝에 마침표(.)를 찍지 않는다.  
* 명령문 어조를 사용한다. ("수정함" X \-\> "수정" O)  
* **예시:**  
  * feat(approval): 결재 승인 시 알림 발송 기능 추가  
  * fix(payroll): 급여 마이너스 계산 오류 수정

### **2.5 Body (본문) \- *Optional***

* 제목으로 표현하지 못한 상세 내용을 적는다.  
* "무엇을", "왜" 변경했는지 설명한다.

### **2.6 Footer (꼬리말) \- *Optional***

* **이슈 트래커 ID:** 관련된 Jira/GitHub Issue 번호를 명시한다.  
* **Breaking Change:** 하위 호환성이 깨지는 변경 사항이 있을 경우 반드시 명시한다.  
* **예시:**  
  Closes \#123  
  Relates to HR-456

## **3\. Pull Request (PR) 가이드**

### **3.1 PR 제목 규칙**

커밋 메시지 규칙과 동일하게 작성한다. 하나의 PR에 여러 커밋이 포함될 경우, 이를 대표하는 제목을 적는다.

* feat(vacation): 휴가 신청 및 잔여 연차 차감 로직 구현

### **3.2 PR 템플릿 (Template)**

PR 생성 시 아래 양식을 복사하여 작성한다.

\#\# 📌 개요  
\<\!-- 변경 사항의 목적과 배경을 간단히 설명해주세요. \--\>  
휴가 신청 시 결재 모듈과 연동하여 승인 프로세스를 태우는 기능을 구현했습니다.

\#\# 🛠️ 작업 내용  
\<\!-- 구체적인 작업 내용을 나열해주세요. \--\>  
\- \[BE\] VacationService: 휴가 신청 시 ApprovalRequest 생성 로직 추가  
\- \[FE\] VacationForm: 결재선 지정 UI 추가  
\- \[DB\] vacation\_requests 테이블 컬럼 수정

\#\# 📸 스크린샷 (UI 변경 시)  
\<\!-- UI 변경 사항이 있다면 스크린샷이나 GIF를 첨부해주세요. \--\>

\#\# 🔗 관련 이슈  
\<\!-- Jira 티켓 번호나 GitHub Issue 번호를 링크해주세요. \--\>  
\- Closes \#50

\#\# ✅ 체크리스트  
\- \[x\] 빌드가 성공적으로 수행되었는가?  
\- \[x\] 모든 단위 테스트를 통과했는가?  
\- \[x\] 불필요한 로그나 주석은 제거했는가?

### **3.3 라벨링 (Labeling)**

PR의 상태나 성격을 나타내는 라벨을 부착한다.

* feature, bug, documentation, dependencies  
* review needed: 리뷰가 필요한 상태  
* work in progress: 작업 중 (Draft PR)

## **4\. 코드 리뷰 및 머지 전략 (Review & Merge)**

### **4.1 리뷰어 (Reviewer)**

* 최소 **1명 이상**의 승인(Approve)을 받아야 머지할 수 있다.  
* 핵심 로직(Policy, Payroll 등)은 관련 도메인 담당자의 승인이 필수다.

### **4.2 머지 전략 (Merge Strategy)**

* **Squash and Merge (권장):** PR의 여러 커밋을 하나로 합쳐서 main/develop 브랜치에 깔끔하게 병합한다. 히스토리 관리에 용이하다.  
* **Rebase and Merge:** 커밋 히스토리를 그대로 유지하되 일렬로 정렬한다.

### **4.3 브랜치 전략 (Git Flow)**

* main: 운영 배포용 (항상 배포 가능한 상태 유지)  
* develop: 개발 통합용 (Nightly Build)  
* feature/이슈번호-기능명: 개별 기능 개발 브랜치  
  * 예: feature/HR-101-login-page  
* hotfix/이슈번호: 운영 긴급 수정