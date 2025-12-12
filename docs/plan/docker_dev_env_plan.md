# Docker 기반 개발 환경 구성 Plan (Dev via Docker)

## 1. 개요 및 목적 (Overview)
현재 로컬 머신에 Java가 설치되어 있지 않으며, 일관된 개발 환경 구성을 위해 **Backend와 Frontend의 빌드 및 실행 과정까지 모두 Docker 컨테이너 내부**로 이관합니다.
이를 통해 `docker-compose up` 명령어 하나로 DB, Backend(Spring Boot), Frontend(Next.js)가 모두 연동되는 개발 환경을 구축합니다.

## 2. 아키텍처 변경 (Architecture)

기존의 `docker-compose.yml`은 인프라(DB, Redis)만 담당했으나, 이를 확장하여 애플리케이션 컨테이너를 추가합니다.

### 2.1 Service 구성
1.  **Infrastructure Group** (Existing)
    *   `hr-db`: MySQL 8.0
    *   `hr-redis`: Redis
    *   `hr-mail`: MailHog
2.  **Application Group** (New)
    *   `hr-backend-dev`: Spring Boot 개발 서버
    *   `hr-frontend-dev`: Next.js 개발 서버

## 3. 상세 구현 계획 (Implementation Details)

### 3.1 Backend Container (`hr-backend-dev`)
로컬에 Java/Gradle이 없으므로, Docker 이미지가 빌드 툴을 제공해야 합니다.
*   **Base Image**: `gradle:8.5-jdk17` (Gradle과 JDK 17이 포함된 공식 이미지)
*   **Volumes (중요)**:
    *   `./backend:/app`: 소스 코드를 컨테이너와 동기화 (Hot Reloading 지원).
    *   `gradle_cache:/home/gradle/.gradle`: 의존성 라이브러리 캐싱 (재실행 속도 향상).
*   **Command**: `gradle bootRun --args='--spring.profiles.active=dev'`
*   **Missing Gradle Wrapper**: 컨테이너 내부의 `gradle` 명령어를 사용하여 `gradle wrapper`를 생성하고, 이를 호스트로 동기화시킬 수 있습니다.

### 3.2 Frontend Container (`hr-frontend-dev`)
*   **Base Image**: `node:18-alpine`
*   **Volumes**:
    *   `./frontend:/app`: 소스 코드 동기화.
    *   `/app/node_modules`: 호스트의 `node_modules`와 컨테이너 내부의 OS 차이로 인한 충돌 방지 (Anonymous Volume 사용).
*   **Command**: `npm run dev` (개발 서버 실행).

### 3.3 Docker Compose 설정 (`docker-compose.yml`)
기존 파일에 위 두 서비스를 정의하고, 네트워크로 연결합니다.

## 4. 실행 및 검증 시나리오 (Workflow)

### Step 1: `gradlew` 생성 (1회성)
로컬에 Gradle이 없으므로, Docker를 이용해 Wrapper를 생성합니다.
```bash
docker run --rm -v ".:/app" -w /app/backend gradle:jdk17 gradle wrapper
```

### Step 2: 컨테이너 실행
```bash
docker-compose up --build
```
*   Backend는 `gradle bootRun`으로 소스 변경 감지 및 재시작.
*   Frontend는 `npm run dev`로 HMR(Hot Module Replacement) 동작.

### Step 3: 접속 확인
*   Frontend: `http://localhost:3000`
*   Backend API Docs: `http://localhost:8080/swagger-ui.html`
*   DB: `localhost:3306`

## 5. 작업 순서 (Task List)
1.  **Frontend Cleanup**: `frontend/app` 폴더 삭제 (완료).
2.  **Backend Config**: `application.yml`의 DB 호스트를 `localhost`에서 `hr-db`(컨테이너 서비스명)로 변경해야 함. (Docker 내부 통신이므로)
3.  **Docker Compose Update**: `backend`와 `frontend` 서비스 정의 추가.
4.  **Gradle Wrapper Init**: Docker를 통해 `gradlew` 생성.
5.  **Run & Verify**: `docker-compose up` 실행 및 전체 시스템 테스트.
