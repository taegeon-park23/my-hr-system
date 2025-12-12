# Phase 2: Policy Module (권한 제어) 구현 - 완료 보고

## **1. 개요 (Summary)**
시스템의 보안과 데이터 접근 제어를 담당하는 **Policy Module (PDP: Policy Decision Point)** 을 구현했습니다. 본 모듈은 역할(Role) 기반의 정적 권한 뿐만 아니라, 부서 트리와 임시 접근권(Ticket)을 활용한 동적 데이터 스코프(DataScope)를 계산합니다.

## **2. 구현 내역 (Implemented Features)**

### **A. Policy Module (`backend/modules/policy`)**
*   **Domain:** `AccessGrant`
    *   임시 접근 권한을 저장하는 테이블 (`access_grants`)
    *   `expiration_time`을 통한 만료 관리
*   **Service:** `PolicyService` (PDP)
    *   **DataScope Resolution:**
        *   `SUPER_ADMIN`: `GLOBAL_ALL` (전체 접근)
        *   `TENANT_ADMIN`: `COMPANY_WIDE` (자사 데이터 전체)
        *   `DEPT_MANAGER`: `DEPT_TREE` (본인 하위 부서 포함)
        *   `USER`: `USER_ONLY` (본인 데이터만)
    *   **RBAC Check:** `hasPermission` 메서드
*   **API:** `PolicyModuleApi`
    *   타 모듈(예: 조회 쿼리)에서 `resolveDataScope`를 호출하여 WHERE 절을 동적으로 생성할 수 있도록 지원.

### **B. Dependencies**
*   User Module 및 Org Module의 API를 호출하여, 현재 사용자의 역할과 조직 구조를 파악한 후 권한을 판단합니다.

## **3. 향후 계획 (Next Steps)**
*   이로써 **Phase 2 (핵심 모듈)** 구현이 모두 완료되었습니다.
*   다음 단계인 **Phase 3 (비즈니스 도메인 - Approval, Vacation)** 구현을 통해 실제 HR 기능을 개발할 준비가 되었습니다.
