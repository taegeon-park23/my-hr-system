# Phase 2: User & Org Module 구현 - 완료 보고

## **1. 개요 (Summary)**
인사 시스템의 핵심 주체인 **User (사용자)** 와 **Organization (조직/부서)** 모듈을 구현했습니다. 이들은 타 모듈(결재, 급여 등)에서 공통적으로 참조하는 핵심 마스터 데이터를 관리합니다.

## **2. 구현 내역 (Implemented Features)**

### **A. User Module (`backend/modules/user`)**
*   **Domain:** `User`
    *   `company_id`, `dept_id`를 통한 소속 관계 정의
    *   `employee_number`, `role` (ENUM) 등 핵심 인사 정보 포함
    *   회사별 사번 중복 방지 로직 적용
*   **Service:** `UserService`
    *   사용자 생성 및 조회
    *   부서별 사용자 목록 조회
*   **Module API:** `UserModuleApi`
    *   `getUserInfo(userId)`: 타 모듈에 사용자 핵심 정보 제공
    *   `validateUserInTenant`: 테넌트 검증 로직 제공

### **B. Organization Module (`backend/modules/org`)**
*   **Domain:** `Department`
    *   **계층 구조:** `parent_id`, `depth`, `path_string` (Ancestor Path) 지원
    *   재귀 쿼리 없이도 하위 조직 탐색이 가능하도록 `path_string` 컬럼 설계 반영
*   **Service:** `DepartmentService`
    *   부서 생성 시 `depth`와 `path_string` 자동 계산 로직 구현
*   **Module API:** `OrgModuleApi`
    *   `getSubDeptIds`: 하위 부서 ID 목록 반환 (권한 스코프 계산용)
    *   `getDeptLeaderId`: 부서장 정보 반환 (결재선 생성용)

## **3. 기술적 특징**
*   **Module Separation:** 두 모듈은 서로 직접 참조하지 않으며, 필요 시 `ModuleApi`를 통해 통신하거나 상위 서비스(Facade)에서 조합됩니다.
*   **JPA Auditing:** 생성일/수정일 자동화 적용.

## **4. 향후 계획 (Next Steps)**
*   **Phase 2 - Policy Module:** 권한 제어(DataScope) 구현을 통해 `User.role`과 `Dept` 정보를 활용한 동적 권한 처리 로직 완성 필요.
