# **심층 요구사항 명세서: 조직 관리 시스템 (SPEC-04)**

## **0. 문서 이력 (Version History)**

| 버전 | 일자 | 작성자 | 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-12-18 | System | 최초 작성 | 부서 트리 구조 및 이동 로직 정의 |

## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 HR 시스템의 근간이 되는 **조직(Organization) 및 사용자(User)** 관리 모듈의 데이터 구조와 로직을 정의한다.
무제한 계층 구조를 지원하는 부서 트리와 이에 종속된 사용자의 이동, 겸직, 리더십 관리 규칙을 명세한다.

### **1.2 범위**
* **부서(Department):** 계층형 구조(Tree), 경로 문자열(Path String) 동기화.
* **사용자(Employee):** 부서 소속 변경(Transfer), 직책(Job Title) 및 직위(Position) 관리.
* **리더십(Leadership):** 부서장 지정 및 변경 로직.

---

## **2. 데이터 무결성 규칙 (Integrity Rules)**

### **2.1 부서 이동 및 경로 동기화 결정 테이블**

부서 이동 시 하위 부서의 경로 문자열(`path_string`)까지 재귀적으로 업데이트해야 한다.

| 규칙 ID | 조건 1: 상위 부서 변경 | 조건 2: 하위 부서 존재 | **동작 1: 본인 Path 업데이트** | **동작 2: 하위 부서 Path 업데이트** | **비고** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ORG-R1** | Yes | No | **Update** | - | 단순 이동 |
| **ORG-R2** | Yes | Yes | **Update** | **Cascade Update** | 하위 트리 전체 갱신 (비동기 권장) |
| **ORG-R3** | No (이름 변경) | Yes | **Update** | **Cascade Update** | 부서명 변경 시에도 Path 갱신 필요 |

### **2.2 사용자 부서 이동 제약 로직 (Truth Table)**

| 케이스 ID | 조건 1: 대상 부서 존재 | 조건 2: 대상 부서 활성 상태 | 조건 3: 현재 리더 아님 | **결과 (Result)** | **에러 메시지** |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **USR-TC1** | True | True | True | **성공 (Pass)** | - |
| **USR-TC2** | False | - | - | **실패 (Fail)** | "존재하지 않는 부서입니다." |
| **USR-TC3** | True | False | - | **실패 (Fail)** | "폐쇄된 부서로는 이동할 수 없습니다." |
| **USR-TC4** | True | True | False | **실패 (Fail)** | "현재 부서장입니다. 리더 위임 후 이동 가능합니다." |

---

## **3. 핵심 로직 의사 코드 (Pseudo-code)**

### **3.1 부서 경로 동기화 (`syncPathString`)**

```java
FUNCTION UpdateDepartment(deptId, newParentId, newName)
    dept = repository.findById(deptId)
    oldPath = dept.path_string
    
    // 1. 새로운 경로 계산
    IF newParentId IS NOT NULL THEN
        parent = repository.findById(newParentId)
        newPath = parent.path_string + ">" + newName
    ELSE
        newPath = newName // 최상위 부서
    END IF
    
    // 2. 본인 업데이트
    dept.update(newName, newParentId, newPath)
    
    // 3. 하위 부서 전파 (재귀 혹은 Like 검색)
    // path_string LIKE 'oldPath>%' 인 모든 하위 부서 조회
    children = repository.findAllByPathStartingWith(oldPath + ">")
    
    FOR child IN children DO
        // 기존 prefix를 새로운 prefix로 교체
        childNewPath = child.path_string.replace(oldPath, newPath)
        child.updatePath(childNewPath)
    END FOR
    
    RETURN dept
END FUNCTION
```

### **3.2 사용자 부서 이동 (`transferUser`)**

```java
FUNCTION TransferUser(userId, targetDeptId)
    user = userRepository.findById(userId)
    targetDept = deptRepository.findById(targetDeptId)
    
    // 1. 유효성 검증
    IF targetDept.is_active == False THEN
        THROW Exception("Cannot transfer to inactive department.")
    END IF
    
    IF user.is_leader == True THEN
        THROW Exception("Leader cannot be transferred. Delegate header first.")
    END IF
    
    // 2. 소속 변경
    oldDept = user.department
    user.assignDepartment(targetDept)
    
    // 3. 이력(History) 저장
    history = NEW DepartmentHistory(
        user=user,
        fromDept=oldDept,
        toDept=targetDept,
        date=NOW()
    )
    historyRepository.save(history)
    
    RETURN user
END FUNCTION
```

---

## **4. 엣지 케이스 및 예외 처리 (Edge Cases)**

| 상황 | 설명 | 처리 방침 |
| --- | --- | --- |
| **순환 참조 (Circular Dependency)** | A부서를 B 산하로, B를 A 산하로 이동 시도 | 이동 전 `newParent`의 조상 중에 `self`가 있는지 검사하여 방지. (ArchUnit이 아닌 로직 레벨 검증) |
| **최상위 부서 삭제** | 하위 부서가 존재하는 최상위 부서 삭제 시도 | **실패 처리**. 하위 부서를 모두 이동시키거나 삭제한 후에만 가능. |
| **대량 이동** | 조직 개편으로 1000명 동시 이동 | **배치 처리** 권장. 실시간 처리 시 Transaction Timeout 주의. |

## **5. 데이터 모델 참조**

* **Department:** `id`, `parent_id`, `name`, `path_string` (Index), `depth`
* **Employee:** `id`, `dept_id`, `is_leader`, `position`, `job_title`
* **DepartmentHistory:** `user_id`, `from_dept_id`, `to_dept_id`, `transfer_date`
