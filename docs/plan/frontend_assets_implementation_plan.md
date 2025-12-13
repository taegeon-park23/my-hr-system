# 자산 관리 모듈 프론트엔드 구현 계획 (Frontend Assets Module Implementation Plan)

## 1. 개요 (Overview)
* **목표**: 백엔드에 구현된 자산 관리 API를 연동하여 관리자용 자산 운용 화면과 사용자용 내 자산 조회 화면을 개발한다.
* **범위**: API 연동 Hook 개발, UI 컴포넌트(목록, 등록, 할당 모달) 개발, 페이지 구현 및 라우팅 설정.

## 2. 구현 상세 (Implementation Steps)

### Step 1: API 연동 (API Integration)
* **파일**: `src/features/asset/api/assetApi.ts`
* **내용**:
    *   `useAdminAssets(companyId)`: SWR Hook for `GET /api/admin/assets`
    *   `useMyAssets(userId)`: SWR Hook for `GET /api/assets/my`
    *   `createAsset(data)`: `POST /api/admin/assets`
    *   `assignAsset(id, userId)`: `POST /api/admin/assets/{id}/assign`
    *   `returnAsset(id)`: `POST /api/admin/assets/{id}/return`
    *   `updateAssetStatus(id, status)`: `PATCH /api/admin/assets/{id}/status`

### Step 2: UI 컴포넌트 개발 (UI Components)
* **위치**: `src/features/asset/ui/`
* **컴포넌트**:
    1.  `AssetListTable.tsx`: 자산 목록 테이블 (Admin용).
        *   컬럼: 모델명, 시리얼, 카테고리, 상태(Badge), 현재 사용자, 구매일, 관리(할당/회수 버튼).
    2.  `AssetCreateModal.tsx`: 신규 자산 등록 폼 모달.
    3.  `AssetAssignModal.tsx`: 사용자 검색 및 할당 모달.
    4.  `MyAssetCard.tsx`: 내 자산 조회용 카드 뷰.

### Step 3: 페이지 구현 (Pages)
* **Admin Page**: `src/pages/admin/assets/manage.tsx` (Next.js Page)
    *   `AssetListTable` 및 `AssetCreateModal` 조합.
* **User Page**: `src/pages/assets/my.tsx`
    *   `MyAssetCard` 리스트 렌더링.

### Step 4: 네비게이션 및 라우팅 (Navigation)
*   `Sidebar`: '자산 관리' (Admin), '내 자산' (User) 메뉴 추가.

## 3. 검증 시나리오 (Verification)
1.  **관리자 기능**:
    *   자산 등록 후 테이블 갱신 확인.
    *   특정 자산을 사용자에게 할당 -> 상태 변경(ASSIGNED) 및 할당자 표시 확인.
    *   자산 회수 -> 상태 변경(AVAILABLE) 확인.
2.  **사용자 기능**:
    *   '내 자산' 페이지 진입 시 할당받은 자산이 카드 형태로 표시되는지 확인.

## 4. 예상 소요 (Estimated Effort)
*   API 및 타입 정의: 2 steps
*   UI 컴포넌트: 3~4 steps
*   페이지 조립: 2 steps
*   **총**: 약 8~10 Tools Steps
