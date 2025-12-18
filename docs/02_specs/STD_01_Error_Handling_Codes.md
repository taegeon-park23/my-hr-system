# **표준 정의서: 에러 처리 및 코드 표준 (STD-01)**

## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 HR 시스템 전반에서 발생하는 예외(Exception)와 에러(Error)를 체계적으로 관리하기 위한 표준을 정의한다.
개발자 간의 자의적인 에러 메시지 작성을 방지하고, **User-System-Admin** 3계층 관점에서 일관된 에러 응답을 보장하여 유지보수성을 극대화한다.

### **1.2 적용 범위**
* **Backend:** 모든 API Controller, Service, Repository의 예외 처리.
* **Frontend:** API 응답 인터셉터(Interceptor) 및 에러 바운더리(Error Boundary) 처리.

---

## **2. 에러 응답 구조 (Response Schema)**

모든 에러 응답은 HTTP Status Code 외에도 아래의 JSON 바디 구조를 **강제**한다.

```json
{
  "success": false,
  "error": {
    "code": "E-VAC-001",           // [필수] 시스템 식별용 고유 코드
    "message": "잔여 연차가 부족합니다.", // [필수] 사용자 노출용 메시지 (User-Facing)
    "details": {                   // [선택] 필드별 상세 에러 (Validation 등)
      "requestDays": "신청일수는 0보다 커야 합니다."
    },
    "debugMessage": "Balance: 1.5, Requested: 2.0", // [개발용] prod 환경에서는 노출 금지
    "traceId": "a1b2c3d4"          // [운영용] 로그 추적 ID
  }
}

```

---

## **3. 에러 메시지 3계층 정의 (3-Tier Error Messages)**

기획자와 개발자는 에러를 정의할 때 반드시 다음 3가지 관점을 모두 고려해야 한다.

| 계층 (Tier) | 대상 (Target) | 목적 (Purpose) | 예시 (Example) |
| --- | --- | --- | --- |
| **Tier 1: User-Facing** | 최종 사용자 | **행동 유도 및 안심.** 기술 용어를 배제하고 해결책을 제시. | "입력하신 비밀번호가 일치하지 않습니다. 다시 확인해 주세요." |
| **Tier 2: System Logic** | 백엔드/프론트 개발자 | **원인 파악 및 분기 처리.** 에러 발생의 기술적 조건을 명시. | `PasswordMismatchException`: `inputHash != dbHash` |
| **Tier 3: Admin Action** | 시스템 관리자/운영팀 | **사후 조치.** 에러 발생 시 운영자가 수행해야 할 액션. | "3회 이상 실패 시 계정 잠금 처리. 보안 로그 Audit 테이블에 기록." |

---

## **4. 도메인별 에러 코드 매핑 테이블 (Error Code Mapping)**

에러 코드는 `E-{MODULE}-{NUMBER}` 형식을 따른다.

### **4.1 공통 및 보안 (Common & Security)**

Prefix: `E-COM`, `E-SEC`

| 코드 | 메시지 (User) | 발생 원인 (System) | 프론트엔드 처리 가이드 |
| --- | --- | --- | --- |
| **E-COM-400** | 잘못된 요청입니다. | `MethodArgumentNotValidException` (필드 검증 실패) | 폼(Form) 하단에 `details` 필드 내용을 붉은색 텍스트로 노출. |
| **E-COM-500** | 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요. | `RuntimeException` (NPE, DB Connection Fail 등) | 전체 화면 블러 처리 후 '재시도' 버튼이 있는 모달 출력. |
| **E-SEC-401** | 로그인이 필요합니다. | `AuthenticationException` (토큰 만료/없음) | 현재 URL을 저장(`returnUrl`)하고 로그인 페이지로 리다이렉트. |
| **E-SEC-403** | 접근 권한이 없습니다. | `AccessDeniedException` (Role 부족, DataScope 위반) | "관리자에게 문의하세요" 안내 문구가 포함된 403 페이지 노출. |

### **4.2 결재 모듈 (Approval)**

Prefix: `E-APP`

| 코드 | 메시지 (User) | 발생 원인 (System) | 조치 및 비고 |
| --- | --- | --- | --- |
| **E-APP-001** | 이미 진행 중인 결재 건이 존재합니다. | `DuplicateRequestException`: 동일 `resourceId`로 `PENDING` 상태 존재. | 상세 페이지로 이동 링크 제공. |
| **E-APP-002** | 결재선을 생성할 수 없습니다. | `WorkflowException`: 상위 부서장 정보 누락 (`dept.managerId` is null). | **[Admin]** 조직도 데이터 정합성 확인 필요. |
| **E-APP-003** | 본인 차례가 아니거나 승인 권한이 없습니다. | `InvalidApproverException`: `currentStep.approverId != userId`. | 해킹 의심. 보안 로그 기록. |
| **E-APP-004** | 이미 처리된 결재입니다. | `OptimisticLockingFailure`: 동시성 이슈. 타인이 먼저 승인/반려함. | 데이터 새로고침(Refetch) 후 상태 업데이트. |

### **4.3 휴가 모듈 (Vacation)**

Prefix: `E-VAC`

| 코드 | 메시지 (User) | 발생 원인 (System) | 조치 및 비고 |
| --- | --- | --- | --- |
| **E-VAC-001** | 잔여 연차가 부족합니다. | `InsufficientBalance`: `remaining < requested`. | 현재 잔여 연차를 팝업에 함께 표시. |
| **E-VAC-002** | 이미 신청된 기간입니다. | `DateOverlapException`: 신청 기간이 기존 `APPROVED`/`PENDING` 건과 겹침. | 겹치는 날짜를 하이라이트하여 표시. |
| **E-VAC-003** | 휴가 시작일은 종료일보다 빨라야 합니다. | `InvalidPeriodException`: `startDate > endDate`. | 달력 UI에서 선택 불가능하도록 막음(Pre-check). |

### **4.4 급여 모듈 (Payroll)**

Prefix: `E-PAY`

| 코드 | 메시지 (User) | 발생 원인 (System) | 조치 및 비고 |
| --- | --- | --- | --- |
| **E-PAY-001** | 급여 계산 중 오류가 발생했습니다. | `CalculationException`: 필수 기초 데이터(기본급, 세율 등) 누락. | **[Admin]** 긴급 확인 필요. 계산 로직 롤백 고려. |
| **E-PAY-002** | 확정된 급여 대장은 수정할 수 없습니다. | `StateViolation`: 상태가 `CONFIRMED`/`PAID`인 급여 수정 시도. | UI에서 수정 버튼 비활성화. |

### **4.5 테넌트 및 조직 (Tenant & Org)**

Prefix: `E-TEN`, `E-ORG`

| 코드 | 메시지 (User) | 발생 원인 (System) | 조치 및 비고 |
| --- | --- | --- | --- |
| **E-TEN-001** | 유효하지 않은 회사 코드입니다. | `TenantNotFound`: URL이나 헤더의 `companyId`가 DB에 없음. | 404 페이지로 이동. |
| **E-ORG-001** | 순환 참조가 감지되었습니다. | `CircularReference`: A팀의 상위부서가 B팀인데, B팀 상위가 A팀인 경우. | **[Admin]** 조직도 트리 구조 재정렬 필요. |

---

## **5. 프론트엔드 에러 핸들링 가이드 (Frontend Guidelines)**

에러 코드의 접두사(Prefix)나 HTTP 상태에 따라 UI 동작을 표준화한다.

### **5.1 에러 처리 전략 (Strategy Pattern)**

```typescript
// frontend/src/shared/api/errorHandler.ts (Pseudo-code)

export function handleApiError(error: ApiError) {
  const { code, message } = error;

  // 1. 인증/인가 에러 (Global Redirect)
  if (code === 'E-SEC-401') {
    authStore.logout();
    router.push('/login');
    return;
  }

  // 2. 비즈니스 로직 에러 (Toast Alert)
  if (code.startsWith('E-VAC') || code.startsWith('E-APP')) {
    Toast.error(message); // "잔여 연차가 부족합니다."
    return;
  }

  // 3. 폼 검증 에러 (Field Mapping)
  if (code === 'E-COM-400' && error.details) {
    form.setErrors(error.details); // 각 Input 하단에 에러 메시지 매핑
    return;
  }

  // 4. 시스템 치명적 오류 (Failover Page)
  if (code === 'E-COM-500') {
    router.push('/500');
    // Sentry 등 로그 서버로 전송
    reportError(error);
  }
}

```

### **5.2 UX 원칙**

1. **침묵 금지:** 사용자의 액션에 대해 성공이든 실패든 반드시 피드백을 주어야 한다.
2. **전문 용어 노출 금지:** `NullPointerException`, `SQL Error` 등의 단어가 사용자 화면에 노출되어서는 안 된다.
3. **해결책 제시:** 단순히 "안 됩니다"가 아니라, "잔여 연차를 확인해 주세요"와 같이 다음 행동을 안내해야 한다.