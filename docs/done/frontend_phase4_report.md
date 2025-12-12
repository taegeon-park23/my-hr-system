# Frontend Phase 4 작업 리포트

## 1. 개요
조직도(Organization Chart)를 조회하고 관리할 수 있는 기능을 구현했습니다.

## 2. 작업 상세 내용

### 2.1 Organization Feature Slice
`features/org` 경로에 FSD 구조로 구현했습니다.
- **Model**: `Department` (재귀적 구조), `User` 타입 정의.
- **API**: `orgApi.ts`에서 Mock Data를 Tree 구조로 변환하여 반환하는 `getOrgTree` 함수 구현.
- **UI**: `OrgTree.tsx` - 재귀(Recursive) 컴포넌트로 무한 깊이의 부서 구조를 표현. (접기/펼치기 가능)

### 2.2 Organization Page
- `app/dashboard/org/page.tsx`: 조직 관리 페이지.
- 비동기 데이터 로딩 처리 (Loading State).
- 상단 Action Bar (Export, Add Department 버튼) 배치.

## 3. 결과물
- **조직 관리 메뉴**: `/dashboard/org` 접속 시 조직도 확인 가능.
- **기능**: 부서 계층 구조 시각화, 폴더 접기/펼치기 인터랙션.

## 4. 커밋 예정 사항
- `features/org` 전체.
- `app/dashboard/org` 페이지.
