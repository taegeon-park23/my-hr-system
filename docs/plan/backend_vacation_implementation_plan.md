# 휴가 관리 모듈 구현 계획 (Vacation Module Implementation Plan)

## 1. 개요 (Overview)
본 문서는 HR 시스템의 핵심 기능 중 하나인 **휴가(Vacation/Leave) 관리 모듈**의 구현 계획을 정의한다.
현재 `com.hr.modules.vacation` 패키지가 생성되어 있으나, `VacationBalance` 엔티티 외의 실질적인 비즈니스 로직과 API가 부재한 상태이다.
이에 휴가 신청, 잔여 연차 관리, 결재 연동 프로세스를 포함한 완전한 기능을 구현하고자 한다.

## 2. 현황 분석 (Analysis)
- **현재 상태:** 
  - `backend/modules/vacation` 패키지 존재.
  - `VacationBalance` 엔티티(기본 필드만 존재) 및 Repository 생성됨.
  - 휴가 신청(`VacationRequest`) 관련 데이터 모델 부재.
  - API 및 서비스 로직 부재.
- **요구 사항:**
  - 사용자는 자신의 휴가 잔여 일수를 조회할 수 있어야 한다.
  - 사용자는 휴가를 신청할 수 있어야 한다.
  - 휴가 신청 시 **결재 모듈(Approval)**과 연동되어 자동으로 결재 프로세스가 시작되어야 한다.
  - 결재 완료(승인) 시, 휴가 잔여 일수가 차감되어야 한다.

## 3. 데이터베이스 설계 (Database Design)

기존 `Database_Design_Specification.md`에 정의된 `vacation_balances` 외에 휴가 신청 내역을 저장할 `vacation_requests` 테이블을 신규 설계한다.

### 3.1 Vacation Balances (수정)
기존 설계 준수하되, `remaining_days` 계산 및 동시성 제어를 위한 업데이트 로직 필요.

```sql
-- 기존 테이블 (참고)
CREATE TABLE vacation_balances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    year INT NOT NULL,
    total_days FLOAT DEFAULT 0,
    used_days FLOAT DEFAULT 0,
    remaining_days FLOAT DEFAULT 0, -- (total - used) 동기화 필요
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_vac_balance (user_id, year),
    INDEX idx_vac_company (company_id)
) ENGINE=InnoDB;
```

### 3.2 Vacation Requests (신규)
휴가 신청 상세 정보를 저장한다.

```sql
CREATE TABLE vacation_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL COMMENT 'Tenant ID',
    
    user_id BIGINT NOT NULL COMMENT '신청자',
    vacation_type VARCHAR(20) NOT NULL COMMENT 'ANNUAL(연차), SICK(병가), HALF(반차) 등',
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    request_days FLOAT NOT NULL COMMENT '사용 일수 (반차인 경우 0.5)',
    
    reason VARCHAR(255) NULL,
    
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT 'PENDING, APPROVED, REJECTED, CANCELLED',
    approval_request_id BIGINT NULL COMMENT '연동된 결재 요청 ID',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_vac_req_company (company_id),
    INDEX idx_vac_req_user (user_id),
    INDEX idx_vac_req_dates (user_id, start_date)
) ENGINE=InnoDB COMMENT='휴가 신청 내역';
```

## 4. 구현 상세 (Implementation Details)

### 4.1 Domain Layer (`com.hr.modules.vacation.domain`)
- **[MODIFY]** `VacationBalance.java`: `increaseUsedDays(double days)` 등 도메인 메서드 추가. JPA `@Version` 고려(동시성).
- **[NEW]** `VacationRequest.java`: 신규 엔티티 구현.
- **[NEW]** `VacationType.java`: Enum (ANNUAL, HALF_AM, HALF_PM, SICK, UNPAID).

### 4.2 Repository Layer (`com.hr.modules.vacation.repository`)
- **[MODIFY]** `VacationBalanceRepository.java`: `findByUserIdAndYear` 등 쿼리 메서드 추가.
- **[NEW]** `VacationRequestRepository.java`.

### 4.3 Service Layer (`com.hr.modules.vacation.service`)
- **[NEW]** `VacationService.java`
  - `getBalance(userId, year)`: 잔여 연차 조회. 없을 경우 0일로 초기화된 객체 반환 or 에러.
  - `requestVacation(command)`:
    1. 잔여 연차 체크 (마이너스 허용 여부는 정책에 따름, 일단 불가로 설정).
    2. `VacationRequest` 저장 (Status=PENDING).
    3. **Approval Module** 호출 (`ApprovalModuleApi.createRequest(...)`) -> 결재 상신.
    4. `updateStatus(requestId, status)`: 결재 모듈로부터 콜백 혹은 이벤트 수신 시 상태 변경. (초기 단계에서는 단순화하여 서비스 내에서 처리하거나, 추후 이벤트 기반 연동).

### 4.4 API Layer (`com.hr.modules.vacation.controller`)
- **[NEW]** `VacationController.java`
  - `GET /api/vacations/balance`: 내 연차 현황 조회.
  - `GET /api/vacations/requests`: 내 휴가 신청 이력 조회.
  - `POST /api/vacations/request`: 휴가 신청.

## 5. 모듈 간 연동 (Integration Interaction)

- **휴가 -> 결재:**
  - 휴가 신청 시 결재 요청을 생성해야 한다.
  - `com.hr.modules.approval.api.ApprovalModuleApi` (인터페이스) 활용.
  - *Refactoring Point:* 현재 Approval 모듈에 외부에서 요청을 생성하는 API 인터페이스가 명확히 있는지 확인 필요. 없다면 `ApprovalService`를 `public`으로 열거나 `ApprovalInternalApi`를 만들어야 함.
  - **전략:** `com.hr.modules.approval` 패키지에 `dto.internal.ApprovalRequestCommand` 등을 정의하여 호출.

- **결재 -> 휴가 (승인 처리):**
  - 결재가 `APPROVED` 되면 휴가 모듈에 통지하여 `VacationRequest.status = APPROVED` 및 `VacationBalance` 차감을 수행해야 함.
  - **전략:** 결재 모듈에서 `EventPublisher`를 사용하거나, `ApprovalListener`를 통해 처리. (MVP 단계에서는 Service 간 직접 호출 허용하되, 인터페이스 경유).

## 6. 검증 계획 (Verification Plan)
- **단위 테스트:** `VacationBalance` 차감 로직, `VacationRequest` 생성 로직.
- **통합 테스트 (API):**
  - H2 DB 사용.
  - 로그인 된 유저로 휴가 신청 -> DB 저장 확인.
  - 잔여 연차 부족 시 에러 발생 확인.

## 7. 일정 및 우선순위
- **우선순위:** High (핵심 기능)
- **예상 공수:** 2일 (Backend 기준)
