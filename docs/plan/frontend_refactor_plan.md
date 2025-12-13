# 프론트엔드 리팩토링 구현 계획 (Frontend Refactoring Implementation Plan)

## 1. 개요 (Overview)
*   **목표:** 프론트엔드 코드의 "데이터 연결성" 및 "타입 안전성"을 확보하여, 사용자가 실제 비즈니스 로직을 체감할 수 있도록 개선한다.
*   **핵심 문제:**
    1.  **Hardcoded Context:** `userId: 1`과 같이 로그인한 사용자 정보가 하드코딩되어 있음.
    2.  **Mock Data:** 대시보드 위젯이 실제 백엔드 API가 아닌 가짜 데이터를 보여줌.
    3.  **Weak Error Handling:** `any` 타입의 에러 처리로 안정성이 부족함.
*   **기반:** 제공된 `프론트엔드 리팩토링 분석 보고서`를 바탕으로 수행한다.

## 2. 구현 단계 (Implementation Steps)

### Step 1: User Context (Auth Store) 구현 [Critical]
*   **목표:** 로그인 후 사용자 정보(ID, Email, Role, CompanyId)를 전역 상태로 관리하고, API 호출 시 동적으로 주입한다.
*   **기술 스택:** `Zustand` (또는 React Context API)
*   **작업 내용:**
    1.  `src/shared/stores/useAuthStore.ts` 생성.
        *   State: `user` (User | null), `isAuthenticated` (boolean), `login(user)`, `logout()`.
        *   Persistence: `localStorage`와 동기화 (새로고침 시 유지).
    2.  `LoginForm.tsx` 수정: 로그인 성공 시 `setAccessToken` 뿐만 아니라 `setUser` 호출. (Backend `/auth/login` 응답에 User 정보 포함 필요 확인 -> 만약 없으면 `/auth/me` 호출 추가).
    3.  **API 호출부 수정:**
        *   `vacationApi.ts`, `assetApi.ts` 등에서 하드코딩된 `userId` 제거.
        *   Component 레벨에서 `useAuthStore`의 `user.id`를 가져와 API hook에 전달.

### Step 2: Dashboard 데이터 바인딩 (Real Data Integration)
*   **목표:** `Dashboard/QuickStats.tsx` 등의 위젯을 실제 데이터와 연결한다.
*   **작업 내용:**
    1.  **연차 잔여일:** `useMyVacationBalance(user.id)` (SWR) 훅 연결 -> `QuickStats`의 "Vacation Days" 표시.
    2.  **대기 결재:** `useTodoEvaluations(user.id)` 등의 API를 활용하여 "Pending Actions" 카운트 표시 (필요 시 `ApprovalApi` 추가).
    3.  **API Fetcher 표준화:** `shared/api/client.ts`를 사용하는 `fetcher`를 재사용하도록 컴포넌트 정리.

### Step 3: 에러 핸들링 표준화 (Error Handling)
*   **목표:** `any` 타입 에러를 제거하고, 명확한 에러 메시지를 사용자에게 전달한다.
*   **작업 내용:**
    1.  `src/shared/api/types.ts`: `ApiError` 인터페이스 정의 (Backend Envelope 포맷 참조).
    2.  `client.ts`: Interceptor에서 에러 발생 시 표준화된 `ApiError` 객체로 변환하여 throw.
    3.  `useApiError` 훅 (Optional) 또는 유틸리티 함수 `getErrorMessage(err)` 구현.
    4.  주요 Form(Login, Create)의 `catch` 블록에 적용.

## 3. 검증 계획 (Verification Plan)

| ID | 검증 항목 | 검증 방법 | 예상 결과 |
|:---:|:---:|:---|:---|
| V1 | 로그인 상태 유지 | 로그인 -> 새로고침 -> 다른 페이지 이동 | 우측 상단 프로필에 내 이름 표시, API 호출 시 내 ID 사용 확인 |
| V2 | 대시보드 데이터 | DB에서 Vacation Balance 수정 -> 대시보드 새로고침 | 변경된 잔여 연차 일수 표시 (하드코딩 "12 Days" 아님) |
| V3 | 에러 메시지 | 로그인 시 틀린 비밀번호 입력 | "Invalid credentials" 등 백엔드 메시지가 토스트/알럿으로 표시됨 |

## 4. 백엔드 지원 필요 사항 (Backend Requirements)
*   `/api/auth/login` 응답에 `User` 정보(id, name, role, companyId)가 포함되어 있는지 확인 필요. (만약 Token만 준다면 `/api/users/me` 엔드포인트 활용 전략 수립).
