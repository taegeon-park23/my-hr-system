# **시스템 운영 매뉴얼 (System Operation Runbook)**

## **1\. 개요 (Overview)**

본 문서는 HR 시스템의 안정적인 운영을 위한 표준 절차서이다. 시스템 장애 탐지부터 해결, 배포, 그리고 멀티 테넌트 관리에 필요한 구체적인 실행 가이드를 제공한다.

* **대상:** DevOps 엔지니어, 백엔드 개발자, 시스템 운영팀(Super Admin)  
* **목표:** 장애 복구 시간(MTTR) 단축 및 운영 실수 방지

## **2\. 모니터링 및 알람 (Monitoring & Alerting)**

### **2.1 모니터링 도구 구성**

| 영역 | 도구 | 주요 관제 항목 | 비고 |
| :---- | :---- | :---- | :---- |
| **Infrastructure** | AWS CloudWatch | CPU, Memory, Disk I/O, Network Traffic | 임계치 80% 초과 시 알람 |
| **Application** | Datadog (or Prometheus) | Heap Memory, GC Count, Thread Pool, Active DB Connection |  |
| **Log Management** | ELK Stack / CloudWatch Logs | ERROR 레벨 로그, Exception 스택 트레이스 |  |
| **Frontend** | Sentry | 클라이언트 JS 에러, API 타임아웃 빈도 |  |

### **2.2 알람 등급 및 대응 (Severity Levels)**

| 등급 | 상황 예시 | 대응 목표 시간 | 전파 대상 |
| :---- | :---- | :---- | :---- |
| **P1 (Critical)** | 서비스 전면 중단, 데이터 유실, 보안 사고 | **즉시 (10분 내)** | 전사 공지, 개발팀/경영진 호출 |
| **P2 (Major)** | 주요 기능(결재, 급여) 불가, 특정 테넌트 접속 불가 | **1시간 내** | 담당 개발팀, 운영팀 |
| **P3 (Minor)** | 간헐적 지연, 비핵심 기능 오류 (UI 깨짐 등) | **24시간 내** | 담당 개발자 (Jira 티켓 발행) |

## **3\. 장애 대응 가이드 (Troubleshooting)**

### **3.1 상황별 대응 시나리오**

#### **시나리오 A: 특정 API 응답 속도 저하 (Slow API)**

1. **APM 확인:** Datadog Trace를 통해 병목 구간(DB 쿼리 vs 외부 API 호출 vs 로직) 확인.  
2. **DB Lock 확인:**  
   \-- MySQL Lock 대기 확인  
   SELECT \* FROM performance\_schema.data\_locks;  
   SHOW FULL PROCESSLIST;

3. **조치:**  
   * DB 인덱스 누락 시: 긴급 배포 또는 쿼리 튜닝.  
   * Lock 유발 세션 강제 종료 (KILL {session\_id}).

#### **시나리오 B: 서버 OOM (Out Of Memory) 재시작 빈발**

1. **로그 분석:** java.lang.OutOfMemoryError: Java heap space 로그 확인.  
2. **덤프 분석:** 힙 덤프(Heap Dump)를 확보하여 메모리 누수 객체 확인.  
3. **조치:**  
   * 단기: ECS/K8s 메모리 리밋 증설 및 인스턴스 스케일 아웃.  
   * 장기: 메모리 누수 코드(대량 데이터 조회 로직 등) 수정 배포.

#### **시나리오 C: 특정 테넌트 데이터 접근 불가 (Isolation Issue)**

1. **증상:** A사 사용자가 로그인 불가 또는 403 Forbidden 발생.  
2. **확인:**  
   * companies 테이블에서 해당 테넌트 상태(status)가 ACTIVE인지 확인.  
   * TenantConfig 설정값 오류 여부 확인.  
3. **조치:** 관리자 페이지에서 테넌트 상태 정상화.

## **4\. 배포 및 롤백 절차 (Deployment)**

### **4.1 정기 배포 (Regular Release)**

* **일정:** 매주 목요일 오후 8시 (트래픽 저조 시간대).  
* **절차:**  
  1. develop 브랜치에서 QA 완료 후 main 브랜치로 PR 생성 및 병합.  
  2. GitHub Actions가 트리거되어 빌드 및 테스트 수행.  
  3. 컨테이너 이미지 생성 및 ECR 푸시 (release-v1.x.x).  
  4. ArgoCD가 변경 사항 감지 후 **롤링 업데이트(Rolling Update)** 수행.  
  5. 배포 직후 Health Check 및 핵심 기능(로그인, 대시보드) 스모크 테스트 수행.

### **4.2 핫픽스 배포 (Hotfix)**

* **상황:** P1, P2 등급의 긴급 버그 수정.  
* **절차:**  
  1. main 브랜치에서 hotfix/issue-description 브랜치 생성.  
  2. 수정 후 main 및 develop 브랜치에 동시 병합.  
  3. 즉시 배포 파이프라인 실행.

### **4.3 롤백 (Rollback)**

* **상황:** 배포 직후 치명적 오류 발생 시.  
* **명령:**  
  * **ArgoCD UI:** History and Rollback 메뉴에서 직전 성공 버전 클릭.  
  * **CLI:** argocd app rollback hr-system \--id {revision\_id}.

## **5\. 테넌트 관리 매뉴얼 (Tenant Management)**

멀티 테넌트 SaaS의 핵심인 고객사 온보딩 및 관리 절차입니다. 모든 작업은 **Super Admin 전용 어드민 페이지**에서 수행합니다.

### **5.1 신규 테넌트 온보딩 (Onboarding)**

새로운 회사가 계약을 맺고 시스템을 사용하기 시작할 때의 절차입니다.

1. **테넌트 생성:**  
   * 슈퍼 어드민 로그인 \-\> \[테넌트 관리\] \-\> \[신규 등록\] 클릭.  
   * **입력 정보:** 회사명, 도메인(예: samsung), 사업자번호, 서비스 플랜(Basic/Pro), 관리자 이메일.  
2. **자동 프로비저닝 (백엔드 로직 수행):**  
   * companies 테이블에 레코드 생성.  
   * 해당 회사의 **Root 부서(최상위 조직)** 자동 생성.  
   * **Tenant Admin(최고 관리자)** 계정 생성 및 초기 비밀번호 설정.  
   * TenantConfig에 기본 설정값(테마, 근무제 등) 주입.  
3. **안내 메일 발송:**  
   * Tenant Admin에게 "가입 환영 및 초기 설정 가이드" 이메일 자동 발송.

### **5.2 테넌트 서비스 중지/해지 (Offboarding)**

1. **서비스 일시 정지:**  
   * 요금 미납 등의 사유 발생 시.  
   * 어드민에서 상태를 SUSPENDED로 변경 \-\> 해당 테넌트 사용자 로그인 즉시 차단.  
2. **서비스 해지 (데이터 삭제):**  
   * 계약 종료 시 상태를 INACTIVE로 변경.  
   * **데이터 보존 정책:** 법적 의무 보관 기간(예: 3년) 경과 후, 배치 작업을 통해 해당 company\_id를 가진 모든 데이터(개인정보 포함) 영구 삭제 (Hard Delete).

### **5.3 테넌트별 기능 설정 (Feature Flag)**

특정 회사에만 기능을 켜거나 끌 때 사용합니다.

* 경로: \[테넌트 관리\] \-\> 해당 회사 선택 \-\> \[기능 설정\] 탭.  
* 항목:  
  * 복지 기능 사용: \[ON/OFF\]  
  * 익명 평가 허용: \[ON/OFF\]  
  * SSO 연동: \[설정 버튼\] (SAML/OIDC 정보 입력)

## **6\. 배치 작업 관리 (Batch Jobs)**

### **6.1 주요 배치 스케줄**

| 작업명 | 실행 주기 | 설명 | 실패 시 영향 |
| :---- | :---- | :---- | :---- |
| **근태 마감 (AttdClosing)** | 매일 03:00 | 전일 근태 미체크자 결근 처리 및 근무 시간 집계 | 근무 시간 오류 발생 |
| **연차 발생 (VacationGen)** | 매월 1일 01:00 | 입사일 기준/회계일 기준 연차 자동 부여 | 연차 부족 민원 발생 |
| **급여 계산 (PayrollCalc)** | 매월 20일 00:00 | (설정된 급여일에 따라 다름) 전체 임직원 급여 가계산 | 급여 지급 지연 (P1) |
| **데이터 정리 (DataPurge)** | 매주 일요일 04:00 | 보존 기간 만료된 로그 및 임시 데이터 삭제 | 디스크 용량 부족 위험 |

### **6.2 배치 실패 시 대응**

1. **알람 확인:** 배치 실패 시 Slack 채널 \#ops-alert로 알림 발송됨.  
2. **로그 분석:** 실패 원인(데이터 정합성 오류, DB 타임아웃 등) 파악.  
3. **수동 재실행 (Manual Trigger):**  
   * **Jenkins/Airflow:** 해당 Job의 Re-run 버튼 클릭.  
   * **Admin API:** POST /api/admin/batch/retry?jobName=PayrollCalc\&date=2024-12-20 호출.

## **7\. 백업 및 복구 (Backup & Recovery)**

### **7.1 데이터베이스 백업 정책**

* **자동 백업:** AWS RDS Automated Backup (매일 1회 스냅샷, 보존 기간 30일).  
* **트랜잭션 로그:** Binlog(Archive Log) 5분 단위 백업 (특정 시점 복구용).

### **7.2 복구 절차 (Point-In-Time Recovery)**

데이터 오삭제나 치명적 논리 오류 발생 시 수행합니다.

1. **운영 DB 중단:** 추가 데이터 오염 방지를 위해 유지보수 모드 전환.  
2. **시점 복원:** AWS 콘솔에서 "Restore to point in time" 실행 (사고 발생 5분 전 시점 지정).  
3. **새 인스턴스 생성:** 복원된 스냅샷으로 새로운 DB 인스턴스 생성.  
4. **연결 변경:** 애플리케이션의 DB 엔드포인트를 새 인스턴스로 변경 후 재배포.  
5. **검증 및 서비스 재개.**