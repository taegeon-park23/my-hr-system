# Storybook 호환성 해결 계획 (Compatibility Resolution Plan)

## 1. 문제 분석 (Problem Analysis)
*   **환경 제약**:
    *   Node.js: v20.15.0 (Storybook 10+은 v20.19+ 필요).
    *   Next.js: v16.0.10 (현재 프로젝트 버전).
    *   Storybook: v8.x (Node 20.15와 호환되지만, Next.js 16을 공식 지원하지 않음 - Peer Dep Conflict).
*   **원인**: Storybook 8의 `@storybook/nextjs` 패키지는 `next@^15.0.0`까지만 Peer Dependency로 정의하고 있음.

## 2. 해결 방안 (Proposed Solution)
*   **전략**: **npm `overrides`** 기능을 사용하여 강제 호환성 확보.
*   **이유**:
    *   Node.js 업그레이드는 사용자 환경에 의존하므로 즉시 해결 불가.
    *   Next.js 다운그레이드는 프로젝트 스펙 변경이므로 지양.
    *   Storybook 8과 Next.js 16은 대부분의 API가 호환되므로, Peer Dependency 경고를 무시하고 강제로 연결하는 것이 가장 현실적인 대안.

## 3. 작업 상세 (Implementation Steps)

### 3.1 `package.json` 수정
*   **Overrides 설정**: `next` 패키지의 버전을 프로젝트 루트의 버전(`$next`)으로 강제한다.
    ```json
    "overrides": {
      "@storybook/nextjs": {
        "next": "$next"
      }
    }
    ```
*   **의존성 정리**: 앞서 수동으로 추가했던 Storybook 8 관련 패키지들을 유지하거나 정리.

### 3.2 설치 및 검증
*   `npm install` 재실행 (Overrides 적용).
*   `npm run storybook` 실행하여 정상 구동 확인.

## 4. 검증 계획 (Verification)
1.  `npm install`이 에러 없이 완료되어야 함.
2.  Storybook 초기 화면(http://localhost:6006)이 떠야 함.
