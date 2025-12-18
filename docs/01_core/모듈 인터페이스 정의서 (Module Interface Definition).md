# **모듈 인터페이스 정의서 (Module Interface Definition)**

## **1. 개요 (Overview)**

본 문서는 HR 시스템의 **Modular Monolith** 아키텍처 내에서 각 모듈(Bounded Context) 간의 통신 규약을 정의한다.

1. **동기 통신 (Synchronous):** 각 모듈이 노출하는 `ModuleApi` 인터페이스를 통해 직접 호출한다. 타 모듈의 내부 Entity나 Repository에 직접 접근하는 것을 금지한다.
2. **비동기 통신 (Asynchronous):** Spring Application Event를 통해 상태 변경을 전파하고, 모듈 간 결합도를 낮춘다.
3. **데이터 무결성:** 모든 데이터 교환은 정의된 DTO를 통해서만 이루어지며, 기술적 정밀성을 위해 JSON 스키마 힌트를 포함한다.

---

## **2. 모듈별 공개 API 명세 (Synchronous Interface)**

개발자는 아래 정의된 인터페이스를 주입(DI)받아 모듈 간 기능을 수행해야 한다.

### **2.1 Policy Module (권한 및 정책)**

* **Interface:** `com.hr.modules.policy.api.PolicyModuleApi`

| 메서드명 | 설명 | 주요 파라미터 | 반환 타입 |
| --- | --- | --- | --- |
| `calculateDataScope` | 특정 사용자의 데이터 접근 범위를 계산한다. | `Long userId`, `String resourceType` | `DataScope` |
| `hasPermission` | 리소스에 대한 구체적인 권한 여부를 확인한다. | `Long userId`, `String permission` | `boolean` |

### **2.2 Org Module (조직 관리)**

* **Interface:** `com.hr.modules.org.api.OrgModuleApi`

| 메서드명 | 설명 | 주요 파라미터 | 반환 타입 |
| --- | --- | --- | --- |
| `getDepartmentInfo` | 부서 상세 정보를 조회한다. | `Long deptId` | `DepartmentDto` |
| `isSubordinate` | 사용자가 특정 부서의 하위 소속인지 확인한다. | `Long userId`, `Long deptId` | `boolean` |

### **2.3 Approval Module (결재 엔진)**

* **Interface:** `com.hr.modules.approval.api.ApprovalModuleApi`

| 메서드명 | 설명 | 주요 파라미터 | 반환 타입 |
| --- | --- | --- | --- |
| `requestApproval` | 신규 결재 요청을 생성하고 워크플로우를 시작한다. | `ApprovalRequestCommand` | `Long approvalId` |
| `cancelApproval` | 결재 진행 중인 건을 기안자가 취소한다. | `Long approvalId`, `Long requesterId` | `void` |

---

## **3. 도메인 이벤트 명세 (Asynchronous Events)**

상태 전이에 따른 부수 효과(Side Effect) 처리를 위해 사용된다.

| 이벤트명 | 발행 주체 | 구독 대상 (Action) | 데이터 포함 내용 |
| --- | --- | --- | --- |
| `ApprovalRequestedEvent` | Approval | Notification (알림 메일 발송) | 기안자 정보, 결재자 목록, 리소스 정보 |
| `ApprovalCompletedEvent` | Approval | Business Modules (상태 업데이트) | 최종 승인 여부, ResourceType, ResourceId |
| `EvaluationCycleOpenedEvent` | Evaluation | User (전직원 대상 알림 발송) | 평가 기간, 평가 유형, 대상자 범위 |

---

## **4. 데이터 교환 객체 (DTO) 및 JSON 스키마 힌트**

프론트엔드-백엔드 및 모듈 간 통신의 논리적 무결성을 보장하기 위한 상세 데이터 규격이다.

### **4.1 ApprovalRequestCommand (결재 요청 규격)**

결재를 요청하는 모든 도메인(휴가, 비용 등)에서 준수해야 할 규격이다.

```json
{
  "companyId": 1,
  "requesterId": 5001,
  "resourceType": "VACATION",
  "resourceId": 1024,
  "title": "[연차] 2024-12-24 홍길동",
  "approverIds": [5002, 4001], // 순차 결재자 ID 목록
  "metadata": {
    "vacationType": "ANNUAL",
    "days": 1.0
  }
}

```

### **4.2 DataScope (권한 범위 응답)**

`PolicyModuleApi` 호출 시 반환되는 객체로, SQL의 `WHERE` 절 조건 생성의 근거가 된다.

```json
{
  "type": "DEPT_TREE", // MY, DEPT, DEPT_TREE, COMPANY, ALL
  "targetIds": [10, 11, 12], // 접근 가능한 부서 또는 리소스 ID 목록
  "flags": {
    "can_read_sensitive": false, // 급여 등 민감 정보 열람 가능 여부
    "is_temporary": false
  }
}

```

---

## **5. 공통 에러 코드 및 예외 규격 (Error Handling Standards)**

모든 인터페이스 호출 실패 시 반환되는 에러는 아래 표준을 따른다. 기획서에서 정의한 **'에러 메시지 3단계'**를 적용한다.

### **5.1 에러 응답 구조**

```json
{
  "code": "E-VAC-001",
  "message": "잔여 연차가 부족합니다.", // User-Facing Message
  "debug": "Requested: 2.0, Balance: 1.5", // System Logic Detail
  "action": "REJECT_REQUEST" // Dev/System Action
}

```

### **5.2 표준 에러 코드 테이블**

| 분류 | 코드 | 메시지 (User-Facing) | 발생 조건 (System Logic) |
| --- | --- | --- | --- |
| **Common** | `E-COM-403` | 접근 권한이 없습니다. | DataScope 검증 결과 요청 리소스가 허용 범위를 벗어남. |
|  | `E-COM-404` | 대상을 찾을 수 없습니다. | 존재하지 않는 ID로 모듈 API 호출. |
| **Approval** | `E-APP-001` | 중복된 결재 요청입니다. | 동일 리소스에 대해 `PENDING` 상태의 결재가 이미 존재함. |
|  | `E-APP-002` | 결재선을 생성할 수 없습니다. | 상위 결재자(부서장) 정보가 조직도에 누락됨. |
| **Vacation** | `E-VAC-001` | 잔여 연차가 부족합니다. | `remaining_days` < `request_days` |
|  | `E-VAC-002` | 이미 신청된 날짜입니다. | 기존 승인/대기 중인 휴가 기간과 겹침 (Date Collision). |

---

## **6. 인터페이스 엣지 케이스 (Edge Cases)**

1. **네트워크 타임아웃:** 모듈 간 호출(특히 외부 API 연동 시) 3초 이내 응답이 없을 경우 `E-COM-504`를 반환하고, 알림 모듈은 1회 재시도(Retry) 로직을 수행한다.
2. **데이터 불일치:** `ApprovalCompletedEvent` 수신 후 도메인 모듈(휴가 등)에서 업데이트 실패 시, **보상 트랜잭션(Compensating Transaction)**을 통해 결재 상태를 `ERROR`로 변경하고 시스템 관리자에게 즉시 알림을 발송한다.
3. **대량 조회:** 조직도 전체 트리 조회와 같은 무거운 호출은 API 결과값에 `ETag`를 포함하여 클라이언트 캐싱을 유도한다.