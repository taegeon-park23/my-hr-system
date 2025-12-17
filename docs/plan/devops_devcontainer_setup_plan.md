# DevOps Dev Container Setup Plan

## 1. 개요 (Overview)
Windows 환경의 제약을 극복하고, 로컬에 Java나 Node.js 설치 없이 VS Code와 Docker만으로 개발할 수 있는 "Integrated Dev Environment"를 구축한다.

## 2. 목표 (Goals)
- `.devcontainer` 설정을 통해 원클릭 개발 환경 구성.
- Backend(Spring Boot)와 Frontend(Next.js)를 단일 컨테이너(혹은 통합 환경)에서 수정 및 실행 가능하게 함.
- 기존 `docker-compose.yml`을 최대한 활용하되, Dev Container 요구사항에 맞춰 볼륨 마운트 조정.

## 3. 변경 사항 (Proposed Changes)

### 3.1 Docker Compose 수정 (`docker-compose.yml`)
- `hr-backend-dev` 서비스의 볼륨 마운트를 `./backend:/app`에서 `./:/app`으로 변경.
- 이에 따라 `working_dir`을 `/app/backend`로 조정.
- 목적: Backend 컨테이너 내에서 Frontend 코드(`/app/frontend`)에도 접근하여 빌드 및 수정이 가능하도록 함.

### 3.2 Dev Container 설정 추가
- `.devcontainer/devcontainer.json` 생성.
- `service`: `hr-backend-dev` 지정.
- `features`: Node.js (v18), Java (v17) 추가 설치.
- `customizations`: VS Code Extension (Java Pack, Lombok, ESLint, Git Graph 등) 자동 설치.

## 4. 검증 계획 (Verification)
1. VS Code에서 "Reopen in Container" 실행 시 에러 없이 컨테이너가 빌드되고 접속되는지 확인.
2. 터미널에서 `/app/backend` 경로 확인 및 Gradle 빌드 테스트.
3. `/app/frontend` 경로 접근 및 npm install/run dev 테스트.
