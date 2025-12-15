# 백엔드 아키텍처 및 품질 리팩토링 계획 (Backend Refactoring Plan)

## 1. 개요 (Overview)
본 문서는 `backend/modules` 내의 물리적으로 분리된 모듈들의 아키텍처 준수 여부를 점검하고, 발견된 위반 사항(DTO 위반, 일관성 부족, 보안 취약점 등)을 개선하기 위한 수행 계획입니다.

**목표:**
1. **DTO 표준 준수:** 모든 Controller는 Entity가 아닌 DTO를 반환해야 합니다.
2. **코드 일관성 확보:** `asset`, `evaluation` 등 신규 모듈의 스타일을 기존 표준(`common`의 `ApiResponse`, `UserPrincipal`)에 맞춥니다.
3. **보안 강화:** API에서 `userId`를 파라미터로 직접 받는 대신, 인증된 사용자 정보(`@AuthenticationPrincipal`)를 사용합니다.

---

## 2. 분석된 문제점 (Analysis Results)

| 모듈 (Module) | 파일 (File) | 문제점 (Issue) | 중요도 |
|---|---|---|---|
| **Vacation** | `VacationController` | API 응답으로 `VacationBalance`, `VacationRequest` **Entity**를 직접 반환함. | High |
| **Asset** | `AssetController` | `ApiResponse` 대신 `ResponseEntity` 사용. API 응답으로 `Asset` **Entity** 반환. 보안 취약점(URL 파라미터로 `userId` 수신). | High |
| **Evaluation** | `EvaluationController` | API 응답으로 `Evaluation`, `EvaluationRecord` **Entity** 반환. 보안 취약점(`userId` 인자 수신). | High |
| **Evaluation** | `EvaluationAdminController` | API 응답으로 `EvaluationCycle` **Entity** 반환. Controller 내에서 Entity 빌더 패턴 사용(비즈니스 로직 누수). | Medium |
| **Attendance** | `AttendanceController` | API 응답으로 `AttendanceLog` **Entity** 직접 반환 (Code not found but required). | High |

---

## 3. 상세 수정 계획 (Detailed Plan)

### 3.1 DTO 생성 및 매핑 로직 추가
각 모듈에 필요한 Response DTO를 생성하고, Entity를 DTO로 변환하는 정적 메서드(`from`)를 구현합니다.

#### [Module: Vacation]
- **[NEW]** `com.hr.modules.vacation.dto.VacationBalanceResponse`
- **[NEW]** `com.hr.modules.vacation.dto.VacationRequestResponse`
- **[MODIFY]** `VacationController`: 반환 타입을 DTO로 변경 및 매핑 적용.

#### [Module: Asset]
- **[NEW]** `com.hr.modules.asset.dto.AssetResponse`
- **[MODIFY]** `AssetController`: 
    - `ResponseEntity` -> `ApiResponse` 포맷 변경.
    - `@RequestParam Long userId` -> `@AuthenticationPrincipal UserPrincipal user` 로 변경.
    - `Asset` Entity -> `AssetResponse` DTO 변환.

#### [Module: Evaluation]
- **[NEW]** `com.hr.modules.evaluation.dto.EvaluationResponse`
- **[NEW]** `com.hr.modules.evaluation.dto.EvaluationRecordResponse`
- **[NEW]** `com.hr.modules.evaluation.dto.EvaluationCycleResponse`
- **[MODIFY]** `EvaluationController`: `userId` 파라미터 제거 및 Principal 사용, DTO 반환.
- **[MODIFY]** `EvaluationAdminController`: DTO 반환, Entity 생성 로직 제거(Service 위임 권장 또는 DTO 변환).

#### [Module: Attendance]
- **[NEW]** `com.hr.modules.attendance.dto.AttendanceLogResponse`
- **[MODIFY]** `AttendanceController`: 
    - `getMyLog` API 추가/수정 (Entity 반환 -> DTO 반환).
    - `ResponseEntity` 사용 지양, `ApiResponse` 표준 사용.

### 3.2 의존성 및 설정 점검
- `vacation/build.gradle` 등의 불필요한 의존성 여부 재확인 (이번 단계에서는 코드 수정에 집중).

---

## 4. 검증 전략 (Verification Strategy)
1. **Build Test**: `./gradlew clean build -x test` 로 컴파일 오류 없음 확인.
2. **Architecture Check**: 
    - Service/Controller 코드 내 `import *.domain.*` (Entity)가 DTO 변환 용도 외에 API 반환으로 쓰이는지 육안 재검표.
    - `UserPrincipal` 적용 여부 확인.
3. **Manual Verification**:
    - 리팩토링된 모듈의 주요 API를 호출하여 정상 응답(JSON 구조 확인) 검증.

---

## 5. 일정 (Schedule)
- **승인 즉시:** DTO 구현 및 Controller 리팩토링 진행.
- **완료 후:** 결과 보고서 작성.
