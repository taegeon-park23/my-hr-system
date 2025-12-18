# **심층 요구사항 명세서: 성과 평가 시스템 (SPEC-08)**

## **0. 문서 이력 (Version History)**

| 버전 | 일자 | 작성자 | 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-12-18 | System | 최초 작성 | 목표 설정 및 다면 평가 프로세스 정의 |

## **1. 개요 (Overview)**

### **1.1 목적**
본 문서는 임직원의 성과를 측정하고 보상하기 위한 **평가(Evaluation)** 모듈의 로직을 정의한다.
MBO(Management By Objectives) 기반의 목표 설정과 본인/동료/상향/하향으로 이어지는 **360도 다면 평가**, 그리고 조직별 등급 배분(Calibration) 로직을 명세한다.

### **1.2 범위**
* **목표 설정:** 개인 및 조직 KPI/OKR 수립 및 승인.
* **평가 진행:** 평면(본인), 상향(팀원->리더), 하향(리더->팀원), 동료(팀원<->팀원) 평가.
* **등급 산정:** 점수 기반의 등급 산출 및 상대평가 배분(S/A/B/C/D).

---

## **2. 핵심 결정 테이블 (Decision Table)**

### **2.1 평가 단계별 상태 전이**

| 현재 상태 | 이벤트 | 조건 | **다음 상태** | **비고** |
| :--- | :--- | :--- | :--- | :--- |
| **GOAL_SETTING** | `submitGoals()` | 목표 가중치 합 100% | **GOAL_REVIEW** | 목표 승인 대기 |
| **GOAL_REVIEW** | `approveGoals()` | 리더 승인 | **EVAL_READY** | 평가 기간 대기 |
| **EVAL_READY** | `startEvaluation()` | 평가 기간 도래 | **SELF_EVAL** | 본인 평가 시작 |
| **SELF_EVAL** | `submitSelf()` | - | **PEER_EVAL** | 동료/상향 평가 진행 |
| **PEER_EVAL** | `closePeer()` | 리더 평가 시작 | **LEADER_EVAL** | 하향 평가 진행 |
| **LEADER_EVAL** | `submitLeader()` | - | **CALIBRATION** | 등급 조정 단계 (부서장) |
| **CALIBRATION** | `confirmGrade()` | - | **COMPLETED** | 결과 확정 및 공개 |

### **2.2 등급 배분(Calibration) 규칙 (예시)**

| 등급 | 권장 비율 | 허용 범위 | **강제 배분 여부** | **비고** |
| :--- | :--- | :--- | :--- | :--- |
| **S (Exceeds)** | 10% | 0% ~ 15% | **Soft** | 경고만 표시 (Hard 권장) |
| **A (Outstanding)** | 20% | 10% ~ 30% | Soft | |
| **B (Meets)** | 50% | 40% ~ 60% | Soft | |
| **C (Needs Imp)** | 15% | 10% ~ 20% | Soft | |
| **D (Unsat)** | 5% | 0% ~ 10% | Soft | 저성과자 관리 프로그램 연동 |

---

## **3. 핵심 로직 의사 코드 (Pseudo-code)**

### **3.1 종합 점수 계산 (`calculateTotalScore`)**

```java
FUNCTION CalculateTotalScore(evaluationId)
    // 1. 가중치 로드 (설정에 따라 다름)
    weights = configRepository.getWeights(evaluationCycleId)
    // 예: Achievement(성과) 70%, Competency(역량) 30%
    // 예: Self 0%, Leader 70%, Peer 30% (일반적인 한국 기업 형태)
    
    // 2. 점수 합산
    score = 0
    
    // 성과 점수 (목표 달성률 기반)
    achieveScore = 0
    goals = goalRepository.findByEvaluation(evaluationId)
    FOR goal IN goals:
        achieveScore += (goal.metric_score * goal.weight)
    
    // 역량 점수 (다면 평가 기반)
    compScore = 0
    reviews = reviewRepository.findByEvaluation(evaluationId)
    leaderReviewScore = AVG(reviews.filter(r => r.type == LEADER).score)
    peerReviewScore = AVG(reviews.filter(r => r.type == PEER).score)
    
    compScore = (leaderReviewScore * weights.leader) + (peerReviewScore * weights.peer)
    
    // 최종 점수 (100점 만점 환산)
    finalScore = (achieveScore * weights.achievement) + (compScore * weights.competency)
    
    RETURN finalScore
END FUNCTION
```

---

## **4. 엣지 케이스 및 예외 처리**

| 상황 | 설명 | 처리 방침 |
| --- | --- | --- |
| **평가자 중도 퇴사** | 동료 평가 진행 중 평가자가 퇴사 | 해당 평가자의 점수는 **제외(Null)** 처리하고 평균 재계산. |
| **목표 미수립** | 평가 시작일까지 목표 설정 안함 | 기본 목표(Default) 자동 할당 or **평가 대상 제외** (C/D 등급 자동 부여). |
| **평가 기간 종료** | 마감일까지 리더 평가 미제출 | **자동 점수 부여** (예: B등급 중간값) 또는 관리자 강제 제출 처리. |

## **5. 데이터 모델 참조**

* **EvaluationCycle:** `year`, `term` (1H/2H), `status`, `start_date`, `end_date`
* **Goal:** `user_id`, `cycle_id`, `title`, `weight`, `metric_score`
* **Review:** `evalu_id`, `reviewer_id`, `type` (SELF/PEER/LEADER), `score`, `comment`
