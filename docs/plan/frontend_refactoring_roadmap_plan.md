# 프론트엔드 리팩토링 및 고도화 계획 (Frontend Refactoring Roadmap)

## 1. 개요 (Overview)
본 문서는 사용자 요청에 따른 "우선순위별 리팩토링 로드맵"을 구체화한 실행 계획입니다.
기능의 정상 동작 확보(데이터 무결성), 코드 유지보수성 향상(API 표준화, 폼 핸들링), 사용자 경험 개선(UI 시스템)을 단계적으로 수행합니다.

## 2. 작업 목표 (Goals)
1.  **데이터 무결성:** 하드코딩된 가짜 데이터(`userId=1`, `Admin User`)를 제거하고 실제 인증 정보(`useAuthStore`)와 연동합니다.
2.  **API 표준화:** 중복되는 `fetcher` 로직을 제거하고, SWR Key 관리 전략(`queryKeys`)을 도입하여 캐싱 효율을 높입니다.
3.  **폼 시스템 강화:** `react-hook-form`과 `zod`를 도입하여 유효성 검사 로직을 표준화하고 UX를 개선합니다.
4.  **UI 시스템:** 반복되는 UI 패턴(Card, PageHeader)을 컴포넌트화하여 디자인 일관성을 확보합니다.

---

## 3. 상세 실행 계획 (Execution Plan)

### Step 1: 데이터 무결성 및 하드코딩 제거 (Data Integrity)
**우선순위:** 최상 (Critical)
**목표:** 실제 데이터 흐름 연결

#### Action 1-1: VacationRequestForm 인증 연동
-   **대상 파일:** `src/features/vacation/ui/VacationRequestForm.tsx`
-   **작업 내용:**
    -   `useAuthStore` import.
    -   `const { user } = useAuthStore()` 로 사용자 정보 획득.
    -   `const userId = 1;` 삭제 및 `user?.id` 사용.
    -   `user`가 없을 경우 로그인 페이지 리다이렉트 또는 안내 메시지 처리.

#### Action 1-2: Sidebar 사용자 정보 동적 바인딩
-   **대상 파일:** `src/widgets/Sidebar/Sidebar.tsx`
-   **작업 내용:**
    -   `useAuthStore` import.
    -   하드코딩된 "Admin User" 텍스트를 `{user?.name || 'Guest'}`로 변경.
    -   "View Profile" 등의 링크에 동적 ID 적용 고려 (추후).

#### Action 1-3: Sidebar 메뉴 권한 제어 (RBAC)
-   **대상 파일:** `src/widgets/Sidebar/Sidebar.tsx`
-   **작업 내용:**
    -   `navigation` 배열 필터링 로직 추가.
    -   `item.role` 속성을 정의하거나, 특정 메뉴(Admin)에 대해 `user.role === 'ADMIN'` 체크 로직 추가.
    -   접근 불가 메뉴 숨김 처리.

---

### Step 2: API 계층 표준화 (API Standardization)
**목표:** 중복 제거 및 캐싱 전략 수립

#### Action 2-1: 공통 Fetcher 분리
-   **대상 파일:** `src/shared/api/fetcher.ts` (신규 생성), `src/features/vacation/api/vacationApi.ts`
-   **작업 내용:**
    -   `src/shared/api/fetcher.ts`에 `fetcher` 함수 정의 및 export.
        ```typescript
        import { client } from './client';
        export const fetcher = (url: string) => client.get(url).then(res => res.data.data);
        ```
    -   `vacationApi.ts` 등 개별 파일의 로컬 `fetcher` 제거 및 import 사용.

#### Action 2-2: Query Keys 관리 전략 도입
-   **대상 파일:** `src/shared/api/queryKeys.ts` (신규 생성)
-   **작업 내용:**
    -   Key Factory 패턴 적용.
        ```typescript
        export const queryKeys = {
            vacation: {
                all: ['vacation'] as const,
                balance: (userId: number, year: number) => [...queryKeys.vacation.all, 'balance', userId, year] as const,
                requests: (userId: number) => [...queryKeys.vacation.all, 'requests', userId] as const,
            },
            // ... others
        };
        ```
    -   **주의:** SWR은 배열 키를 지원하므로 문자열 대신 배열 키 사용 권장 (`fetcher`가 배열 키를 처리하도록 수정 필요할 수 있음. 혹은 `key` 직렬화 사용).
    -   SWR 기본 fetcher가 배열을 받을 수 있도록 `swr` 설정 확인 또는 `unstable_serialize` 활용.
    -   우선은 URL 문자열 생성 로직을 팩토리 함수로 관리하는 방식(String Key Factory)으로 적용하여 기존 `fetcher` 호환성 유지.
        -   예: `balance: (id, year) => /vacations/balance?year=${year}&userId=${id}`

#### Action 2-3: Error Handling 개선
-   **대상 파일:** `src/shared/api/client.ts`
-   **작업 내용:**
    -   `window.location.href` 대신 `next/navigation`의 `router.replace` 사용 검토 (Interceptor 내에서는 훅 사용 불가하므로, 전역 이벤트 버스나 별도 유틸리티 고려, 혹은 현재 유지하되 클라이언트 컴포넌트 레벨에서 처리하도록 가이드). *Note: Interceptor에서 Router hook 사용은 제한적이므로, 401 발생 시 window 이동은 유지하되, 가능한 부드러운 처리 방법 모색.*

---

### Step 3: 폼 핸들링 및 유효성 검사 강화 (Form & Validation)
**목표:** 안정적인 입력 처리

#### Action 3-1: 라이브러리 설치
-   **명령어:** `npm install react-hook-form zod @hookform/resolvers`

#### Action 3-2: VacationRequestForm 리팩토링
-   **대상 파일:** `src/features/vacation/ui/VacationRequestForm.tsx`
-   **작업 내용:**
    -   `zod` 스키마 정의:
        ```typescript
        const vacationSchema = z.object({
            type: z.enum(['ANNUAL', 'HALF_AM', ...]),
            startDate: z.string().min(1, '시작일을 선택하세요'),
            endDate: z.string().min(1, '종료일을 선택하세요'),
            reason: z.string().min(5, '사유를 5자 이상 입력하세요')
        }).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
            message: "종료일은 시작일보다 빠를 수 없습니다",
            path: ["endDate"]
        });
        ```
    -   `useForm<VacationSchema>` 훅 적용.
    -   `<input {...register('startDate')} />` 형태로 교체.
    -   `handleSubmit`에서 `userId` 주입 로직 유지.

---

### Step 4: UI 컴포넌트 고도화 (Design System)
**목표:** 디자인 일관성

#### Action 4-1: 공통 UI 컴포넌트 추출
-   **대상 파일:** `src/shared/ui/Card.tsx`, `src/shared/ui/PageHeader.tsx`
-   **작업 내용:**
    -   반복되는 `bg-white p-6 rounded-lg shadow` 스타일을 `Card` 컴포넌트로 추상화.
    -   페이지 상단 제목/설명 영역을 `PageHeader` 컴포넌트로 추상화.

#### Action 4-2: 컴포넌트 적용
-   **대상 파일:** 주요 페이지 (`Dashboard`, `VacationRequestForm` 감싸기 등)
-   **작업 내용:**
    -   HTML 태그 직접 사용을 줄이고 공통 컴포넌트로 교체.

---

## 4. 검증 계획 (Verification Plan)

### 자동화/수동 테스트
1.  **로그인 테스트:** DB의 실제 User로 로그인하여 `user.id`가 `AuthStore`에 저장되는지 확인 (Redux/Zustand DevTools).
2.  **휴가 신청 테스트:**
    -   `VacationRequestForm`에서 신청 시, Network 탭의 Payload에 실제 `userId`가 전송되는지 확인.
    -   `zod` 유효성 검사 작동 확인 (잘못된 날짜, 빈 값 입력 시 에러 메시지 표시).
3.  **메뉴 권한 테스트:**
    -   `ROLE_USER`로 로그인 시 `Admin` 메뉴 숨김 확인.
    -   `ROLE_ADMIN` 로그인 시 전체 메뉴 표시 확인.
4.  **SWR 캐싱 테스트:**
    -   휴가 잔액 조회 후 다른 페이지 이동 후 복귀 시, 네트워크 요청 최소화 확인 (SWR Cache).

## 5. 예상 일정 (Timeline)
-   **Step 1:** 2시간
-   **Step 2:** 2시간
-   **Step 3:** 3시간
-   **Step 4:** 2시간
