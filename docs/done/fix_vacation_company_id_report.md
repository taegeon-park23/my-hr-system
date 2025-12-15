# Bug Fix Report: Vacation Request Company ID Mismatch

## 1. 개요 (Overview)
`kim.staff` (Samsung, Company ID 2)가 휴가를 신청해도 `lee.manager` (Samsung)에게 보이지 않는 문제의 근본 원인을 찾아 해결했습니다.

## 2. 원인 분석 (Root Cause)
-   **증상**: DB상에서 수동으로 데이터를 수정하면 보이지만, 새로운 요청을 생성하면 다시 안 보임.
-   **원인**: `VacationController` 코드 내부에 **`Long companyId = 1L;`**이라는 테스트용 하드코딩이 남아있었습니다.
-   **결과**: 사용자가 누구든 상관없이 모든 휴가 요청이 `Company ID 1`로 저장되었고, `Company ID 2`인 매니저는 이를 조회할 수 없었습니다.

## 3. 작업 내용 (Changes Implemented)

### Backend (`modules:vacation`)
-   **`VacationController.java` 수정**:
    -   하드코딩된 `companyId = 1L` 삭제.
    -   테스트용 `@RequestParam Long userId` 삭제.
    -   **`@AuthenticationPrincipal UserPrincipal user`**를 주입받아, 실제 로그인한 사용자의 **`companyId`**와 **`id`**를 사용하도록 변경했습니다.

### Debugging & Cleanup
-   문제 해결 과정에서 생성했던 `DebugController` 삭제.
-   `User` 엔티티에 필요한 Setter 추가 (데이터 보정용, 유지).

## 4. 검증 결과 (Verification)
-   하드코딩 제거 후, 로그인한 사용자의 소속 회사(Company ID 2)로 데이터가 정상 저장됨을 확인했습니다.
-   이제 별도의 DB 수동 조작 없이도 정상적인 결재 흐름이 동작합니다.

## 5. 결론 (Conclusion)
휴가 신청 및 결재 프로세스의 데이터 흐름이 정상화되었습니다.
