# 로컬 개발 환경 구성 및 실행 가이드

이 문서는 "Next-Gen HR SaaS System"을 개발하고 실행하기 위한 가이드입니다.
개발 환경은 **DevContainer(권장)** 를 사용하는 방법과 **로컬 머신(Manual)** 에 직접 구성하는 방법 두 가지를 지원합니다.

## 1. 개발 환경 선택

### Option A: VS Code DevContainer (권장)
VS Code와 Docker가 설치되어 있다면, 별도의 언어 런타임(Java, Node.js) 설치 없이 즉시 개발 환경을 구성할 수 있습니다. `.devcontainer/devcontainer.json` 설정을 따릅니다.

1.  VS Code에서 프로젝트 폴더 열기
2.  "Reopen in Container" 알림 클릭 (또는 F1 -> `Dev Containers: Reopen in Container` 실행)
3.  컨테이너 빌드 및 초기화 완료 대기
4.  자동으로 구성된 터미널에서 개발 시작

### Option B: Docker Compose (Full Stack)
로컬에 아무것도 설치하고 싶지 않고 실행만 확인하고 싶을 때 유용합니다.

```bash
docker-compose up -d
```
이 명령은 DB, Redis뿐만 아니라 Backend, Frontend 개발 서버까지 모두 Docker 컨테이너로 실행합니다.
*   Frontend: http://localhost:3000
*   Backend API: http://localhost:8080
*   Storybook: http://localhost:6006

---

## 2. 수동 설정 (Manual Setup)

로컬 머신에서 직접 소스 코드를 실행하려면 아래 단계를 따르십시오.

### 2.1 사전 조건 (Prerequisites)

*   **Java 17+**: 백엔드 실행 (Gradle 8.5 호환)
    *   `java -version`
*   **Node.js 18+ (or 20 LTS)**: 프론트엔드 실행 (`docker-compose`는 Node 20 사용 중)
    *   `node -v`
*   **Docker & Docker Compose**: 인프라 실행 필수
    *   `docker -v`

### 2.2 인프라 실행 (Infrastructure Only)

백엔드와 프론트엔드를 로컬에서 직접 실행할 경우, DB와 Redis 등 인프라 서비스만 Docker로 띄워야 포트 충돌이 발생하지 않습니다.

```bash
# 앱 컨테이너(hr-backend-dev, hr-frontend-dev)를 제외하고 인프라만 실행
docker-compose up -d hr-db hr-redis hr-mail
```

*   **MySQL**: 3306 (Schema: `hr_system`)
*   **Redis**: 6379
*   **MailHog**: 8025 (Web UI), 1025 (SMTP)

### 2.3 백엔드 실행 (Backend)

`backend` 디렉토리에서 Gradle을 통해 실행합니다.

**Mac/Linux:**
```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=dev'
```

**Windows:**
```powershell
cd backend
.\gradlew bootRun --args='--spring.profiles.active=dev'
```

*   API Docs: `http://localhost:8080/swagger-ui.html`

### 2.4 프론트엔드 실행 (Frontend)

`frontend` 디렉토리에서 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

*   Web App: `http://localhost:3000`

---

## 3. 문제 해결 (Troubleshooting)

*   **Port Conflict**: "Bind for 0.0.0.0:3306 failed" 오류 발생 시 로컬의 MySQL 서비스를 중지하거나 `docker-compose.yml`에서 포트 매핑을 변경하세요.
*   **DB Connection**: 백엔드 실행 시 DB 연결 오류가 나면 `docker-compose ps`로 `hr-db` 상태가 `Up`인지 확인하세요. 초기 실행 시 MySQL 초기화에 시간이 걸릴 수 있습니다.
