# Docker Frontend & Storybook 검증 계획

## 1. 개요 (Overview)
본 문서는 Docker 환경으로 이관된 Frontend 애플리케이션(Next.js)과 Storybook이 각각 할당된 포트에서 정상적으로 동작하는지 확인하기 위한 절차를 정의합니다.

## 2. 테스트 환경 (Environment)
- **Container Name**: `hr-frontend-dev`
- **Frontend Port**: 3000
- **Storybook Port**: 6006
- **Network**: Docker Host (localhost)

## 3. 테스트 절차 (Test Procedures)

### 3.1 컨테이너 상태 확인
1.  터미널에서 `docker ps` 명령어를 실행하여 `hr-frontend-dev` 컨테이너가 `Up` 상태인지 확인합니다.
2.  로그 확인: `docker logs -f hr-frontend-dev`를 통해 애플리케이션 시작 로그(Next.js Ready, Storybook warning 등)를 확인합니다.

### 3.2 Frontend (Next.js) 접속 테스트
1.  브라우저를 열고 `http://localhost:3000`에 접속합니다.
2.  **기대 결과**:
    - 로그인 페이지 또는 대시보드가 정상적으로 로드되어야 합니다.
    - 콘솔에 에러가 없어야 합니다.
    - API 요청(예: `/api/...`)이 Docker 내부의 Backend와 정상적으로 통신해야 합니다.

### 3.3 Storybook 실행 및 접속 테스트
Storybook은 `hr-frontend-dev` 컨테이너 내부에서 별도로 실행해야 합니다.

1.  **Storybook 실행**:
    - 터미널에서 다음 명령어를 실행하여 컨테이너 내부에서 Storybook을 백그라운드로 실행합니다:
    ```bash
    docker exec -d hr-frontend-dev npm run storybook:local -- --host 0.0.0.0 --ci
    ```
    > **Note**: `storybook:local` 스크립트는 `IS_DOCKER=true`를 주입하여 `check-docker.js`를 통과합니다. `--host 0.0.0.0`은 컨테이너 외부 접속을 허용하기 위해 필수입니다.

2.  **접속 확인**:
    - 브라우저를 열고 `http://localhost:6006`에 접속합니다.
    - **기대 결과**:
        - Storybook UI가 정상적으로 로드되어야 합니다.
        - 사이드바에 정의된 컴포넌트(Badge, Button 등)가 표시되어야 합니다.

## 4. 문제 해결 (Troubleshooting)
- **포트 충돌**: 로컬에서 이미 3000이나 6006 포트를 사용 중인지 확인 (`netstat -ano | findstr :3000`).
- **Storybook 접속 불가**: Storybook이 `localhost`가 아닌 `0.0.0.0`으로 바인딩되었는지 확인합니다.
