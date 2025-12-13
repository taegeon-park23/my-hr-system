# 급여(Payroll) 모듈 프론트엔드 구현 계획

## 1. 개요 (Overview)
본 문서는 급여 모듈의 프론트엔드 구현을 위한 계획이다.
Next.js App Router와 Feature-Sliced Design (FSD) 아키텍처를 따르며, 백엔드 API와 연동하여 급여 대장 관리 및 개인별 명세서 조회 기능을 구현한다.

## 2. 화면 구성 (Pages)

### 2.1 관리자용
- **/payroll/manage**: 급여 대장 목록 및 생성 (테넌트 관리자)
- **/payroll/manage/[id]**: 급여 대장 상세 및 확정 관리

### 2.2 사용자용
- **/payroll/my**: 내 급여 명세서 목록 및 상세 조회

## 3. 기능 설계 (Features)

### 3.1 features/payroll
- **api/**
    - `usePayrollList.ts`: 급여 대장 목록 조회 (SWR/TanStack Query)
    - `usePayrollDetail.ts`: 대장 상세 조회
    - `useCreatePayroll.ts`: 대장 생성 Mutation
    - `useMyPayslips.ts`: 내 명세서 목록 조회
- **ui/**
    - `PayrollListTable.tsx`: 관리자용 대장 목록 테이블
    - `PayrollCreateModal.tsx`: 대장 생성 폼 (제목, 귀속월, 지급일)
    - `PayslipDetailView.tsx`: 급여 명세 상세 뷰 (Printable CSS 적용)

## 4. 구현 단계 (Implementation Steps)

1.  **API Hooks 생성**: 백엔드 API와 통신하는 커스텀 훅 구현.
2.  **UI 컴포넌트 개발**:
    - 리스트 테이블 (TanStack Table 활용 권장, 여기서는 기본 Table 사용).
    - 명세서 상세 디자인 (영수증 형태).
3.  **페이지 조립 (Integration)**: `app/payroll` 라우트 생성 및 컴포넌트 배치.

## 5. 검증 계획 (Verification)

- 관리자 로그인 -> 대장 생성 -> 목록 확인.
- 생성된 대장에서 "상세 보기" 클릭 -> 직원별 명세 생성 여부 확인.
- 일반 사용자 로그인 -> "내 급여" 메뉴 -> 본인 명세만 보이는지 확인.
