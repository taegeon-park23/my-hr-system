# 구성원 관리 기능 개발 계획 (Admin User Management Plan)

## 1. 개요
- **목적**: 기업 관리자가 조직의 구성원을 조회, 등록, 수정할 수 있는 기능을 구현한다. (SB-02 SCR-ADM-02 대응)
- **범위**: 
    - Backend: 사용자 CRUD API 구현 및 보안 필터링.
    - Frontend: 사용자 목록 그리드 및 등록/수정 모달 구현.

## 2. 상세 작업 내용

### Backend (modules:user)
- **DTO 정의**:
    - `UserResponse`: 목록 및 상세 조회용.
    - `UserSaveRequest`: 신규 등록 및 수정용.
- **UserController 확장**:
    - `GET /api/users`: 기업 내 사용자 목록 조회 (검색 및 필터 포함).
    - `GET /api/users/{id}`: 특정 사용자 상세 조회.
    - `POST /api/users`: 신규 사용자 생성 (기본 비밀번호 설정 및 인코딩).
    - `PUT /api/users/{id}`: 사용자 정보 수정 (직책, 부서, 권한 등).
- **UserService 확장**:
    - Multi-tenancy 준수: 모든 요청에서 `company_id`를 검증하여 타사 정보 접근 차단.
    - 부서(Dept) 유효성 검증 로직 추가.

### Frontend
- **Route**: `frontend/src/app/dashboard/admin/users/page.tsx` 추가.
- **Feature (features/user)**:
    - `api/userApi.ts`: `useUsers`, `useUser`, `useCreateUser`, `useUpdateUser` React Query 훅 구현.
    - `ui/UserList.tsx`: AgGrid를 활용한 데이터 그리드 구현.
    - `ui/UserToolbar.tsx`: 검색 바, 부서 필터, "직원 등록" 버튼 포함.
    - `ui/UserUpsertModal.tsx`: `react-hook-form` 기반의 등록/수정 폼. 3-Tab 구조(기본/조직/계정) 적용.
- **Shared**:
    - `DepartmentTreeSelector`: 부서 선택을 위한 공통 컴포넌트 활용 또는 구현.

## 3. 데이터베이스 영향
- 기존 `users` 테이블 활용. 신규 컬럼 필요 시 `init.sql` 업데이트 (현재는 기존 컬럼으로 충분할 것으로 판단됨).

## 4. 검증 전략
- **Unit Test**: `UserService`의 사용자 생성/수정/조회 로직 검증.
- **Architecture Test**: `ArchUnit`을 호출하여 모듈 간 의존성 위반 여부 확인 (`BackendArchitectureTest.java`).
- **Manual Test**: Front-to-Back 통합 테스트 (회원 등록 후 목록 반영 확인).

## 5. 보안 정책
- `AdminUserController` 또는 관련 API는 `TENANT_ADMIN` 권한이 있는 사용자만 접근 가능하도록 Spring Security 및 Policy 모듈 설정 확인.
