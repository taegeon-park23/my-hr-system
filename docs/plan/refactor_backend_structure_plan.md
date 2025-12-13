# 백엔드 구조 정규화 및 모듈 분리 계획 (Backend Structure Normalization Plan)

## 1. 개요 (Overview)
*   **목표:** `Project_Technical_Definition.md`의 아키텍처 원칙에 위배되어 메인 소스 트리(`backend/src`)에 구현된 `evaluation`(인사평가) 및 `asset`(자산) 모듈을 표준 모듈 경로(`backend/modules/`)로 이동하고, 독립된 Gradle Subproject로 전환한다.
*   **배경:** 현재 두 모듈이 Root Project에 속해 있어 모듈 간 격리가 물리적으로 보장되지 않으며, 빌드 및 의존성 관리가 "Modular Monolith" 원칙(Strict Module Isolation)에 부합하지 않음.
*   **담당:** Google Antigravity Agent

## 2. 현황 분석 및 목표 (Current vs Target)

### 2.1 현재 상태 (AS-IS)
*   **위치:** `backend/src/main/java/com/hr/modules/evaluation`, `asset`
*   **빌드:** `backend/build.gradle` (Root)에 의존.
*   **문제점:**
    *   `src/main/java`에 모듈 코드가 섞여 있어 구조적 분리 불명확.
    *   Gradle 멀티 모듈의 이점(병렬 빌드, 의존성 제어) 활용 불가.
    *   `backend/modules/` 하위의 기존 모듈(`user`, `payroll` 등)과 일관성 결여.

### 2.2 목표 상태 (TO-BE)
*   **위치:** `backend/modules/evaluation`, `backend/modules/asset`
*   **빌드:** 각 모듈별 독립 `build.gradle` 보유.
*   **구조:**
    ```text
    backend/
    ├── modules/
    │   ├── evaluation/       # [MOVE & NEW]
    │   │   ├── build.gradle  # [NEW]
    │   │   └── src/main/java/com/hr/modules/evaluation/
    │   └── asset/            # [MOVE & NEW]
    │       ├── build.gradle  # [NEW]
    │       └── src/main/java/com/hr/modules/asset/
    ├── settings.gradle       # [UPDATE] include 추가
    └── app/
        └── build.gradle      # [UPDATE] 의존성 추가
    ```

## 3. 상세 작업 명세 (Detailed Execution Steps)

작업의 안전성을 위해 다음과 같이 단계를 세분화하여 진행한다.

### Step 1: 작업 환경 준비 (Preparation)
1.  **서비스 중지:** 파일 이동 간 충돌 방지를 위해 Docker 컨테이너(`hr-backend-dev`) 중지.
    *   Command: `docker-compose stop hr-backend-dev`
2.  **데이터 백업:** 소스 코드 안전을 위해 현재 상태 커밋 확인.

### Step 2: 디렉토리 구조 생성 (Scaffolding)
1.  **Evaluation 모듈:** `backend/modules/evaluation/src/main/java` 디렉토리 생성.
2.  **Asset 모듈:** `backend/modules/asset/src/main/java` 디렉토리 생성.

### Step 3: 소스 코드 이동 (Migration)
1.  **Evaluation 이동:**
    *   From: `backend/src/main/java/com/hr/modules/evaluation/*`
    *   To: `backend/modules/evaluation/src/main/java/com/hr/modules/evaluation/`
2.  **Asset 이동:**
    *   From: `backend/src/main/java/com/hr/modules/asset/*`
    *   To: `backend/modules/asset/src/main/java/com/hr/modules/asset/`
3.  **잔여 정리:** `backend/src/main/java/com/hr/modules` 하위의 빈 디렉토리 삭제.

### Step 4: Gradle 구성 (Configuration)
1.  **Evaluation 빌드 설정:** `backend/modules/evaluation/build.gradle` 생성.
    *   필요 의존성: `common` 모듈, `user` 모듈(API), JPA, Lombok 등.
2.  **Asset 빌드 설정:** `backend/modules/asset/build.gradle` 생성.
    *   필요 의존성: `common` 모듈, `user` 모듈(API), JPA, Lombok 등.
3.  **프로젝트 등록:** `backend/settings.gradle` 수정.
    *   `include 'modules:evaluation'`
    *   `include 'modules:asset'` 추가.
4.  **애플리케이션 의존성 연결:** `backend/app/build.gradle` 수정.
    *   `implementation project(':modules:evaluation')`
    *   `implementation project(':modules:asset')` 추가.

### Step 5: 의존성 및 컴파일 오류 수정 (Fix Dependencies)
1.  **패키지명 검증:** 이동 후 패키지 선언(`package com.hr.modules.evaluation...`)이 디렉토리 구조와 일치하는지 확인.
2.  **임포트 정리:** 모듈 분리로 인해 가시성이 변경된 클래스가 있는지 확인하고 수정. (Entity, Repository는 외부 노출 금지 원칙 준수)

### Step 6: 검증 (Verification)
1.  **빌드 테스트:** 로컬 환경에서 `./gradlew clean build` 수행하여 컴파일 및 테스트 통과 확인.
2.  **서버 기동:** `docker-compose up -d hr-backend-dev` 후 로그 확인.
3.  **API 테스트:** Swagger UI 접속하여 Evaluation, Asset 관련 API가 정상 노출되는지 확인.

## 4. 검증 계획 (Verification Plan)

| ID | 검증 항목 | 검증 방법 | 예상 결과 |
|:---:|:---:|:---|:---|
| V1 | 디렉토리 구조 | `ls -R backend/modules/` | evaluation, asset 폴더 존재 및 소스 확인 |
| V2 | 빌드 성공 | `./gradlew clean :modules:evaluation:build :modules:asset:build` | BUILD SUCCESS |
| V3 | 전체 통합 빌드 | `./gradlew clean build` | BUILD SUCCESS |
| V4 | 서버 기동 | Docker Log 조회 | "Started HrApplication..." 로그 출력 |
| V5 | 모듈 격리 | `depencies` task 확인 | 각 모듈이 불필요한 상호 의존성을 갖지 않음 |

## 5. 예상되는 위험 및 대응 (Risks & Mitigation)
*   **Risk:** 소스 이동 중 파일 유실. -> **Mitigation:** `cp` 대신 `mv` 사용하되, Git으로 복구 가능 상태 유지.
*   **Risk:** 순환 참조 발생(Circular Dependency). -> **Mitigation:** 공통 로직은 `common`으로, 참조는 `*ModuleApi` 인터페이스 활용. (기존 코드가 이미 분리되어 작성되었다고 가정하되, 문제 발생 시 즉시 리팩토링)
