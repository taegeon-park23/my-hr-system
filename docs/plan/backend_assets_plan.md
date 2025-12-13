# 자산 관리 모듈 구현 계획 (Assets Module Implementation Plan)

## 1. 개요 (Overview)
* **목표**: 회사 소유의 자산(노트북, 모니터, 소프트웨어 라이선스 등)을 등록하고 임직원에게 할당/회수하는 수명 주기를 관리한다.
* **범위**: DB 스키마 설계 및 구현, 자산 CRUD 및 상태 변경 로직, REST API 개발.
* **주요 기능**: 자산 등록, 수정, 사용자 할당(Assign), 반납(Unassign/Return), 상태 관리(수리, 폐기 등).

## 2. 데이터베이스 설계 (Database Schema Design)
다음과 같이 `assets` 및 이력 관리를 위한 `asset_histories` 테이블을 신규 생성한다.

### 2.1 `assets` (자산 마스터)
```sql
CREATE TABLE assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    current_user_id BIGINT NULL COMMENT '현재 사용자 (NULL이면 미사용)',
    
    category ENUM('LAPTOP', 'DESKTOP', 'MONITOR', 'ACCESSORY', 'SOFTWARE', 'FURNITURE', 'OTHER') NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(255) NULL,
    
    purchase_date DATE NULL,
    purchase_price DECIMAL(15,2) DEFAULT 0,
    
    status ENUM('AVAILABLE', 'ASSIGNED', 'BROKEN', 'REPAIRING', 'DISCARDED') NOT NULL DEFAULT 'AVAILABLE',
    note TEXT NULL COMMENT '비고 (상세 스펙 등)',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_asset_serial (company_id, serial_number), -- 회사 내 시리얼 중복 방지
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (current_user_id) REFERENCES users(id)
) ENGINE=InnoDB COMMENT='자산 정보';
```

### 2.2 `asset_histories` (자산 변경 이력) - Optional (High Complexity check)
*이번 단계에서는 필수 요구사항이 아니면 생략하고, 추후 고도화 시 추가한다.* (현재는 기본 `assets` 테이블 위주로 구현)

## 3. 구현 상세 (Implementation Steps)

### Step 1: 모듈 구조 생성 및 Entity 구현
*   **패키지**: `com.hr.modules.asset` 생성.
*   **파일**:
    *   `domain/Asset.java` (Entity)
    *   `repository/AssetRepository.java` (JPA)

### Step 2: 비즈니스 로직 (Service) 구현
*   **AssetService**:
    *   `registerAsset()`: 자산 신규 등록.
    *   `assignAsset(assetId, userId)`: 자산을 특정 직원에게 할당 (Status -> ASSIGNED).
    *   `returnAsset(assetId)`: 자산 회수 (Status -> AVAILABLE).
    *   `updateStatus(assetId, status)`: 수리/폐기 등 상태 변경.

### Step 3: API 컨트롤러 구현
*   **AssetAdminController** (`/api/admin/assets`):
    *   자산 목록 조회 (필터링: 카테고리, 상태, 사용자).
    *   자산 등록/수정/삭제.
    *   할당 및 반납 처리.
*   **AssetController** (`/api/assets`):
    *   `getMyAssets()`: 로그인한 사용자가 현재 보유 중인 자산 조회.

### Step 4: 통합 및 문서화 (Integration & Documentation)
*   **데이터베이스 설계 정의서 업데이트**:
    *   `docs/01_core/데이터베이스 설계 정의서 (Database Design Specification).md`의 "4. Future Implementations" 섹션에서 `assets` 테이블 제거.
    *   "3.6 자산 관리 모듈 (Assets)" 섹션을 신설하고 상세 DDL 및 설명 추가.
*   **초기화 스크립트 업데이트**:
    *   `init.sql`의 최하단에 `assets` 테이블 생성 구문(DDL) 추가.
    *   `maintenance_db_schema_sync_plan.md`의 원칙에 따라, 문서와 코드가 100% 일치하도록 검수.

## 4. 검증 시나리오 (Verification)
1.  **Schema Sync**: `init.sql`, `Database Design Specification.md`, 그리고 실제 `Compnay` 엔티티 코드가 일치하는지 정적 분석.
2.  **Schema**: `init.sql` 실행 시 에러 없이 `assets` 테이블 생성 확인.
3.  **Flow**:
    *   관리자가 'MacBook Pro' 자산 등록.
    *   초기 상태 'AVAILABLE' 확인.
    *   User A에게 할당 -> 상태 'ASSIGNED', `current_user_id` 설정 확인.
    *   AssetController를 통해 User A가 자신의 자산 목록에서 해당 장비 확인.
    *   반납 처리 -> 상태 'AVAILABLE', `current_user_id` NULL 확인.

## 5. 예상 소요 (Estimated Effort)
*   총 10~12 Tools Steps 예상.
