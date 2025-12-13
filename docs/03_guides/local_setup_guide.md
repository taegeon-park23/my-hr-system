# 로컬 개발 환경 구성 및 실행 가이드

이 문서는 "Next-Gen HR SaaS System"을 로컬 환경에서 실행하기 위한 단계별 가이드입니다.

## 1. 사전 조건 (Prerequisites)

프로젝트를 실행하기 위해 다음 도구들이 설치되어 있어야 합니다.

*   **Java 17+**: 백엔드 애플리케이션 실행을 위해 필요합니다.
    *   확인: `java -version`
*   **Node.js 18+ (LTS)**: 프론트엔드(Next.js) 실행을 위해 필요합니다.
    *   확인: `node -v`
*   **Docker & Docker Compose**: 데이터베이스(MySQL) 및 인프라 실행을 위해 필요합니다.
    *   확인: `docker -v`, `docker-compose -v`

## 2. 인프라 실행 (Infrastructure)

프로젝트 루트 디렉토리(`my-hr-system`)에서 다음 명령어를 실행하여 데이터베이스와 필요한 서비스들을 실행합니다.

```bash
docker-compose up -d
```

이 명령어는 다음 컨테이너들을 시작합니다:
*   **hr-db**: MySQL 8.0 (Port: 3306, DB: `hr_system`)
*   **hr-redis**: Redis (Port: 6379)
*   **hr-mail**: MailHog (SMTP: 1025, Web UI: 8025)

## 3. 백엔드 실행 (Backend)

`backend` 디렉토리로 이동하여 Spring Boot 애플리케이션을 실행합니다.

**Windows:**
```powershell
cd backend
.\gradlew bootRun
```

**Mac/Linux:**
```bash
cd backend
./gradlew bootRun
```

*   서버가 정상적으로 실행되면 `http://localhost:8080/swagger-ui.html`에서 API 문서를 확인할 수 있습니다.

## 4. 프론트엔드 실행 (Frontend)

`frontend` 디렉토리로 이동하여 Next.js 애플리케이션을 실행합니다.

```bash
cd frontend
# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```

*   서버가 실행되면 브라우저에서 `http://localhost:3000`으로 접속하여 시스템을 사용할 수 있습니다.

## 5. 전체 시스템 테스트 (Verification)

1.  **DB 연결 확인**: 백엔드 로그에 DB 연결 성공 메시지가 출력되는지 확인합니다.
2.  **API 확인**: Swagger ui(`http://localhost:8080/swagger-ui.html`)에 접속하여 Auth, Org 등의 API가 보이는지 확인합니다.
3.  **웹 접속**: `http://localhost:3000`에 접속하여 로그인 페이지가 로드되는지 확인합니다.
