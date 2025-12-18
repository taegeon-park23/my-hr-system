# StoryBoard: 채용 시스템 (SB-06)

## 0. 개요
본 문서는 채용 공고 관리부터 지원자 파이프라인, 면접 평가를 포괄하는 **Recruitment System** (ATS) 화면을 정의한다.
관련 명세서: `SPEC_09_Recruitment.md`

---

## **1. SCR-REC-01: 공고 및 지원자 현황 (Recruitment Kanban)**

### **1.1 개요**
*   **목적**: 채용 프로세스 전반을 시각적으로 관리한다.
*   **사용자**: HR Manager, Interviewer
*   **연결 Spec**: `SPEC_09`

### **1.2 레이아웃**
*   **Job Filtering**: 공고별 보기 (Dropdown).
*   **Kanban Board (Drag & Drop)**:
    *   Cols: `Applied` | `Screening` | `Interview 1` | `Interview 2` | `Offer` | `Hired`
    *   **Card**: 지원자 이름, 경력(년차), 최종 갱신일.
*   **Stats Bar**: 단계별 인원 수 요약.

### **1.3 인터랙션**
*   **Card Click**: `SCR-REC-02` (지원자 상세) 오픈 (Drawer).
*   **Move Card**: 카드를 다음 단계 컬럼으로 드래그 시 상태 변경 이벤트 발생.
    *   `Interview` 단계 진입 시: 면접관 배정 모달 팝업.
    *   `Hired` 단계 진입 시: `Offer` 수락 확인 모달.

---

## **2. SCR-REC-02: 지원자 상세 및 평가 (Applicant Detail)**

### **2.1 개요**
*   **목적**: 이력서를 검토하고 면접 결과를 기록한다.
*   **사용자**: Interviewer, HR
*   **연결 Spec**: `SPEC_09`

### **2.2 레이아웃**
*   **Left (Resume Viewer)**:
    *   PDF 미리보기 또는 파싱된 텍스트 정보.
*   **Right (Action & Log)**:
    *   **Evaluation Form**: 항목별 점수, 합불 의견(Pass/Fail), 코멘트.
    *   **History**: 단계별 이동 이력, 메일 발송 이력 타임라인.

### **2.3 인터랙션**
*   **온보딩 전환**: 최종 합격(`Hired`) 상태에서 "임직원 전환" 버튼 활성화 -> `SPEC_09`의 `convertToEmployee` 로직 실행.

---

## **3. SCR-REC-03: 채용 공고 관리 (Job Postings)**

### **3.1 개요**
*   **목적**: 채용 공고를 작성, 게시, 마감한다.
*   **사용자**: HR Manager
*   **연결 Spec**: `SPEC_09`

### **3.2 레이아웃**
*   **List**: 공고명, 부서, 마감일, 상태(Open/Closed), 조회수, 지원자수.
*   **Editor**: JD(Job Description) 작성을 위한 Rich Text Editor.

