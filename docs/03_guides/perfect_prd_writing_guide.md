# 개발자를 위한 완벽한 웹 기획서(PRD) 작성법: 논리적 정밀성과 기술적 완전성을 향한 심층 분석 보고서

## 1. 서론: 소프트웨어 엔지니어링에서의 기획서와 모호함의 비용

소프트웨어 개발 프로젝트의 성패를 가르는 가장 결정적인 요인은 코딩 기술이 아니라, 그 코드가 해결해야 할 문제에 대한 명확한 정의에 있습니다. 현업에서 발생하는 프로젝트 지연, 버그, 그리고 기술 부채(Technical Debt)의 상당 부분은 "기획서가 부실하다"거나 "개발자가 기획 의도를 잘못 이해했다"는 커뮤니케이션의 단절에서 기인합니다. 제품 요구사항 문서(PRD: Product Requirements Document)는 비즈니스의 추상적인 비전과 엔지니어링의 구체적인 구현 사이를 연결하는 교량 역할을 수행해야 합니다.

개발자는 문학적인 서술보다는 수학적인 명료함과 결정론적(Deterministic) 논리를 선호합니다. 본 보고서는 개발자가 코드를 작성하기 직전에 필요로 하는 정보의 수준, 즉 '완벽한 웹 기획서'를 작성하는 방법론을 심층적으로 탐구합니다. 단순히 화면을 설명하는 것을 넘어, 데이터의 흐름, 상태의 전이, 복잡한 비즈니스 규칙의 테이블화, 그리고 발생 가능한 모든 예외 상황을 구조적으로 통제하는 기법들을 제시합니다.

## 2. 완벽한 PRD의 해부학: 구조와 핵심 구성요소의 재정의

### 2.1. 문서의 생명주기 관리와 메타데이터
코드의 버전 관리(Git)가 개발의 기본이듯, 기획서 또한 변경 이력이 투명하게 관리되어야 합니다.
* **Bad:** "기능 수정"
* **Good:** "급여 계산 로직 변경: 식대 비과세 한도가 10만원에서 20만원으로 상향됨에 따라 `SalaryCalculationService` 로직 반영 (v1.2)"

### 2.2. 프로젝트 배경 및 기술적 목표 (Context & Technical Goals)
개발자가 기능의 배경(Context)을 이해하면 더 효율적인 아키텍처를 제안할 수 있습니다.
* **성공 지표(Metrics):** "조직도 조회는 전체 임직원 10,000명 기준 200ms 이내에 계층 구조가 렌더링되어야 한다." (이는 `WITH RECURSIVE` 쿼리나 캐싱 전략 수립의 근거가 됩니다.)

### 2.3. 용어 사전 (Glossary)
도메인 용어(Ubiquitous Language)의 통일은 필수적입니다.
* **User (사용자):** 시스템에 로그인 가능한 계정.
* **Employee (직원):** 인사 정보(부서, 직급 등)를 가진 주체. (User와 1:1 관계이나 분리될 수 있음)
* **Approver (결재자):** 특정 결재 단계(Step)에서 승인/반려 권한을 가진 사용자.

### 2.4. 가정과 제약 조건 (Assumptions & Constraints)
* **기술적 제약:** "모든 급여 계산은 원 단위 절삭(FLOOR)을 원칙으로 하며, 소수점 처리는 하지 않는다."
* **가정:** "사용자는 동일한 회계연도 내에서만 휴가를 신청한다고 가정한다. (연도 이월 로직은 2차 범위)"

## 3. 정보 구조의 설계: IA와 URL 스키마

### 3.1. URL 스키마(URL Schema)의 설계
RESTful 원칙을 고려하여 리소스 중심으로 설계합니다.
* **Bad:** `/getApproval`, `/vacation_request.do`
* **Good:**
    * `/approvals` (결재 목록)
    * `/approvals/{id}` (결재 상세)
    * `/vacation/requests` (휴가 신청 내역)

## 4. 흐름의 시각화: 사용자 흐름과 프로세스 흐름

### 4.2. 백엔드 프로세스 흐름 (휴가 신청 예시)
1.  클라이언트로부터 휴가 신청 요청 수신 (날짜, 유형, 사유)
2.  **잔여 연차 확인:** `VacationBalance` 조회. (잔여일 < 신청일수면 에러 반환)
3.  **유효성 검증:** 시작일 <= 종료일 여부, 이미 신청된 날짜와 중복 여부 확인.
4.  **휴가 요청 생성:** `VacationRequest` 저장 (Status: PENDING).
5.  **결재 프로세스 트리거:** `ApprovalService`를 호출하여 결재 요청 생성.
6.  **이벤트 발행:** `ApprovalRequestedEvent` 발행.

## 5. 논리적 정밀성의 핵심: 결정 테이블과 진리표

복잡한 조건부 로직은 **결정 테이블(Decision Table)**을 통해 명세해야 합니다. 

### 5.2. 실전 예시: 휴가 차감 및 급여 공제 규칙 (HR System)
현재 프로젝트의 `VacationType` 및 `VacationService` 구현에 기반한 결정 테이블입니다.

**[표 1] 휴가 유형별 차감 및 급여 처리 규칙**

| 규칙 ID | 조건 1: 휴가 유형 (`VacationType`) | 조건 2: 잔여 연차 충분 | 동작 1: 차감 일수 | 동작 2: 급여 지급 여부 | 비고 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| R1 | `ANNUAL` (연차) | Yes | **1.0일** | 유급 (100%) | 일반적인 연차 사용 |
| R2 | `HALF_AM` / `HALF_PM` | Yes | **0.5일** | 유급 (100%) | 반차 사용 |
| R3 | `SICK` (병가) | - | **0.0일** | 유급/무급 (내규) | 연차 차감 없음 (관리자 승인 필수) |
| R4 | `UNPAID` (무급) | - | **0.0일** | **무급 (0%)** | 급여 계산 시 일할 계산 차감 |
| R5 | `ANNUAL` | No | **Error** | - | 잔여 연차 부족 예외 발생 |

이 표는 `VacationService.calculateDays()` 및 `requestVacation()` 메서드의 핵심 로직을 명확히 정의합니다.

### 5.3. 진리표(Truth Table)를 활용한 유효성 검증
휴가 신청 시 발생할 수 있는 복합적인 검증 로직입니다.

**[표 2] 휴가 신청 유효성 검증 진리표**

| 케이스 | 입력 1: 시작일 <= 종료일 | 입력 2: 잔여 연차 >= 신청일 | 입력 3: 중복 기간 신청 없음 | 결과 (Result) | 에러 메시지 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC1 | True | True | True | **성공 (Pass)** | - |
| TC2 | False | - | - | **실패 (Fail)** | "종료일은 시작일보다 빠를 수 없습니다." |
| TC3 | True | False | - | **실패 (Fail)** | "잔여 연차가 부족합니다." |
| TC4 | True | True | False | **실패 (Fail)** | "이미 해당 기간에 신청된 휴가가 있습니다." |

## 6. 상태 관리의 정복: 상태 전이 다이어그램

결재 시스템(`ApprovalRequest`)은 상태 관리가 매우 중요합니다.

### 6.1. 결재 상태 전이 매트릭스 (State Transition Matrix)

| 현재 상태 \ 이벤트 | 결재 요청 (Create) | 승인 (Approve) | 반려 (Reject) | 회수 (Cancel) | 비고 |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **PENDING** | - | **APPROVED** (1단계 완료 시) | **REJECTED** | **CANCELED** | 현재 MVP는 1단계 승인 시 즉시 완료 처리 |
| **APPROVED** | - | - | - | - | 최종 승인 상태 (불변) |
| **REJECTED** | - | - | - | - | 반려 상태 (재신청 필요) |
| **CANCELED** | - | - | - | - | 요청자 본인 취소 |

*참고: 현재 `ApprovalService` 구현상 단계별 결재(Step)가 모두 완료되어야 최종 `APPROVED`가 되지만, MVP에서는 1단계 승인 시 바로 `APPROVED`로 전이됨을 명시합니다.*

## 7. 완전성을 위한 최후의 보루: 예외 처리와 엣지 케이스

### 7.1. 엣지 케이스 체크리스트
* **동시성 이슈:** 두 명의 관리자가 동시에 같은 건을 승인/반려하려 할 때? -> 먼저 처리된 트랜잭션 우선, 후순위 요청은 "이미 처리된 건입니다" 메시지 반환.
* **급여 계산 엣지 케이스:**
    * 입사일/퇴사일이 포함된 달의 일할 계산 로직.
    * 비과세 한도(식대 20만원)를 초과하는 경우의 과세 전환 로직.

## 8. 개발자 친화적인 명세 작성법: 의사 코드(Pseudo-code) 활용

복잡한 급여 계산 로직은 자연어보다 의사 코드가 명확합니다. 아래는 `SalaryCalculationService`의 실제 구현을 의사 코드로 표현한 예시입니다.

```java
// 급여 및 공제 계산 로직 명세
FUNCTION CalculateSalary(Payslip payslip)
    CONST MEAL_ALLOWANCE_LIMIT = 200,000 // 식대 비과세 한도
    
    baseSalary = payslip.baseSalary
    
    // 1. 수당 계산 (식대)
    totalAllowance = MEAL_ALLOWANCE_LIMIT
    grossIncome = baseSalary + totalAllowance // 총 급여 (세전)

    // 2. 4대 보험 및 세금 계산 (TaxCalculator 위임)
    nationalPension = CalcNationalPension(grossIncome)     // 국민연금
    healthInsurance = CalcHealthInsurance(grossIncome)     // 건강보험
    longTermCare = CalcLongTermCare(healthInsurance)       // 장기요양 (건보료 기반)
    employmentInsurance = CalcEmploymentInsurance(grossIncome) // 고용보험
    
    incomeTax = CalcIncomeTax(grossIncome)                 // 소득세 (간이세액표)
    localIncomeTax = FLOOR(incomeTax * 0.1)                // 지방소득세 (소득세의 10%, 원단위 절삭)

    // 3. 공제 총액 및 실수령액 도출
    totalDeduction = SUM(nationalPension, healthInsurance, ..., localIncomeTax)
    netAmount = grossIncome - totalDeduction

    RETURN { totalAllowance, totalDeduction, netAmount }
END FUNCTION