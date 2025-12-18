# **심층 요구사항 명세서: 자산 관리 시스템 (SPEC-10)**

## **0. 문서 이력 (Version History)**

| 버전 | 일자 | 작성자 | 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-12-18 | System | 최초 작성 | 자산 수명주기 및 퇴사 연동 로직 정의 |

## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 노트북, 모니터, 소프트웨어 라이선스 등 회사의 **물리적/디지털 자산(Asset)**을 관리하는 기능을 정의한다.
특히 입사 시 지급 프로세스와 퇴사 시 반납(Check-in) 프로세스를 자동화하여 자산 유실을 방지하는 것을 목표로 한다.

### **1.2 범위**
* **자산 등록:** 시리얼 넘버, 모델명, 구매일 등 메타데이터 관리.
* **할당(Assign):** 사용자에게 자산 지급 (책임자 매핑).
* **반납(Return):** 자산 회수 및 상태(정상/파손/분실) 기록.

---

## **2. 핵심 결정 테이블 (Decision Table)**

### **2.1 자산 할당 상태 전이**

| 현재 상태 | 이벤트 | 조건 | **다음 상태** | 액션 |
| :--- | :--- | :--- | :--- | :--- |
| **AVAILABLE** | `assign()` | 사용자 유효 | **ASSIGNED** | 이력(AssetHistory) 생성 |
| **ASSIGNED** | `return()` | 정상 반납 | **AVAILABLE** | 반납 확인 서명 |
| **ASSIGNED** | `reportLost()` | 분실 신고 | **LOST** | 배상 절차 진행 |
| **ASSIGNED** | `reportBroken()` | 파손 신고 | **REPAIRING** | 수리 요청 |
| **REPAIRING** | `repairComplete()` | 수리 완료 | **AVAILABLE** | 재고 등록 |
| **REPAIRING** | `discard()` | 수리 불가 | **DISCARDED** | 폐기 처리 |

---

## **3. 핵심 로직 의사 코드 (Pseudo-code)**

### **3.1 퇴사자 자산 회수 확인 (`checkOffboardingAssets`)**

```java
FUNCTION CheckOffboardingAssets(userId)
    // 1. 미반납 자산 조회
    assignedAssets = assetRepository.findByOwner(userId)
    
    IF assignedAssets.isEmpty() THEN
        RETURN { status: CLEARED, pendingItems: [] }
    END IF
    
    // 2. 반납 필요 목록 생성
    pendingList = []
    FOR asset IN assignedAssets:
        pendingList.add({
            assetId: asset.id,
            name: asset.model_name,
            serial: asset.serial_number,
            assignedDate: asset.assigned_date
        })
        
    // 3. 퇴사 프로세스 차단 플래그 반환
    RETURN { 
        status: BLOCKED, 
        message: "Must return " + pendingList.size() + " assets.",
        pendingItems: pendingList
    }
END FUNCTION
```

---

## **4. 엣지 케이스 및 예외 처리**

| 상황 | 설명 | 처리 방침 |
| --- | --- | --- |
| **공용 자산** | 회의실 TV 등 특정 개인에게 할당되지 않는 자산 | `Place` 또는 `Department`를 소유주로 지정하여 관리. |
| **소모품 관리** | 마우스, 키보드 등 저가 소모품 | 개별 시리얼 관리 대신 **수량 관리(Quantity)** 로직 적용 고려. (현재는 개별 관리 원칙) |
| **임시 대여** | 1시간 빌려 쓰는 경우 | 별도 대여(Rent) 모델이 아닌, 짧은 할당/반납으로 처리. |

## **5. 데이터 모델 참조**

* **Asset:** `id`, `category` (Laptop, Monitor...), `serial_number`, `status`, `owner_id`
* **AssetHistory:** `asset_id`, `user_id`, `action` (ASSIGN/RETURN), `date`, `note`
