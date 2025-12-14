# 백엔드 API 마이그레이션 및 구현 계획

## 1. 개요
프론트엔드에서 404 오류가 발생하는 API 호출을 분석한 결과, 백엔드 엔드포인트와의 경로/파라미터 불일치 및 미구현 기능이 확인되었습니다.
본 계획은 이를 해결하기 위해 프론트엔드 호출 규격을 백엔드에 맞게 수정하고, 누락된 백엔드 기능을 구현하는 것을 목표로 합니다.

## 2. 작업 상세

### 2.1 프론트엔드 수정 (API 연동 규격 호환)
| 구분 | 현행 (Frontend) | 대상 (Backend) | 조치 사항 |
| :--- | :--- | :--- | :--- |
| **조직도** | `GET /api/org/tree` | `GET /api/org/tree/{companyId}` | path parameter `{companyId}` 추가 |
| **결재함** | `GET /api/approval/inbox?userId=2` | `GET /api/approval/inbox/{userId}` | Query Param -> Path Variable 변경 |
| **자산 목록** | `GET /api/assets` | `GET /api/admin/assets?companyId=...` | Path 변경 및 `companyId` 파라미터 추가 |
| **팀원 수** | `GET /api/users/team-count?userId=2` | (미구현) | 백엔드 구현 후 연동 |

*   **수정 파일**:
    *   `src/shared/api/queryKeys.ts`: 쿼리 키 및 URL 생성 함수 수정.
    *   `src/features/organization/api/orgApi.ts` (확인 필요): API 호출 함수 수정.
    *   `src/features/approval/api/approvalApi.ts` (확인 필요): API 호출 함수 수정.
    *   `src/features/asset/api/assetApi.ts` (확인 필요): API 호출 함수 수정.

### 2.2 백엔드 기능 구현
*   **Module**: `com.hr.modules.user`
*   **Controller**: `UserController` (신규 생성)
    *   Endpoint: `GET /api/users/team-count`
    *   Logic:
        1.  요청 파라미터 `userId` 수신.
        2.  `UserRepository`에서 User 조회 -> `deptId` 확인.
        3.  `UserRepository.countByDeptId(deptId)` 호출.
        4.  결과 반환.
*   **Repository**: `UserRepository`에 `countByDeptId` 메서드 추가.

## 3. 검증 계획 (Verification)
1.  **Backend 시작**: `docker-compose up hr-backend-dev -d` 혹은 IDE 실행.
2.  **API 테스트**:
    *   `GET /api/users/team-count?userId=1` (결과: 숫자 반환)
3.  **Frontend 연동 확인**:
    *   대시보드 진입 시 404 에러가 발생하지 않아야 함.
    *   `QuickStats` 위젯에 데이터 정상 표시 확인.

## 4. 실행 순서
1.  Backend: `UserRepository` 메서드 추가 및 `UserController` 구현.
2.  Frontend: `queryKeys.ts` 및 관련 API 호출 로직 수정.
3.  전체 빌드 및 테스트.
