# 데이터베이스 스키마 수정 계획 (Database Schema Correction Plan)

## 1. 개요 (Overview)
`ApprovalRequest` 엔티티와 실제 DB 테이블(`approval_requests`) 간의 컬럼 명칭 불일치로 인해 `Field 'requester_id' doesn't have a default value` 에러가 발생하고 있습니다.
이를 해결하기 위해 불필요한 레거시 컬럼(`requester_id`)을 삭제합니다.

## 2. 문제 분석 (Analysis)
- **증상:** 연차 신청(결재 요청) 시 SQL 에러 발생.
- **원인:**
  - 코드(`ApprovalRequest.java`): `requester_user_id` 컬럼 사용.
  - DB(`approval_requests` Table): `requester_id` (NOT NULL, Legacy)와 `requester_user_id` (New)가 공존.
  - Hibernate가 `requester_user_id`에만 값을 넣고 Insert를 시도하자, DB는 값이 없는 `requester_id`에 대해 에러를 반환함.
- **확인:** `DESCRIBE approval_requests` 결과 `requester_id`가 존재함을 확인.

## 3. 해결 방안 (Solution)

### 3.1 Swagger Configuration Fix (Swagger 401 Error)
Swagger UI 접속 불가(401) 원인은 `application.yml` 설정과 `SecurityConfig` 설정 불일치입니다.
- **현상:** `application.yml`에서 API Docs 경로를 `/api-docs`로 변경했으나, `SecurityConfig`는 `/v3/api-docs/**`만 허용함. 또한 Swagger UI 기본 호출 경로는 `/v3/api-docs`임.
- **조치:** `application.yml`의 `springdoc` 설정을 삭제하여 Spring Boot 기본값(`/v3/api-docs`)을 사용하도록 복구합니다.

### 3.2 Schema Correction (DDL)
`approval_requests` 테이블에서 `requester_id` 컬럼을 삭제합니다.
(추가적으로 `content` 컬럼도 존재하나 Nullable이므로 에러를 유발하지 않음. 이번 작업에서는 에러 원인인 `requester_id`만 처리)

```sql
ALTER TABLE approval_requests DROP COLUMN requester_id;
```

## 4. 검증 계획 (Verification)
1.  **Swagger:** `application.yml` 수정 후 `http://localhost:8080/swagger-ui/index.html` 접속 정상화 확인.
2.  **DB Alter:** 위 SQL 실행 후 `DESCRIBE`로 삭제 확인.
3.  **Function Test:** 프론트엔드에서 다시 연차 신청 시도 -> 정상 저장 확인.

## 5. Mocking Data 확인
사용자가 문의한 "임시 목킹 데이터 사용 여부"에 대해:
- Backend는 실제 DB와 통신하고 있으며, 발생하는 에러도 실제 DB 제약 조건에 의한 것입니다.
- Frontend 및 Backend 코드에 목킹 로직은 없으며, 정상적인 비즈니스 로직(Controller -> Service -> Repository -> DB)을 타고 있습니다.
