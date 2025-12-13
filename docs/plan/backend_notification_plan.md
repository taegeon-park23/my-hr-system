# 알림 모듈 구현 계획 (Notification Module Implementation Plan)

## 1. 개요 (Overview)
*   **목표:** 시스템 내 주요 이벤트(결재 요청, 승인/반려, 인사평가 시작 등) 발생 시 사용자에게 이메일 알림을 발송하는 **Notification Module**을 신규 구축한다.
*   **아키텍처:** 
    *   **Event-Driven:** 도메인 모듈(Sender)과 알림 모듈(Receiver) 간의 의존성을 제거하기 위해 Spring `ApplicationEvent` 기반의 비동기 통신을 적용한다.
    *   **Infrastructure:** `MailHog`(SMTP Test Server)와 연동하여 실제 메일 발송 흐름을 시뮬레이션한다.
*   **담당:** Google Antigravity Agent

## 2. 아키텍처 설계 (Architecture Design)

### 2.1 모듈 위치 및 구조
*   **Module Path:** `backend/modules/notification` (신규 생성)
*   **Common Path:** `backend/common/src/main/java/com/hr/common/event` (이벤트 인프라 신규 생성)
*   **Package Structure:**
    ```text
    com.hr.modules.notification/
    ├── config/          # MailSender Config
    ├── domain/          # NotificationLog Entity
    ├── service/         # MailSendService
    └── listener/        # EventListeners (e.g., ApprovalEventListener)
    ```

### 2.2 데이터베이스 설계 (Schema)
발송 이력을 추적하기 위한 로그 테이블을 설계한다.

```sql
-- 17. Notification Logs
CREATE TABLE notification_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('SENT', 'FAILED') NOT NULL,
    error_message TEXT NULL,
    
    event_type VARCHAR(100) NOT NULL COMMENT '이벤트 유형 (APPROVAL_REQ, EVAL_START...)',
    related_resource_id BIGINT NULL,
    
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_noti_company (company_id),
    INDEX idx_noti_recipient (recipient_email)
) ENGINE=InnoDB COMMENT='알림 발송 이력';
```

### 2.3 이벤트 설계 (Event Design)
모듈 간 결합도를 낮추기 위해 `common` 모듈에 공통 이벤트 인터페이스 또는 Base 클래스를 정의한다.

*   `com.hr.common.event.DomainEvent` (Interface or Abstract Class)
*   **주요 이벤트 정의 (예시):**
    *   `ApprovalRequestedEvent` (결재 요청 시)
    *   `ApprovalDecidedEvent` (승인/반려 시)

## 3. 구현 단계 (Implementation Steps)

### Step 1: 공통 이벤트 인프라 구축 (Common Infrastructure)
1.  `backend/common` 모듈에 `event` 패키지 생성.
2.  `DomainEvent` 추상 클래스 정의 (occurredOn, publisher 등 메타데이터 포함).

### Step 2: Notification 모듈 뼈대 생성 (Scaffolding)
1.  디렉토리 생성: `backend/modules/notification`.
2.  `build.gradle` 작성:
    *   `implementation 'org.springframework.boot:spring-boot-starter-mail'`
    *   `implementation project(':common')`
3.  `settings.gradle` 및 `backend/app/build.gradle`에 모듈 등록.

### Step 3: 메일 발송 기능 구현 (Core Feature)
1.  `application.yml` (또는 `application-dev.yml`)에 MailHog 설정 추가.
    *   host: `localhost` (Docker 내부 통신 시 `hr-mail` 주의)
    *   port: `1025`
2.  `MailService`: `JavaMailSender`를 이용한 실제 발송 로직 구현.
3.  `NotificationLogRepository`: 발송 이력 저장 로직 구현.

### Step 4: 이벤트 리스너 구현 (Event Integration)
1.  `NotificationEventListener`: `@EventListener`를 사용하여 도메인 이벤트 수신.
2.  수신 후 메일 제목/본문 생성 -> `MailService.send()` 호출 흐름 구현.

### Step 5: 도메인 모듈 연동 (Senders)
1.  예시로 `approval` 모듈 수정.
2.  결재 요청 생성 시 `ApplicationEventPublisher.publishEvent(new ApprovalRequestedEvent(...))` 호출 코드 추가.

### Step 6: 데이터베이스 스키마 반영 (DB Schema Update)
1.  `init.sql` 업데이트:
    *   `notification_logs` 테이블 `CREATE` 구문 추가.
2.  `docs/01_core/데이터베이스 설계 정의서 (Database Design Specification).md` 업데이트:
    *   신규 테이블(`notification_logs`) 명세 추가.

## 4. 검증 계획 (Verification Plan)

| ID | 검증 항목 | 검증 방법 | 예상 결과 |
|:---:|:---:|:---|:---|
| V1 | 모듈 빌드 | `./gradlew :modules:notification:build` | Build Success |
| V2 | 메일 발송 테스트 | 통합 테스트 코드 실행 (MockMvc or @SpringBootTest) | MailHog API(`http://localhost:8025/api/v2/messages`) 조회 시 메일 존재 |
| V3 | 이벤트 연동 | 실제 결재 요청 API 호출 | 비동기 이벤트 처리 후 메일 발송 및 로그 테이블(`notification_logs`) Insert 확인 |

## 5. 예상 위험 (Risks)
*   **SMTP 연결:** Docker 환경 내부(`hr-backend-dev`)에서 `hr-mail` 컨테이너 호스트명 인식 문제 가능성.
    *   -> Docker Compose 네트워크명(`hr-mail`) 사용으로 해결.
*   **비동기 예외:** 이벤트 리스너에서 예외 발생 시 트랜잭션 롤백 범위 고려 (기본적으로 동기 방식이며, `@Async` 적용 시 트랜잭션 분리됨).
    *   -> 초기 구현은 안정성을 위해 **동기(Synchronous)** 처리 후 추후 비동기 전환 검토. (메일 발송 실패가 비즈니스 로직을 실패시키지 않도록 `try-catch` 처리)
