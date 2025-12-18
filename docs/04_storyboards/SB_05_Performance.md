# StoryBoard: 성과 제 (SB-05)

## 0. 개요
본 문서는 성과 평가 시즌 설정부터 개인/동료/리더 평가를 수행하는 **Performance Evaluation** 모듈의 주요 화면을 정의한다.
관련 명세서: `SPEC_08_Performance_Evaluation.md`

---

## **1. SCR-PERF-01: 평가 시즌 관리 (Cycle Management)**

### **1.1 개요**
*   **목적**: 평가 일정 및 정책(가중치)을 설정한다.
*   **사용자**: Tenant Admin
*   **연결 Spec**: `SPEC_08`

### **1.2 레이아웃**
*   **Season List**: 연도별 평가 리스트 (2024 상반기, 2024 하반기).
*   **Detail Form**:
    *   **일정 설정**: 목표 수립 기간 | 본인 평가 기간 | 동료 평가 기간 | 리더 평가 기간.
    *   **가중치 설정**: 성과(Achievement) vs 역량(Competency) 비율 (Slider).
    *   **상태**: `Ready` -> `GoalSetting` -> `Evaluation` -> `Calibration` -> `Closed`.

---

## **2. SCR-PERF-02: 목표 수립 (Goal Setting)**

### **2.1 개요**
*   **목적**: 개인의 KPI/OKR을 수립하고 승인을 요청한다.
*   **사용자**: All Employees
*   **연결 Spec**: `SPEC_08`

### **2.2 레이아웃**
*   **Goal List**:
    *   항목: 목표명, 상세 내용, 가중치(%), 측정 지표.
    *   Add Row 버튼으로 동적 추가.
*   **Total Weight Check**: 모든 목표의 가중치 합이 100%가 되어야 제출 버튼 활성화.

### **2.3 인터랙션**
*   **승인 요청**: "제출하기" -> 리더의 결재함(`SCR-EMP-04`)으로 연동.

---

## **3. SCR-PERF-03: 평가 작성 (Evaluation Form)**

### **3.1 개요**
*   **목적**: 본인, 동료, 부하 직원을 다면 평가한다.
*   **사용자**: All Employees
*   **연결 Spec**: `SPEC_08`

### **3.2 레이아웃**
*   **Target Selector**: 평가 대상 목록 (Left Sidebar).
*   **Form Area (Right)**:
    *   **성과 평가 (Achievement)**: 수립된 목표 리스트별 달성도 점수(1~5점) 및 코멘트.
    *   **역량 평가 (Competency)**: 공통 역량 항목(협업, 리더십 등) 점수 체크.
    *   **종합 의견**: 강점/보완점 서술형 입력.

### **3.3 인터랙션**
*   **Auto Save**: 작성 중 내용 자동 저장.
*   **Blind**: 동료 평가는 익명성이 보장됨을 UI에 명시.

---

## **4. SCR-PERF-04: 등급 조정 (Calibration)**

### **4.1 개요**
*   **목적**: 부서장이 팀원들의 평가 점수를 기반으로 최종 등급을 시뮬레이션하고 확정한다.
*   **사용자**: Department Leader
*   **연결 Spec**: `SPEC_08`

### **4.2 레이아웃**
*   **Scatter Plot**: X축(성과), Y축(역량)으로 팀원 분포 시각화.
*   **Grade Distribution**:
    *   S/A/B/C/D 등급별 인원 수 및 비율 표시.
    *   `SPEC_08`의 권장 비율 가이드라인(Soft Limit) 표시.
*   **Member List**:
    *   자동 산출된 점수 및 가등급 표시.
    *   Dropdown으로 등급 수동 조정 가능 (조정 사유 입력 필수).

