# 유지보수 및 로드맵 업데이트 계획 (Maintenance & Roadmap Update Plan)

## 1. 개요 (Overview)
* **목적**: 현재 프로젝트 진행 상황(Level 1 ~ 14)을 점검하고, 기술 정의서(Technical Specification) 및 데이터베이스 설계서(DB Specification)에 기반하여 다음 단계의 개발 업무를 식별 및 우선순위화 한다.
* **범위**: 문서 분석, 코드 베이스 점검, RoadMap(HISTORY_INDEX) 업데이트.

## 2. 현황 분석 (Current Status Analysis)
* **완료된 기능 (Level 1 ~ 14)**:
    * 인프라 (Docker, DB, Redis, MailHog)
    * 백엔드 코어 모듈 (User, Org, Tenant, Policy, Approval, Vacation, Attendance, Payroll)
    * 프론트엔드 통합 (Next.js, UI Components, Auth, Hooks)
    * 기타 (Security 강화, DB 스키마 동기화)
* **미구현/누락 사항 (Identified Gaps)**:
    1.  **Frontend Storybook**: 기술 정의서 4.2 및 4.3항에 명시된 필수 도구이나 현재 설정 및 파일 부재.
    2.  **Evaluations (인사평가) 모듈**: DB 설계서 "4. Future Implementations"에 계획됨.
    3.  **Assets (자산관리) 모듈**: DB 설계서 "4. Future Implementations"에 계획됨.
    4.  **Backend Custom Module**: 기술 정의서 3.4항(Multi-Tenancy)에 명시된 테넌트별 격리 로직(`modules/custom`) 부재.

## 3. 추진 계획 (Proposed Roadmap)
다음과 같이 단계별 업무를 제안하고 `00_HISTORY_INDEX.md`에 등록한다.

### **Level 15: Frontend Storybook 구축 (Quality Assurance)**
*   **이유**: 기술 정의서 준수 및 UI 컴포넌트 문서화, 개발 생산성 향상.
*   **주요 작업**:
    *   Storybook 설치 및 설정.
    *   기존 UI 컴포넌트(`shared/ui`)에 대한 Story 파일 작성.

### **Level 16: Evaluations (인사평가) 모듈 개발 (Feature Expansion)**
*   **이유**: HR 시스템의 핵심 기능 중 하나로 DB 설계서에 계획됨.
*   **주요 작업**:
    *   Backend: Evaluations 모듈(Entity, Service, Controller, DDL) 구현.
    *   Frontend: 평가 계획, 자기평가, 평가자 리뷰 화면 구현.

### **Level 17: Assets (자산관리) 모듈 개발 (Feature Expansion)**
*   **이유**: 임직원 지급 장비(노트북, 모니터 등) 관리 기능.
*   **주요 작업**:
    *   Backend: Assets 모듈 구현.
    *   Frontend: 자산 등록,불출,반납 관리 화면.

## 4. 검증 계획 (Verification Plan)
*   분석 결과가 기술 정의서 및 DB 설계서와 일치하는지 확인.
*   사용자(User) 승인 후 `00_HISTORY_INDEX.md` 업데이트.
