# **표준 정의서: 데이터 검증 및 마스킹 규칙 (STD-02)**

## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 HR 시스템에 입력되는 데이터의 **유효성(Validation)** 기준과 출력 시 적용되는 **개인정보 마스킹(Masking)** 규칙을 정의한다.
프론트엔드와 백엔드는 본 문서에 정의된 정규식(Regex)과 길이 제한(Length Limit)을 동일하게 적용하여 데이터 무결성을 보장해야 한다.

### **1.2 적용 원칙**
1.  **Defense in Depth:** 프론트엔드에서 1차 검증을 수행하더라도, 백엔드에서 반드시 2차 검증을 수행해야 한다.
2.  **Fail Fast:** 유효하지 않은 데이터는 가능한 한 시스템 진입 초기 단계(Controller/DTO Level)에서 거부한다.
3.  **Privacy by Design:** 개인정보는 DB 조회 시점이 아닌, API 응답(Response DTO) 생성 시점에 마스킹 처리되어야 한다.

---

## **2. 공통 데이터 형식 검증 규칙 (Global Validation Rules)**

시스템 전반에서 공통으로 사용되는 데이터 타입에 대한 제약 조건이다.

| 데이터 유형 | 제약 조건 (Constraints) | 정규식 (Regex Pattern) | 비고 |
| :--- | :--- | :--- | :--- |
| **Email** | Max: 100자 | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` | RFC 5322 표준 준용 |
| **Password** | Min: 8자, Max: 20자<br>영문, 숫자, 특수문자 조합 | `^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$` | 보안 감사 기준 충족 필수 |
| **Phone (Mobile)** | `010-XXXX-XXXX` 형식 | `^010-\d{3,4}-\d{4}$` | 하이픈(-) 포함 저장 원칙 |
| **Date (YYYY-MM-DD)** | 유효한 날짜 | `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$` | ISO 8601 |
| **Business No.** | 사업자등록번호 (10자리) | `^\d{3}-\d{2}-\d{5}$` | 하이픈(-) 포함 |
| **Currency (KRW)** | 0 이상, 소수점 불가 | `^[0-9]+$` | 원 단위 절삭, 음수 불가 |

---

## **3. 모듈별 필드 상세 제약 조건 (Field-Level Constraints)**

각 모듈의 핵심 엔티티 입력 필드에 대한 상세 스펙이다.

### **3.1 사용자 및 조직 (User & Org)**

| 필드명 (Field) | 필수 | 길이 (Max) | 검증 규칙 및 에러 메시지 |
| :--- | :---: | :---: | :--- |
| `name` | Y | 50 | 한글/영문만 허용 (특수문자 불가). "이름 형식이 올바르지 않습니다." |
| `email` | Y | 100 | 중복 불가 (Unique Key). "이미 사용 중인 이메일입니다." |
| `employee_id` | N | 20 | 사번. 영문+숫자 조합. |
| `dept_name` | Y | 50 | 부서명. 특수문자 중 `&`, `-`, `.` 만 허용. |

### **3.2 결재 및 근태 (Approval & Attendance)**

| 필드명 (Field) | 필수 | 길이 (Max) | 검증 규칙 및 에러 메시지 |
| :--- | :---: | :---: | :--- |
| `title` | Y | 100 | 결재 제목. |
| `reason` | N | 500 | 결재/휴가 사유. HTML 태그 입력 불가 (XSS 방지). |
| `vacation_days` | Y | - | 0.5 단위 입력만 허용 (`0.5`, `1.0`, `1.5`...). "연차는 0.5일 단위로 사용 가능합니다." |
| `ip_address` | N | 45 | IPv4 또는 IPv6 형식. |

### **3.3 급여 및 자산 (Payroll & Asset)**

| 필드명 (Field) | 필수 | 길이 (Max) | 검증 규칙 및 에러 메시지 |
| :--- | :---: | :---: | :--- |
| `serial_number` | Y | 100 | 자산 시리얼. 회사 내 중복 불가. |
| `amount` | Y | - | 급여 금액. `Min: 0`, `Max: 99,999,999,999`. |
| `bank_account` | N | 50 | 계좌번호. 숫자와 하이픈(-)만 허용. |

---

## **4. 개인정보 마스킹 정책 (PII Masking Policy)**

API 응답 시 개인정보보호법에 의거하여 아래 규칙대로 마스킹을 수행해야 한다.
**권한(Role)**에 따라 마스킹 해제(Unmasking) 가능 여부가 달라진다.

### **4.1 마스킹 상세 규칙**

| 정보 유형 | 원본 데이터 예시 | 마스킹 처리 결과 | 규칙 설명 (Logic) |
| :--- | :--- | :--- | :--- |
| **이름 (Name)** | 홍길동 | `홍*동` | 가운데 글자 마스킹 (2자일 경우 `홍*`) |
| | 남궁민수 | `남궁*수` | 이름이 3자 초과 시 뒤에서 2번째 글자 마스킹 |
| **전화번호 (Phone)** | 010-1234-5678 | `010-****-5678` | 가운데 국번 4자리 `****` 처리 |
| **이메일 (Email)** | hong.gildong@corp.com | `hon*******@corp.com` | 앞 3자리 노출, `@` 앞까지 마스킹 |
| **주민번호 (RRN)** | 900101-1234567 | `900101-1******` | 생년월일 + 성별코드(1자리) 노출, 나머지 마스킹 |
| **급여 (Salary)** | 3,500,000 | `*,***,***` | **[Conditional]** 본인 외 조회 시 전체 마스킹 |
| **계좌번호** | 110-123-456789 | `110-***-456789` | 앞 3자리, 뒤 6자리 노출, 중간 마스킹 |

### **4.2 마스킹 적용 진리표 (Masking Logic Truth Table)**

누가(Requestor) 누구의(Target) 데이터를 조회하느냐에 따라 마스킹 여부가 결정된다.

| 요청자 (Requestor) | 대상 리소스 (Target) | 정보 유형 | **결과 (Result)** | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| **USER (본인)** | 본인 프로필 | 급여/계좌 | **Unmasked** (보임) | - |
| **USER (본인)** | 본인 프로필 | 주민번호 | **Masked** | 본인이라도 주민번호는 기본 마스킹 (수정 시 별도 인증) |
| **USER (타인)** | 타인 프로필 | 이름/전화번호 | **Unmasked** | 사내 협업을 위해 공개 |
| **USER (타인)** | 타인 프로필 | 급여/주민번호 | **Hidden** | 아예 필드값 미전송 (`null`) |
| **HR_ADMIN** | 직원 프로필 | 주민번호 | **Masked** | '보기' 버튼 클릭 시 로그 남기고 Unmasking |
| **SUPER_ADMIN** | - | 모든 정보 | **Masked** | 개발자/시스템 관리자는 민감정보 열람 불가 원칙 |

---

## **5. 구현 가이드 (Implementation Guide)**

### **5.1 Backend (Java/Spring)**

* **DTO 검증:** `jakarta.validation.constraints` 어노테이션 사용.
* **커스텀 Validator:** 복잡한 로직(예: 0.5 단위 체크)은 커스텀 어노테이션 생성.

```java
public class VacationRequestDto {
    @NotNull
    @FutureOrPresent(message = "과거 날짜로 신청할 수 없습니다.")
    private LocalDate startDate;

    @DecimalMin(value = "0.5")
    @VacationUnit // Custom Annotation: 0.5 단위 체크
    private Double days;
}

```

* **마스킹 유틸리티:** `MaskingUtils` 클래스 활용.

```java
public static String maskName(String name) {
    if (name == null || name.length() < 2) return name;
    // Logic implementation...
    return maskedName;
}

```

### **5.2 Frontend (TypeScript/Zod)**

* **스키마 정의:** `zod` 라이브러리를 사용하여 백엔드 규칙과 동기화.

```typescript
export const vacationSchema = z.object({
  days: z.number()
    .min(0.5, "최소 0.5일 이상이어야 합니다.")
    .refine((val) => val % 0.5 === 0, "0.5일 단위로 입력해주세요."),
  reason: z.string().max(500, "500자를 초과할 수 없습니다."),
});

```