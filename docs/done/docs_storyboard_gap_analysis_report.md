# Storyboard Gap Analysis & Reorganization Report

## 1. 개요
*   **작업 일자**: 2025-12-18
*   **작업자**: Assistant
*   **관련 계획**: `docs/plan/docs_storyboard_gap_analysis_plan.md`
*   **목적**: 프로젝트 정보 구조(IA)와 기존 스토리보드 간의 간극을 분석하고, 이를 해소하기 위해 문서를 재구조화함.

## 2. 작업 내용

### 2.1 디렉토리 구조 변경
*   **New Directory**: `docs/04_storyboards` 생성.
*   **File Migration**: 기존 `docs/02_specs/`에 있던 스토리보드 3종을 이동.
    *   `SB_01_Employee_Portal.md`
    *   `SB_02_Admin_Console.md`
    *   `SB_03_Global_Admin.md`
*   **Index Creation**: `docs/04_storyboards/README.md` 생성하여 스토리보드 목록 및 담당 역할 정의.

### 2.2 누락된 스토리보드 식별 (To-Be)
IA 분석 결과, 다음 모듈에 대한 상세 UI 정의가 부족함을 확인하고 향후 작성 계획을 수립함.

1.  **SB-04 Payroll Service**: 급여 명세서 및 대장 관리.
2.  **SB-05 Performance**: 인사 평가 프로세스.
3.  **SB-06 Recruitment**: 채용 공고 및 지원자 관리.
4.  **SB-07 Assets**: 자산 신청 및 재고 관리.
5.  **SB-08 Settings**: 시스템 정책 및 보안 설정.

## 3. 결론
스토리보드 문서를 별도 디렉토리로 격리하여 관리 편의성을 높였으며, 향후 추가되어야 할 스펙의 범위를 명확히 함.
