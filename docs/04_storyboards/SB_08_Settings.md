# StoryBoard: 설정 및 정책 (SB-08)

## 0. 개요
본 문서는 시스템의 동작 방식을 제어하는 정책(Policy)과 보안 설정(Security)을 관리하는 **Settings** 화면을 정의한다.
관련 명세서: `SPEC_06_Policy_Engine.md`

---

## **1. SCR-SET-01: 정책 설정 (Policy Rules)**

### **1.1 개요**
*   **목적**: 휴가 발생 기준, 근무 시간 규칙 등 HR 정책 변수를 설정한다.
*   **사용자**: Tenant Admin
*   **연결 Spec**: `SPEC_06`

### **1.2 레이아웃**
*   **Tabs**: [일반(General)] | [근태(Time)] | [휴가(Vacation)] | [보안(Security)]
*   **Form Items (휴가 예시)**:
    *   회계년도 기준일: (1월 1일 / 입사일 기준) 라디오 버튼.
    *   1년 미만자 월차 발생 여부: Toggle.
    *   자동 이월 허용 여부: Toggle.

### **1.3 인터랙션**
*   **Audit Trail**: 설정 변경 시 "변경 사유" 입력 필수 -> 감사 로그(`SCR-GLB-03`)에 기록.

---

## **2. SCR-SET-02: 권한 및 역할 관리 (RBAC)**

### **2.1 개요**
*   **목적**: 사용자 역할(Role)별 접근 권한을 미세 조정한다.
*   **사용자**: Tenant Admin (Advanced), Super Admin
*   **연결 Spec**: `SPEC_06`

### **2.2 레이아웃**
*   **Role List**: `User`, `Leader`, `HR Admin`, `Finance Admin`, `Tenant Admin`.
*   **Permission Matrix**:
    *   Row: Resource (User, Dept, Doc, Salary...)
    *   Col: Action (Read, Write, Delete, Approve)
    *   Cell: Checkbox.
*   **Scope Rule Definition**:
    *   각 Role별 조회 범위(`Data Scope`) 설정 (My / Team / Company).

---

## **3. SCR-SET-03: IP 접근 제어 (Access Control)**

### **2.1 개요**
*   **목적**: 관리자 페이지 등 민감 리소스에 대한 IP Whitelist를 관리한다.
*   **사용자**: Tenant Admin (Security)
*   **연결 Spec**: `SPEC_06`

### **2.2 레이아웃**
*   **IP List**: 허용된 IP 대역(CIDR) 목록.
*   **Add Form**: IP Address, Description(예: 서울 본사 VPN).
*   **Policy Toggle**: "관리자 콘솔 접속 시 IP 제한 강제 적용" (On/Off).

