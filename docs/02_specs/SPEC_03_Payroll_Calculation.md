# **심층 요구사항 명세서: 급여 정산 및 공제 로직 (SPEC-03)**

## **0. 문서 이력 (Version History)**

| 버전 | 일자 | 작성자 | 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-12-18 | System | 최초 작성 | 급여 계산 공식 및 절삭 규칙 정의 |


## **1. 개요 (Overview)**

### **1.1 목적**

본 문서는 HR 시스템의 **급여(Payroll) 모듈**에서 수행하는 급여 계산, 공제(4대보험 및 세금), 그리고 최종 지급액 산출 로직을 정의한다.
복잡한 세법과 보험 요율을 코드 레벨에서 오차 없이 구현하기 위해 계산 순서, 절삭(Rounding) 규칙, 그리고 엣지 케이스 처리 방침을 수학적으로 명세한다.

### **1.2 범위**

* **급여 구성:** 기본급(Base Salary) + 식대(Meal Allowance)로 구성된 포괄임금제 기준.
* **공제 항목:** 국민연금, 건강보험, 장기요양보험, 고용보험, 소득세, 지방소득세.
* **계산 시점:** 매월 지정된 귀속 월(Target Month)의 말일 기준 데이터로 계산.

---

## **2. 급여 및 공제 계산 규칙 (Calculation Rules)**

모든 계산은 `SimpleTaxCalculator` 구현체에 정의된 요율과 규칙을 따른다.

### **2.1 상수 및 요율 정의 (Constants & Rates)**

| 항목 | 요율/금액 | 비고 |
| --- | --- | --- |
| **식대 비과세 한도** | 200,000 KRW | `TaxCalculator` 상수 정의 |
| **국민연금 (Pension)** | 4.5% (`0.045`) | 근로자 부담분 기준 |
| **건강보험 (Health)** | 3.545% (`0.03545`) | 근로자 부담분 기준 |
| **장기요양 (LongTerm)** | 12.81% (`0.1281`) | **건강보험료의** 12.81% (2024년 기준) |
| **고용보험 (Employment)** | 0.9% (`0.009`) | 비과세 제외 금액 기준 |
| **지방소득세 (LocalTax)** | 10% (`0.1`) | **소득세의** 10% |

### **2.2 절삭 및 반올림 규칙 (Rounding Rules)**

금융 오차를 방지하기 위해 모든 계산 단계에서 다음 규칙을 엄격히 적용한다.

* **원 단위 절삭 (Floor to 10s):** 4대보험 및 세금의 최종 산출 금액은 **10원 미만 절사(버림)**한다.
* 예: `12,345.6` -> `12,340`
* Formula: `FLOOR(Amount / 10) * 10`



---

## **3. 핵심 로직 의사 코드 (Pseudo-code)**

개발자가 비즈니스 로직을 오해 없이 구현할 수 있도록 계산 흐름을 의사 코드로 기술한다.

### **3.1 급여 계산 상세 흐름 (`calculateSalary`)**

```java
FUNCTION CalculateMonthlySalary(Employee emp, YearMonth targetMonth)
    // 1. 기초 데이터 로드
    base_salary = emp.base_salary
    meal_allowance_limit = 200,000
    
    // 2. 지급 총액 (Gross Pay) 계산
    // 현재 정책: 기본급 내에 식대가 포함된 구조가 아니라, 별도 수당으로 가정
    total_allowance = base_salary + meal_allowance_limit
    
    // 3. 과세 대상 금액 (Taxable Income) 산출
    // 식대 비과세 한도 적용
    non_taxable_amount = MIN(meal_allowance_limit, 200,000)
    taxable_income = total_allowance - non_taxable_amount

    // 4. 4대보험 계산 (10원 단위 절사)
    pension = FLOOR(taxable_income * 0.045, -1)
    health = FLOOR(taxable_income * 0.03545, -1)
    long_term_care = FLOOR(health * 0.1281, -1) // 건보료 기준
    employment = FLOOR(taxable_income * 0.009, -1)

    // 5. 소득세 계산 (간이세액표 약식 적용)
    income_tax = CalculateIncomeTax(taxable_income)
    local_income_tax = FLOOR(income_tax * 0.1, -1)

    // 6. 공제 총액 및 차인지급액
    total_deduction = pension + health + long_term_care + employment 
                      + income_tax + local_income_tax
    
    net_pay = total_allowance - total_deduction

    // 7. 결과 반환 (Payslip Entity 생성용 DTO)
    RETURN {
        gross: total_allowance,
        taxable: taxable_income,
        deductions: { ... }, // 각 항목별 금액
        net: net_pay
    }
END FUNCTION

```

### **3.2 소득세 약식 계산 로직 (`SimpleTaxCalculator`)**

```java
FUNCTION CalculateIncomeTax(taxable_income)
    // MVP: 구간별 단순 세율 적용 (실제 국세청 간이세액표는 훨씬 복잡함)
    IF taxable_income < 1,000,000 THEN
        RETURN 0
    ELSE IF taxable_income < 3,000,000 THEN
        RETURN taxable_income * 0.01 // 1%
    ELSE IF taxable_income < 5,000,000 THEN
        RETURN taxable_income * 0.03 // 3%
    ELSE
        RETURN taxable_income * 0.05 // 5%
    END IF
END FUNCTION

```

---

## **4. 엣지 케이스 및 예외 처리 (Edge Cases)**

정상적인 월급 외에 발생할 수 있는 특수한 상황에 대한 처리 방침이다.

### **4.1 중도 입사/퇴사자 일할 계산 (Pro-rata Calculation)**

월 중간에 입사하거나 퇴사하는 경우, 근무일수에 비례하여 급여를 지급한다.

* **공식:** `(월 기본급 / 해당 월의 총 일수) * 재직 일수`
* **총 일수 기준:** 해당 월의 실제 일수 (28, 29, 30, 31일) 사용. (30일 고정 아님)
* **재직 일수:** 주말/공휴일 포함 (Calendar Days).

**[표 1] 일할 계산 시나리오**

| 상황 | 입력 예시 | 처리 로직 | 비고 |
| --- | --- | --- | --- |
| **중도 입사** | 4월 16일 입사 (총 30일) | `Base * (15 / 30)` | 16일~30일 = 15일 |
| **중도 퇴사** | 4월 15일 퇴사 | `Base * (15 / 30)` | 1일~15일 = 15일 |
| **2월 계산** | 2월 28일/29일 | 해당 월의 `LengthOfMonth()` 사용 | 윤년 자동 보정 |

### **4.2 마이너스 급여 (Negative Net Pay)**

공제액이 지급액보다 커서 실수령액이 마이너스가 되는 경우의 처리.

* **발생 원인:** 과도한 가지급금 공제, 무급 휴가로 인한 급여 삭감 등.
* **처리 방침:**
1. **System:** `Payslip.net_pay`는 0원으로 저장.
2. **Logic:** 실제 마이너스 금액(`-150,000`)은 `CarryOverAmount` (이월 미수금) 필드에 별도 저장하거나, 다음 달 급여에서 차감하도록 플래그 처리.
3. **UI:** 급여명세서에는 0원으로 표기하되, 비고란에 "미수금 발생: 150,000원" 표기.



---

## **5. 데이터 모델 매핑 (Data Model Mapping)**

계산 결과는 DB의 `PAYSLIPS` 및 `PAYSLIP_ITEMS` 테이블에 다음과 같이 매핑된다.

* **Payslip (Header):**
* `total_allowance`: 지급 총액
* `total_deduction`: 공제 총액
* `net_pay`: 실 수령액


* **PayslipItem (Details):**
* `ALLOWANCE` 타입: 기본급, 식대
* `DEDUCTION` 타입: 국민연금, 건강보험, 장기요양, 고용보험, 소득세, 지방소득세



## **6. 테스트 시나리오 (QA Guidelines)**

개발 완료 후 다음 케이스를 반드시 통과해야 한다.

1. **[정상]** 월 급여 300만원(식대포함) 직원의 공제액이 엑셀 계산 결과와 10원 단위까지 일치하는가?
2. **[절삭]** 계산 결과가 `123,456`원일 때 `123,450`원으로 저장되는가?
3. **[일할]** 2월(28일) 중 14일 근무 시 정확히 50%가 지급되는가?
4. **[과세]** 식대 20만원을 초과하는 금액(예: 식대 30만원 지급 시)이 과세 표준에 포함되는가?