# 프론트엔드 리팩토링 및 기능 개선 계획 (Frontend Refactoring Plan)

## 1. 개요 (Overview)
현재 프론트엔드에서 발생하는 UI/UX 문제(대시보드 미구현, 네비게이션 작동 불량, 반응형 레이아웃 깨짐)와 코드 품질 문제(Type Safety 미흡)를 해결하기 위한 종합 계획입니다.

## 2. 문제 분석 (Analysis)
1.  **Dashboard Page:** 정적인 텍스트만 존재하며 실질적인 정보(요약, 바로가기)가 없음.
2.  **Navigation & Layout:**
    - `Sidebar`가 `fixed` 포지션으로 설정되어 있으나, 메인 콘텐츠 영역에 적절한 `margin-left`가 적용되지 않아 화면 겹침 발생.
    - 소형 화면(Mobile/Tablet)에서 사이드바가 숨겨지기만 하고 접근할 수 있는 토글 버튼이 없음.
3.  **Type Safety:** `client.get<any>` 및 `catch(err: any)` 등 명시적 타입 정의 없이 `any`를 남용하여 유지보수성 저하.

## 3. 개선 목표 (Goals)
1.  **Responsive Layout:** Desktop에서는 고정 사이드바(+메인 영역 여백), Mobile에서는 토글 가능한 드로어(Drawer) 형태 구현.
2.  **Dashboard Widgets:** 사용자 역할에 따른 주요 지표(잔여 연차 등) 및 바로가기 위젯 구현.
3.  **Strict Typing:** API 응답 및 에러 처리에 대한 제네릭 인터페이스 정의 및 적용.

## 4. 구현 상세 (Implementation Details)

### 4.1 Layout Refactoring
- **파일:** `src/app/dashboard/layout.tsx`, `src/widgets/Sidebar/Sidebar.tsx`
- **변경 사항:**
  - `Sidebar` 컴포넌트 구조 개선: Desktop용(Fixed)과 Mobile용(Overlay) 분리 또는 반응형 스타일 적용.
  - 메인 콘텐츠 영역(`main`)에 `md:ml-64` 클래스 추가하여 고정 사이드바 영역 확보.
  - Mobile Header 추가: 햄버거 메뉴 버튼 구현 (Zustand 또는 Context로 Sidebar Open 상태 관리).

### 4.2 Dashboard Interactivity
- **파일:** `src/app/dashboard/page.tsx`
- **추가 컴포넌트:**
  - `QuickStats`: 잔여 연차, 미결재 문서 수 등 핵심 지표 요약.
  - `QuickActions`: 휴가 신청, 결재 작성 등 바로가기 버튼.
  - `RecentActivity`: 최근 내 활동 로그.

### 4.3 Type Safety Improvements
- **파일:** `src/shared/api/client.ts`, `src/features/**/api/*.ts`
- **변경 사항:**
  - `ApiResponse<T>` 인터페이스 정의 (Backend Envelope 패턴 대응).
  - `client.get<T>`, `client.post<T>` 등을 사용할 때 `any` 대신 구체적인 DTO 타입 사용.
  - `authApi.ts`, `vacationApi.ts` 등 전수 조사하여 리팩토링.

## 5. 검증 계획 (Verification Plan)
1.  **Layout:** 창 크기를 조절하며 Sidebar 겹침 유무 및 Mobile 메뉴 동작 확인.
2.  **Dashboard:** 위젯 데이터 로딩 및 클릭 시 페이지 이동 확인.
3.  **Build:** `npm run build`를 통해 타입 에러 없이 컴파일됨을 확인.

## 6. 일정 (Schedule)
- **Phase 1:** Layout & Mobile Sidebar (1hr)
- **Phase 2:** Dashboard Widgets (1hr)
- **Phase 3:** Type Refactoring (0.5hr)
