# Docker Dev Environment Migration Report

이 문서는 로컬 Java 부재 문제를 해결하기 위해 **Backend와 Frontend 개발 환경을 Docker 컨테이너로 완전히 이관**한 작업 내역을 정리합니다.

## 1. 개요 (Overview)
*   **작업 일시**: 2025-12-12
*   **목적**: 로컬에 Java 개발 도구(JDK, Gradle)가 설치되어 있지 않은 환경에서도 프로젝트를 빌드하고 실행할 수 있도록 함.
*   **결과**: `docker-compose up` 명령 하나로 DB, Backend, Frontend가 모두 실행되는 환경 구축 완료.

## 2. 주요 변경 사항 (Key Changes)

### 2.1 Directory Cleanup
*   `frontend/app` 폴더 삭제: `frontend/src/app`과의 라우팅 충돌 해결.

### 2.2 Docker Infrastructure
*   **`docker-compose.yml`**:
    *   `hr-backend-dev`: `gradle:8.5-jdk17` 이미지를 사용하여 Spring Boot 실행 (`gradle :app:bootRun`).
    *   `hr-frontend-dev`: `node:18-alpine` 이미지를 사용하여 Next.js 실행 (`npm run dev`).
    *   `hr-db`: 서비스명으로 내부 통신.

### 2.3 Backend Configuration
*   **`backend/app/src/main/resources/application.yml`**:
    *   DB Host 변경: `localhost` -> `hr-db`
    *   Bean Overriding 활성화: `spring.main.allow-bean-definition-overriding: true` (중복 클래스 문제 임시 해결).

### 2.4 Code Fixes (Compilation Errors)
*   **Missing Build Scripts**: `modules/payroll`, `attendance`, `vacation`에 `build.gradle` 추가.
*   **Duplicate Classes Removed**:
    *   `modules/approval/.../com/hr/modules/approval/.../ApprovalController.java` 삭제.
    *   `modules/org/.../com/hr/modules/org/domain/DepartmentRepository.java` 삭제.
    *   `modules/user/.../com/hr/modules/user/domain/UserRepository.java` 삭제.
*   **API Compatibility**: `ApiResponse.error(String)` 메소드 추가.

## 3. 실행 방법 (How to Run)

1.  **Docker 실행**:
    ```bash
    docker-compose up --build
    ```
2.  **접속**:
    *   Frontend: [http://localhost:3000](http://localhost:3000)
    *   Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
    *   DB (Internal): `hr-db:3306`

## 4. 향후 권장 사항
*   **중복 패키지 정리**: `com.hr.modules.{module}` 패턴으로 잘못 생성된 남은 파일들을 전수 조사하여 정리 필요.
