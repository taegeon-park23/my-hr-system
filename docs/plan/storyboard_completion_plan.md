# Storyboard Completion Plan (SB-Completion)

## 1. 개요
Gap Analysis 결과 식별된 누락 스토리보드(SB-04 ~ SB-08)를 작성하여 문서화 커버리지를 100%로 달성합니다.
이 계획은 `docs/done/docs_storyboard_gap_analysis_report.md`의 후속 조치입니다.

## 2. 작업 상세 (New Storyboards)

### Phase 1: Core HR Modules & Assets
다음 모듈에 대한 상세 UI 명세(Storyboard)를 작성합니다.

#### [NEW] `docs/04_storyboards/SB_04_Payroll.md`
- **Scope**: `SPEC_03 Payroll Calculation`
- **Screens**:
  - 급여 대장 조회 및 확정 (Admin)
  - 급여 명세서 조회 (User)
  - 퇴직금 정산 시뮬레이션

#### [NEW] `docs/04_storyboards/SB_05_Performance.md`
- **Scope**: `SPEC_08 Performance Evaluation`
- **Screens**:
  - 평가 시즌 생성 및 설정 (Admin)
  - 자기 평가 및 동료 평가 작성 (User)
  - 평가 취합 및 등급 조정 (Manager)

#### [NEW] `docs/04_storyboards/SB_07_Assets.md`
- **Scope**: `SPEC_10 Asset Management`
- **Screens**:
  - 자산 재고 관리 (Admin)
  - 자산 불출/반납 신청 (User)

### Phase 2: Operations & Recruitment

#### [NEW] `docs/04_storyboards/SB_06_Recruitment.md`
- **Scope**: `SPEC_09 Recruitment`
- **Screens**:
  - 채용 공고 관리 (Admin)
  - 지원자 칸반 보드 (Admin/Interviewer)
  - 면접 일정 관리

#### [NEW] `docs/04_storyboards/SB_08_Settings.md`
- **Scope**: `SPEC_06 Policy Engine`
- **Screens**:
  - 휴가/근태 정책 설정 (Policy Rules)
  - 보안 설정 (IP Whitelist, Password Policy)
  - 알림 및 감사 설정

## 3. 검증 계획
- **링크 검증**: 각 스토리보드가 `SPEC` 문서를 올바르게 참조하고 있는지 확인.
- **일관성 검증**: 기존 `SB-01`, `SB-02`와 포맷(Markdown 구조) 및 디자인 시스템 준수 여부 확인.
- **색인 업데이트**: `docs/04_storyboards/README.md`의 `To-Be` 섹션을 `Done`으로 업데이트.
