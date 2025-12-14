# Docker 기반 프론트엔드 개발 환경 전환 계획

## 1. 개요 (Overview)
현재 로컬(Host OS)에서 실행 중인 프론트엔드 개발 환경을 Docker Container 기반으로 완전히 이관합니다.
이를 통해 개발 환경의 일관성을 확보하고, 로컬 환경의 불필요한 아티팩트(node_modules 등)를 정리하여 가볍게 유지합니다.

## 2. 목표 (Goals)
1.  **Docker Compose 구성 업데이트**: Next.js(3000)와 Storybook(6006)을 각각의 컨테이너(또는 멀티 프로세스)로 실행.
2.  **로컬 아티팩트 정리**: `node_modules`, `.next` 등 로컬 빌드 파일 삭제.
3.  **로컬 실행 방지**: `npm run dev` 등을 로컬에서 직접 실행 시 차단 메시지 출력.
4.  **검증**: Docker 환경에서의 정상 동작 확인.

## 3. 상세 작업 계획 (Detailed Plan)

### 3.1 Docker Compose 설정 (docker-compose.yml)
- **`hr-frontend-dev` 서비스 수정**:
    - Port, Volume, Environment 설정 유지.
    - Command: Next.js 개발 서버 실행.
- **`hr-frontend-storybook` 서비스 추가**:
    - Image, Volume 등의 설정은 Frontend와 공유 (동일한 node 이미지 사용).
    - Port: `6006:6006`.
    - Command: `npm run storybook -- --ci` (Interaction 모드 방지).

### 3.2 패키지 스크립트 수정 (package.json)
- **스크립트 Guard 추가**: `dev`, `storybook` 스크립트 실행 시 `IS_DOCKER` 환경변수 확인.
- **로컬 실행용 별도 스크립트**: 필요 시 `dev:local` 등으로 우회법 제공 (선택 사항).

### 3.3 로컬 정리 작업 (Cleanup)
- 삭제 대상:
    - `frontend/node_modules`
    - `frontend/.next`
    - `frontend/package-lock.json` (Docker 내부에서 재생성 권장, 혹은 lock 파일은 유지하고 modules만 삭제) -> *Note: lock 파일은 버전 고정을 위해 유지하는 것이 좋음. modules만 삭제.*

### 3.4 검증 계획 (Verification)
1.  **Docker Compose 실행**: `docker-compose up -d`
2.  **서비스 상태 확인**: `docker-compose ps`
3.  **접속 테스트**:
    - Next.js: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
    - Storybook: [http://localhost:6006](http://localhost:6006)

## 4. 실행 순서
1.  `docker-compose.yml` 수정.
2.  `frontend/package.json` 스크립트 수정.
3.  로컬 `node_modules`, `.next` 삭제.
4.  Docker Compose 실행 및 테스트.
