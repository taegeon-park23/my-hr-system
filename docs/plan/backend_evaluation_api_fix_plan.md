# Backend Evaluation API 응답 구조 표준화 계획

## 1. 개요 및 분석
### 현상
- 프론트엔드(`evaluationApi.ts`)는 `ApiResponse<T>` 형태의 응답(Envelope 패턴)을 기대하고 있음.
- 현재 백엔드 `EvaluationController` 및 `EvaluationAdminController`는 `List<T>` 또는 객체 `T`를 그대로 반환(`ResponseEntity<T>`)하고 있음.
- 이로 인해 프론트엔드의 `fetcher`가 `response.data.success` 프로퍼티를 찾지 못하거나 구조 불일치로 오류 발생.

### 목표
- `Evaluation` 모듈의 모든 컨트롤러 응답을 프로젝트 표준인 `ApiResponse<T>`로 래핑하여 프론트엔드와의 통신 규격을 통일함.

## 2. 작업 범위
### Backend
- **Module**: `evaluation`
- **Controller**:
    1.  `EvaluationController`: `/api/evaluations/**`
    2.  `EvaluationAdminController`: `/api/admin/evaluations/**`
- **Changes**:
    - Return Type을 `ResponseEntity<List<T>>` -> `ApiResponse<List<T>>` (또는 `ApiResponse<T>`)로 변경.
    - `ApiResponse.success(...)` 메서드를 사용하여 응답 생성.

## 3. 상세 설계 (API Spec)

### EvaluationController (`/api/evaluations`)
| Method | Endpoint | Existing Return | New Return |
| :--- | :--- | :--- | :--- |
| GET | `/my` | `List<Evaluation>` | `ApiResponse<List<Evaluation>>` |
| GET | `/todo` | `List<EvaluationRecord>` | `ApiResponse<List<EvaluationRecord>>` |
| POST | `/records/{id}/submit` | `EvaluationRecord` | `ApiResponse<EvaluationRecord>` |

### EvaluationAdminController (`/api/admin/evaluations`)
| Method | Endpoint | Existing Return | New Return |
| :--- | :--- | :--- | :--- |
| POST | `/cycles` | `EvaluationCycle` | `ApiResponse<EvaluationCycle>` |
| GET | `/cycles` | `List<EvaluationCycle>` | `ApiResponse<List<EvaluationCycle>>` |
| POST | `/cycles/{id}/start` | `EvaluationCycle` | `ApiResponse<EvaluationCycle>` |
| POST | `/cycles/{id}/close` | `EvaluationCycle` | `ApiResponse<EvaluationCycle>` |

## 4. 검증 계획
1.  **빌드 및 재시작**: `gradle :modules:evaluation:build` 및 Docker 컨테이너 재시작.
2.  **API 테스트**:
    - `GET http://localhost:8080/api/evaluations/my?userId=2` 호출 시 JSON 구조 확인.
    - `{ "success": true, "data": [...], "error": null }` 형태 확인.
3.  **프론트엔드 확인**:
    - 대시보드 내 "나의 평가", "할 일" 목록이 정상적으로 렌더링되는지 확인.
