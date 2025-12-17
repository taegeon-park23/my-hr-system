# DevOps Dev Container Setup Report

## 1. 개요
Project Technical Definition 및 User Request에 따라 Windows 환경에서도 리눅스 기반의 일관된 개발 환경을 제공하기 위해 Dev Container 설정을 적용하였다.

## 2. 작업 상세 내용

### 2.1 Docker Compose 수정 (`docker-compose.yml`)
- **수정 전**: `hr-backend-dev` 서비스가 `./backend`만 `/app`에 마운트.
- **수정 후**: 프로젝트 루트(`./`)를 `/app`에 마운트하고, `working_dir`을 `/app/backend`로 변경.
- **이유**: Dev Container 내부에서 Frontend 코드까지 접근하여 Full-stack 개발이 가능하도록 하기 위함.

### 2.2 Dev Container 설정 파일 생성 (`.devcontainer/devcontainer.json`)
- Base Service: `hr-backend-dev`
- Features:
  - `ghcr.io/devcontainers/features/node:1` (version: 18)
  - `ghcr.io/devcontainers/features/java:1` (version: 17)
- Extensions:
  - Java Extension Pack
  - Lombok
  - ESLint
  - Prettier
  - Git Graph

## 3. 결과 및 사용법
1. VS Code에서 `F1` > `Dev Containers: Reopen in Container` 선택.
2. 컨테이너 접속 후:
   - Backend: `/app/backend` 위치에서 `./gradlew bootRun` 실행.
   - Frontend: `cd /app/frontend` 이동 후 `npm install && npm run dev` 실행.

## 4. 검증
- `devcontainer.json` 구문 및 `docker-compose.yml` 서비스명(`hr-backend-dev`) 일치 확인.
- 볼륨 마운트 경로 수정 확인.
