# 백엔드 버그 및 설정 수정 완료 보고서 (Backend Bug Fix Report)

## 1. 개요 (Overview)
`docs/plan/db_schema_correction_plan.md`에 따라 데이터베이스 스키마 불일치 문제와 Swagger UI 접속 불가 문제를 해결했습니다.

## 2. 작업 상세 (Details)

### 2.1 Swagger Configuration Fix
- **증상:** Swagger UI 접속 시 401 Unauthorized 발생.
- **원인:** `application.yml`의 커스텀 경로(`path: /api-docs`)와 Spring Security의 허용 경로(`/v3/api-docs/**`)가 불일치.
- **조치:** `application.yml`에서 `springdoc` 설정을 삭제하여 Spring Boot 기본값(`path: /v3/api-docs`)으로 복구.
- **결과:** `/v3/api-docs` JSON 응답 정상 확인.

### 2.2 Database Schema Correction
- **증상:** 연차 신청 시 `Field 'requester_id' doesn't have a default value` SQL 에러 발생.
- **원인:** 코드(`requester_user_id`)와 DB Schema(`requester_id`)의 컬럼명 불일치.
- **조치:** `approval_requests` 테이블에서 사용하지 않는 `requester_id` 컬럼 삭제 (ALTER TABLE).
- **결과:** 테이블 스키마 정상화 (`requester_user_id`만 존재).

## 3. 검증 (Verification)
- **Swagger:** `http://localhost:8080/v3/api-docs` 호출 성공 (200 OK).
- **DB:** `DESCRIBE approval_requests` 결과 `requester_id` 컬럼 삭제 확인.

## 4. 결론 (Conclusion)
연차 신청을 방해하던 SQL 에러와 API 문서화 도구 접속 문제가 모두 해결되었습니다.
이제 프론트엔드에서 연차 신청 기능을 정상적으로 테스트할 수 있습니다.
