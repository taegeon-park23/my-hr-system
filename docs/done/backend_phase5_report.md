# Backend Phase 5 작업 리포트

## 1. 개요
프론트엔드와 연동하기 위한 REST API Layer(Controller)를 구현하고, CORS 설정을 통해 통신 환경을 구축했습니다.

## 2. 작업 상세 내용

### 2.1 API Implementation
각 모듈별로 클라이언트 요청을 처리할 Controller를 구현했습니다.
- **Auth Module (`modules/user`)**: `AuthController`
    - `POST /api/auth/login`: Mock Login 구현 (admin@samsung.com). JWT 토큰(Mock) 반환.
- **Queries Module**: `OrgChartController`
    - `GET /api/org/tree/{companyId}`: 조직도 트리 조회 (CQRS Query Service 호출).
- **Approval Module**: `ApprovalController`
    - `GET /api/approval/inbox/{requesterId}`: 내 결재함 조회.
    - `POST /api/approval/request`: 기안 상신.

### 2.2 Infrastructure
- **CORS Configuration**: `WebConfig`
    - Frontend(`localhost:3000`)에서의 접근 허용.
    - 모든 HTTP Method 및 Header 허용.
- **Module Build Config**: `queries/build.gradle` 생성 및 의존성 설정.

## 3. 향후 과제
- **Frontend Integration**: 프론트엔드의 Mock API를 실제 백엔드 호출(`axios`)로 변경 필요.
- **Security**: Mock Token 대신 실제 JWT 발급 및 Filter Chain 적용 필요.

## 4. 커밋 예정 사항
- `backend/app/src/main/java/com/hr/app/config/WebConfig.java`
- `backend/queries/src/main/java/com/hr/queries/org/controller/**`
- `backend/modules/user/src/main/java/com/hr/user/controller/**`
- `backend/modules/approval/src/main/java/com/hr/approval/controller/**`
