# **심층 요구사항 명세서: 근태 관리 시스템 (SPEC-05)**

## **0. 문서 이력 (Version History)**

| 버전 | 일자 | 작성자 | 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-12-18 | System | 최초 작성 | 출퇴근 유효성 검증 및 초과근무 계산 로직 정의 |

## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 **근태(Attendance)** 모듈의 출퇴근 기록 유효성 검증 및 근무 시간(Working Hours) 계산 로직을 정의한다.
다양한 근무 유형(고정, 시차, 선택적)에 따른 시간 산정 방식과 초과근무(Overtime) 승인 프로세스를 명세한다.

### **1.2 범위**
* **출퇴근(Commute):** IP/GPS 기반 체크인/아웃 검증.
* **근무시간(Calculation):** 휴게시간(Break Time) 자동 차감 및 실 근무시간 계산.
* **초과근무(Overtime):** 야간/연장 근무 신청 및 승인 로직.

---

## **2. 핵심 결정 테이블 (Decision Table)**

### **2.1 근무 시간 인정 및 초과근무 산정 규칙**

| 규칙 ID | 근무 유형 | 실제 근무 시간 | 초과근무 신청 승인 여부 | **인정 근무 시간 (Recognized)** | **초과 근무 시간 (Overtime)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ATT-R1** | 9-to-6 (고정) | 09:00 ~ 18:00 (9h) | - | 8h (휴게 1h) | 0h |
| **ATT-R2** | 9-to-6 (고정) | 09:00 ~ 20:00 (11h) | **Yes** | 8h | 2h (휴게 1h 제외) |
| **ATT-R3** | 9-to-6 (고정) | 09:00 ~ 20:00 (11h) | **No** | 8h | 0h (승인 없으면 불인정) |
| **ATT-R4** | 시차출퇴근 | 10:00 ~ 19:00 (9h) | - | 8h | 0h |
| **ATT-R5** | 반차 사용 | 14:00 ~ 18:00 (4h) | - | 4h (+4h 휴가 인정) | 0h |

### **2.2 출퇴근 체크 유효성 검증 (Truth Table)**

| 케이스 ID | 조건 1: 허용 IP 대역 | 조건 2: GPS 반경 500m 내 | 조건 3: 모바일 기기 여부 | **결과 (Result)** | **비고** |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **CHK-TC1** | True | - | - | **성공** | 사내망 접속 시 GPS 무관 |
| **CHK-TC2** | False | True | True | **성공** | 외부망 + 모바일 + 위치 인증 |
| **CHK-TC3** | False | False | - | **실패** | "지정된 근무 위치가 아닙니다." |
| **CHK-TC4** | False | True | False | **실패** | PC 환경에서는 GPS 신뢰 불가 (사내망 필수) |

---

## **3. 핵심 로직 의사 코드 (Pseudo-code)**

### **3.1 실 근무시간 계산 (`calculateWorkingHours`)**

```java
FUNCTION CalculateWorkingHours(attendLog, workSchedule)
    // 1. 총 체류 시간 계산
    startTime = attendLog.checkInTime
    endTime = attendLog.checkOutTime
    rawDuration = DURATION(startTime, endTime)
    
    // 2. 휴게 시간 차감 (4시간마다 30분, 8시간 1시간 등 법정 기준 or 스케줄 기준)
    breakTime = 0
    IF rawDuration >= 9 hours THEN
        breakTime = 1 hour
    ELSE IF rawDuration >= 4 hours THEN
        breakTime = 0.5 hour
    END IF
    
    // 3. 기본 근무 시간 산정
    netDuration = rawDuration - breakTime
    basicWorkHours = MIN(netDuration, 8 hours) // 기본 8시간까지만 인정 (고정근무제 기준)
    
    // 4. 초과 근무 계산
    overtimeHours = 0
    IF netDuration > 8 hours THEN
        potentialOvertime = netDuration - 8 hours
        // 승인된 초과근무만 인정
        approvedOvertime = overtimeRepository.getApprovedHours(attendLog.date, attendLog.user)
        overtimeHours = MIN(potentialOvertime, approvedOvertime)
    END IF
    
    RETURN { basic: basicWorkHours, overtime: overtimeHours }
END FUNCTION
```

---

## **4. 엣지 케이스 및 예외 처리 (Edge Cases)**

| 상황 | 설명 | 처리 방침 |
| --- | --- | --- |
| **퇴근 미체크 (Missing Check-out)** | 직원이 퇴근 버튼을 안 누르고 귀가 | **결근 처리** or **자동 퇴근(18:00)** 처리 후 소명 신청 발송. (정책 설정에 따름) |
| **날짜 변경 근무 (Overnight)** | 23:00 출근 ~ 익일 06:00 퇴근 | `WorkDate`는 출근 시점 기준으로 귀속. 퇴근 시간이 명일이라도 하나의 `AttendanceLog`로 처리. |
| **서버 시간 불일치** | 클라이언트 시간 조작 시도 | **Server Time 기준**으로만 DB 기록. 클라이언트 시간은 UI용으로만 사용. |

## **5. 데이터 모델 참조**

* **AttendanceLog:** `user_id`, `work_date`, `check_in`, `check_out`, `source_ip`
* **WorkSchedule:** `type` (FIXED, FLEXIBLE), `start_time`, `end_time`
* **OvertimeRequest:** `date`, `hours`, `reason`, `approval_status`
