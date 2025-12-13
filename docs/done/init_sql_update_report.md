# Init.sql 및 설계 정의서 업데이트 완료 보고서

## 1. 개요 (Overview)
`docs/plan/init_sql_update_plan.md`에 따라 초기 데이터베이스 스크립트(`init.sql`)와 설계 문서(`Database_Design_Specification.md`)의 동기화 작업을 완료했습니다.

## 2. 작업 상세 (Details)

### 2.1 init.sql 업데이트
- **목적:** 초기 배포 시 명시적인 테이블 생성을 보장하고, 스키마 불일치(Drift) 방지.
- **내용:** 다음 테이블 생성 구문 추가 (총 4개)
    1.  `vacation_balances`
    2.  `payrolls`
    3.  `approval_requests` (수정: `requester_user_id` 컬럼 사용 명시)
    4.  `vacation_requests`

### 2.2 Database Design Specification 업데이트
- **목적:** 구현 상태(`VacationRequest.java`)와 문서의 일치.
- **내용:**
    - `VACATION_REQUESTS` 엔티티 명세 추가 (7번).
    - 테이블 번호 재정렬 (Payrolls: 8, Attendance: 9, Assets: 10).
    - `APPROVAL_REQUESTS` 엔티티 정의 재확인 (`requester_user_id` 정상).

## 3. 결과 (Result)
- **일관성 확보:** 코드 - DB스크립트 - 설계문서 간의 스키마 정의가 일치하게 되었습니다.
- **버그 예방:** 향후 `docker-compose down -v` 후 재시작하더라도 `approval_requests` 테이블이 올바른 스키마로 생성되어 SQL 에러가 재발하지 않습니다.
