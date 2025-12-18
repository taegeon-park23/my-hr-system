# **심층 요구사항 명세서: 채용 관리 시스템 (SPEC-09)**

## **0. 문서 이력 (Version History)**

| 버전 | 일자 | 작성자 | 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-12-18 | System | 최초 작성 | 채용 파이프라인 및 온보딩 전환 로직 정의 |

## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 채용 공고 게시부터 지원자 접수, 면접 평가, 그리고 최종 합격자의 **임직원 전환(Onboarding)**까지의 프로세스를 관리하는 ATS(Applicant Tracking System) 기능을 정의한다.
외부(지원자) 데이터가 내부(임직원) 데이터로 이관되는 시점의 무결성을 보장하는 데 중점을 둔다.

### **1.2 범위**
* **공고(Job Posting):** 채용 포지션 생성 및 게시 상태 관리.
* **지원(Application):** 지원서 접수, 단계별(서류/면접) 합불 처리.
* **온보딩(Onboarding):** 합격자 정보를 바탕으로 User/Employee 계정 생성.

---

## **2. 핵심 결정 테이블 (Decision Table)**

### **2.1 지원자 파이프라인 상태 전이**

| 현재 상태 | 이벤트 | 조건 | **다음 상태** | 액션 |
| :--- | :--- | :--- | :--- | :--- |
| **APPLIED** | `screenPass()` | 서류 검토 합격 | **INTERVIEW_1** | 1차 면접관 배정 알림 |
| **APPLIED** | `reject()` | - | **REJECTED** | 불합격 메일 발송 (Optional) |
| **INTERVIEW_1** | `pass()` | 평가 점수 충족 | **INTERVIEW_2** or **OFFER** | 2차 면접 or 처우 협의 |
| **OFFER** | `acceptOffer()` | 지원자 수락 | **HIRED** | 입사일 확정, 온보딩 프로세스 시작 |
| **HIRED** | `onboard()` | 입사일 도래 | **CONVERTED** | Employee 데이터 생성 완료 |

---

## **3. 핵심 로직 의사 코드 (Pseudo-code)**

### **3.1 입사자 데이터 이관 (`convertToEmployee`)**

```java
FUNCTION ConvertToEmployee(applicationId)
    // 1. 지원자 정보 조회
    app = applicationRepository.findById(applicationId)
    IF app.status != HIRED THEN
        THROW Exception("Only hired applicants can be converted.")
    END IF
    
    // 2. 이메일 중복 체크 (기존 가입 여부)
    IF userRepository.existsByEmail(app.email) THEN
        // 재입사 케이스 또는 중복 지원
        RETURN HandleRejoining(app) 
    END IF
    
    // 3. User 계정 생성
    tempPassword = generateRandom()
    user = NEW User(
        email = app.email,
        name = app.name,
        company_id = app.jobPosting.company_id,
        status = PENDING_ACTIVATION // 로그인 시 비밀번호 변경 필요
    )
    savedUser = userRepository.save(user)
    
    // 4. Employee 정보 생성
    employee = NEW Employee(
        user_id = savedUser.id,
        dept_id = app.jobPosting.dept_id, // 모집 공고의 부서
        join_date = app.start_date
    )
    empRepository.save(employee)
    
    // 5. 상태 업데이트
    app.updateStatus(CONVERTED)
    
    RETURN savedUser
END FUNCTION
```

---

## **4. 엣지 케이스 및 예외 처리**

| 상황 | 설명 | 처리 방침 |
| --- | --- | --- |
| **재입사** | 퇴사했던 직원이 다시 지원하여 합격 | 기존 `User` 계정을 활성화(Reactivate)하거나, 새로운 사번을 부여하되 `PersonID`로 연결. |
| **채용 취소** | HIRED 상태에서 입사 당일 노쇼(No-show) | HIRED -> `CANCELED`로 변경하고 생성된(혹은 예정된) 계정 삭제. |
| **공고 마감** | 공고 마감일이 지났는데 진행 중인 지원자 존재 | **진행 가능**. 마감일은 '신규 지원'만 차단하며, 프로세스 중인 지원자는 계속 진행. |

## **5. 데이터 모델 참조**

* **JobPosting:** `title`, `dept_id`, `status` (OPEN/CLOSED), `due_date`
* **Applicant:** `name`, `email`, `resume_url`, `status`, `posting_id`
* **Interview:** `app_id`, `interviewer_id`, `score`, `feedback`, `round` (1, 2)
