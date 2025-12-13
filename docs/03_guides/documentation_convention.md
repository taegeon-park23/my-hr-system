# Documentation & work Process Convention (문서화 및 작업 절차 규약)

## 1. 개요 (Overview)
본 문서는 프로젝트의 문서 관리 체계와 AI 에이전트 작업 절차를 정의한다. 모든 작업은 이 규약에 따라 계획(Plan), 수행(Implementation), 검증(Verification) 단계로 나뉘며, 각 단계별 산출물은 지정된 위치에 한국어로 작성되어야 한다.

## 2. 문서화 구조 (Documentation Structure)
`docs/` 폴더 내에 아래와 같은 카테고리로 분류하여 관리한다.

### 2.1 카테고리 (Categories)
- **01_core**: 프로젝트의 핵심 아키텍처, 기술 정의, DB 설계, 정책 등 변하지 않는 진실(Source of Truth).
- **02_specs**: PRD, 요구사항 등 기획 문서.
- **03_guides**: 운영 가이드, 컨벤션 가이드, 용어 사전 등 참고 문서.
- **04_admin**: 프로젝트 관리 및 로드맵 문서.
- **plan**: 작업 시작 전 단계에서 작성하는 구체적인 계획 문서.
- **done**: 작업 완료 후 검증 결과와 변경 사항을 기록한 완료 보고서.

## 3. 작업 절차 (Workflow Protocol)

### Phase 1: 계획 수립 (Planning)
- **Plan 문서 작성:**
    - 작업 시작 전, 반드시 `docs/plan/` 폴더에 계획 문서를 작성한다.
    - **파일이름:** `{category}_{task_name}_plan.md` (예: `backend_user_refactor_plan.md`)
    - **언어:** 반드시 **한국어**로 작성한다.
    - **필수 포함 내용:**
        - 분석 내용 (Analysis)
        - 변경 범위 (Scope)
        - 상세 구현 계획 (DB 스키마, API 명세 등)
        - 검증 전략 (Verification Strategy)
- **History Index 등록:**
    - `docs/00_HISTORY_INDEX.md`의 "Level 6: Ongoing Analysis" 또는 적절한 섹션에 Plan 문서를 등록한다.

### Phase 2: 구현 (Implementation)
- 승인된 Plan 문서에 따라 코드를 작성한다.
- Modular Monolith 및 FSD 아키텍처 원칙을 엄수한다.

### Phase 3: 완료 및 검증 (Verification & Reporting)
- **Done 문서 작성:**
    - 작업 완료 및 검증 후, `docs/done/` 폴더에 완료 보고서를 작성한다.
    - **파일이름:** `{original_plan_name}_report.md` 또는 `{task_name}_report.md`
    - **언어:** 반드시 **한국어**로 작성한다.
    - **필수 포함 내용:**
        - 수행한 작업 요약
        - 주요 변경 코드 설명
        - 검증 결과 (테스트 성공 로그 등)
        - Plan 대비 변경 사항 (있는 경우)
- **History Index 업데이트:**
    - `docs/00_HISTORY_INDEX.md`에서 해당 Plan의 Status를 `✅ Completed`로 변경하고, `Execution Reports`에 Done 문서를 링크한다.

### Phase 4: 커밋 및 푸시 (Commit & Push)
- 문서 작성이 완료되면 반드시 Git Commit 및 Push를 수행한다.
- **Commit Message Convention:**
    - `docs: add plan for user refactor`
    - `feat: implement user module structure`
    - `docs: add report for user refactor`
