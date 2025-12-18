# **심층 요구사항 명세서: 휴가 관리 로직 (SPEC-02)**

## **0. 문서 이력 (Version History)**

| 버전 | 일자 | 작성자 | 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-12-18 | System | 최초 작성 | 휴가 차감 규칙 및 유효성 검증 로직 정의 |


## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 HR 시스템의 **휴가 관리(Vacation Management)** 모듈의 핵심 비즈니스 로직을 정의한다.
휴가 일수 계산, 잔여 연차 차감 규칙, 그리고 휴가 신청 시의 유효성 검증 로직을 명확히 규정하여 데이터 무결성을 보장하는 것을 목적으로 한다.

### **1.2 범위**
* **휴가 유형(Type)별 차감 정책**: 연차, 반차, 병가 등의 차감 일수 정의.
* **유효성 검증(Validation)**: 신청 가능 여부를 판단하는 논리적 조건.
* **일수 계산(Calculation)**: 주말/공휴일 제외 로직(향후 고도화 예정) 및 기간 산정 방식.

---

## **2. 휴가 유형 및 차감 규칙 (Decision Table)**

시스템은 `VacationType` Enum에 정의된 유형에 따라 차감 일수와 급여 공제 여부를 결정한다.

### **2.1 휴가 차감 결정 테이블 (Vacation Deduction Decision Table)**

| 규칙 ID | 조건 1: 휴가 유형 (`VacationType`) | 조건 2: 잔여 연차 충분 여부 | **동작 1: 차감 일수 (`deductionDays`)** | **동작 2: 급여 처리** | 비고 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R1** | `ANNUAL` (연차) | Yes | **1.0일 / 1일** | 유급 (100%) | 일반적인 연차 소진 |
| **R2** | `HALF_AM` (오전반차) | Yes | **0.5일** | 유급 (100%) | 09:00 ~ 14:00 (점심 포함) |
| **R3** | `HALF_PM` (오후반차) | Yes | **0.5일** | 유급 (100%) | 14:00 ~ 18:00 |
| **R4** | `SICK` (병가) | - (무관) | **0.0일** | 유급/무급 (내규) | 연차 차감 없음. 관리자 승인 필수 |
| **R5** | `UNPAID` (무급휴가) | - (무관) | **0.0일** | **무급 (0%)** | 월 급여에서 일할 계산 공제 (`Payroll` 연동) |
| **R6** | `ANNUAL` / `HALF` | No | **Error (Exception)** | - | 잔여 연차 부족 시 신청 불가 |

* **참고:** 현재 MVP 구현(`VacationService`)에서는 주말/공휴일 로직이 제외되어 있으며, 단순 날짜 차이(`end - start + 1`)로 계산한다.

---

## **3. 휴가 신청 유효성 검증 (Validation Logic)**

휴가 신청(`requestVacation`) 시 발생할 수 있는 입력 케이스에 대한 검증 로직을 진리표로 정의한다.

### **3.1 신청 유효성 검증 진리표 (Validation Truth Table)**

| 케이스 ID | 조건 1: 시작일 <= 종료일 | 조건 2: 잔여 연차 >= 신청일수 | 조건 3: 기존 신청과 중복 없음 | **결과 (Result)** | **응답 메시지 / 조치** |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **TC-01** | **True** | **True** | **True** | **성공 (Pass)** | 결재 요청 생성 및 `VacationRequest` 저장 |
| **TC-02** | False | - | - | **실패 (Fail)** | "종료일은 시작일보다 빠를 수 없습니다." |
| **TC-03** | True | False | - | **실패 (Fail)** | "잔여 연차가 부족합니다." (Throw `IllegalArgumentException`) |
| **TC-04** | True | True | False | **실패 (Fail)** | "이미 해당 기간에 신청된 휴가가 존재합니다." (날짜 중복) |

* **구현 현황:** `VacationService` 코드상 **TC-02, TC-03**은 구현되어 있으나, **TC-04(날짜 중복)** 검증 로직은 현재 명시적으로 보이지 않음. 추후 `validateOverlap()` 메서드 추가 필요.

---

## **4. 핵심 로직 의사 코드 (Pseudo-code)**

복잡한 비즈니스 로직을 개발자가 명확히 이해하고 구현할 수 있도록 의사 코드로 기술한다.

### **4.1 휴가 일수 계산 (`calculateDays`)**

```java
FUNCTION CalculateDays(start, end, type)
    IF type IN (HALF_AM, HALF_PM) THEN
        RETURN 0.5
    END IF

    // MVP Logic: 단순 날짜 차이 + 1
    // TODO: 주말(Sat, Sun) 및 공휴일(Holidays) 제외 로직 추가 필요
    diff = DAYS_BETWEEN(start, end) + 1
    
    RETURN (double) diff
END FUNCTION

```

### **4.2 휴가 신청 및 결재 연동 흐름 (`requestVacation`)**

```java
FUNCTION RequestVacation(user, type, start, end, reason)
    // 1. 일수 계산
    days = CalculateDays(start, end, type)

    // 2. 잔여 연차 조회 및 검증 (Locking 권장)
    balance = repository.findByUserAndYear(user.id, start.year)
    
    IF balance.remaining < days THEN
        THROW Exception("Insufficient vacation balance.")
    END IF

    // 3. 중복 검사 (To-Be Implementation)
    // IF repository.existsByDateRange(user.id, start, end) THEN
    //     THROW Exception("Date overlap.")
    // END IF

    // 4. 요청 저장 (PENDING 상태)
    request = NEW VacationRequest(user, type, start, end, days, reason)
    savedRequest = repository.save(request)

    // 5. 결재 모듈 호출
    approvalCommand = NEW ApprovalRequestCommand(
        resourceType="VACATION", 
        resourceId=savedRequest.id, 
        title="[휴가] " + type + " " + start + "~" + end
    )
    approvalId = approvalApi.createApproval(approvalCommand)
    
    savedRequest.connectApproval(approvalId) // 결재 ID 매핑

    RETURN savedRequest
END FUNCTION

```

---

## **5. 엣지 케이스 및 예외 처리 (Edge Cases)**

| 상황 | 설명 | 처리 방침 |
| --- | --- | --- |
| **연도 이월 (Year Carryover)** | 연말(12/31)에 남은 연차가 내년으로 넘어가는가? | **MVP 제외**. 현재는 해당 연도(`year`)의 Balance만 조회하여 사용. 남은 연차는 소멸 또는 수당 지급(별도 배치). |
| **반차 연속 사용** | 금요일 오후 반차 + 월요일 오전 반차 | 별개의 요청 2건으로 처리하거나, UI에서 멀티 셀렉트 지원 필요. 백엔드는 각각 검증. |
| **동시성 이슈 (Concurrency)** | 잔여 연차 1일 남았을 때, 동시에 1일짜리 요청 2개 발생 | **Optimistic Locking** (`@Version`)을 `VacationBalance` 엔티티에 적용하여 충돌 시 1개만 성공시키고 나머지는 롤백. |
| **결재 중 취소** | 승인 대기 중에 사용자가 신청 취소 | `ApprovalService.cancel()` 호출 -> 휴가 요청 상태 `CANCELED` 변경 -> 차감 예정액 복구(가차감 로직이 있다면). |

## **6. 데이터 모델 참조**

* **VacationType (Enum):** `ANNUAL(1.0)`, `HALF_*(0.5)`, `SICK(0.0)`, `UNPAID(0.0)`
* **VacationBalance:** `total_days`, `used_days`, `remaining_days`
* **VacationRequest:** `start_date`, `end_date`, `request_days`, `approval_id`