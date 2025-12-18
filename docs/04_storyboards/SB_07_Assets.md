# StoryBoard: 자산 관리 (SB-07)

## 0. 개요
본 문서는 사내 자산(디바이스)의 재고 관리와 불출/반납 프로세스를 처리하는 **Asset Management** 화면을 정의한다.
관련 명세서: `SPEC_10_Asset_Management.md`

---

## **1. SCR-AST-01: 자산 재고 관리 (Inventory)**

### **1.1 개요**
*   **목적**: 전체 자산 목록을 조회하고 상태를 업데이트한다.
*   **사용자**: Asset Admin (GA)
*   **연결 Spec**: `SPEC_10`

### **1.2 레이아웃**
*   **Search**: 시리얼 넘버, 모델명, 사용자 이름 검색.
*   **Filter**: `Available` | `Assigned` | `Repairing` | `Lost` | `Discarded`
*   **Data Grid**:
    *   자산 태그 | 종류 | 모델명 | 시리얼 | **상태** | **사용자** | 할당일
*   **Action**: [신규 등록], [바코드 스캔(Mobile)]

### **1.3 인터랙션**
*   **할당(Assign)**: `Available` 자산 선택 -> "사용자 지정" -> 사원 검색 모달 -> 할당 완료.
*   **반납(Return)**: `Assigned` 자산 선택 -> "반납 처리" -> 상태 검수(정상/파손) 체크 -> 완료.

---

## **2. SCR-AST-02: 내 자산 현황 (My Devices)**

### **2.1 개요**
*   **목적**: 현재 내가 보유 중인 장비를 확인하고 이상 신고를 접수한다.
*   **사용자**: All Employees
*   **연결 Spec**: `SPEC_10`

### **2.2 레이아웃**
*   **Asset Card List**:
    *   이미지, 모델명, 지급일, 시리얼 넘버.
*   **Action Buttons**:
    *   [수리 신청]: 파손 시 Admin에게 알림.
    *   [분실 신고]: 분실 시 절차 안내 팝업.

### **2.3 인터랙션**
*   **퇴사 시 체크**: 퇴사 프로세스 진입 시 이 화면의 자산이 모두 반납(`Returned`) 처리되어야 함을 안내 (`CheckOffboardingAssets`).

