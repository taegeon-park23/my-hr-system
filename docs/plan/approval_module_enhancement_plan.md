# Phase 1: Approval 모듈 고도화 상세 설계서

## 1. 개요
`SPEC_01`에 명시된 다단계(Sequential) 결재 워크플로우를 구현하기 위한 상세 계획입니다.

## 2. DB 스키마 변경 사항
- **`approval_requests`** 테이블:
  - `version` (BIGINT, DEFAULT 0): 낙관적 락을 위한 버전 컬럼.
  - `current_step_order` (INT, DEFAULT 1): 현재 진행 중인 결재 단계 순서.
- **`approval_steps`** 테이블:
  - `version` (BIGINT, DEFAULT 0): 낙관적 락을 위한 버전 컬럼.
  - `status` (ENUM): `WAITING`, `PENDING`, `APPROVED`, `REJECTED` (기존 ENUM에 WAITING 추가 및 PENDING 기본값 확인).
  - `processed_at` (DATETIME): 처리 일시.
  - `comment` (TEXT): 승인/반려 의견.

## 3. 엔티티 수정 사항 (Java)
- `@Version` 어노테이션 추가 (`ApprovalRequest`, `ApprovalStep`).
- `ApprovalStatus` enum 업데이트 (WAITING 추가).
- `ApprovalRequest`에 `List<ApprovalStep>` 연관 관계 추가 (OrphanRemoval).

## 4. 서비스 로직 (ApprovalService)
- `createApproval(command)`:
  - `ApproverIds` 리스트를 받아 순서대로 `ApprovalStep` 엔티티들을 생성.
  - 1번 스텝은 `PENDING`, 나머지는 `WAITING` 상태로 설정.
- `approveStep(stepId, approverUserId, comment)`:
  - 상위 `ApprovalRequest`가 `PENDING`인지 확인.
  - 해당 스텝의 `approverId`가 `approverUserId`인지 확인.
  - 해당 스텝의 `stepOrder`가 요청의 `current_step_order`와 일치하는지 확인.
  - 스텝 상태를 `APPROVED`로 변경.
  - 다음 스텝이 있는지 확인:
    - 있다면: `current_step_order` 증가, 다음 스텝 상태를 `PENDING`으로 변경.
    - 없다면(최종): 요청 상태를 `APPROVED`로 변경, `ApprovalCompletedEvent` 발행.
- `rejectStep(stepId, approverUserId, comment)`:
  - 스텝 상태를 `REJECTED`로 변경.
  - 요청 상태를 `REJECTED`로 즉시 변경.
  - 이후 미진행 스텝들을 `CANCELED` 또는 `SKIPPED` 로직 고민 (일단 남겨둠).
  - `ApprovalCompletedEvent(REJECTED)` 발행.

## 5. API 명세 (Controller)
- `POST /api/approval/requests`: 결재 요청 생성 (approverIds 포함).
- `POST /api/approval/steps/{stepId}/approve`: 승인 처리.
- `POST /api/approval/steps/{stepId}/reject`: 반려 처리.

## 6. 검증 전략
- **Unit Test:** 다단계 상태 전이 로직 검증.
- **Integration Test:** 실제 DB 연동 및 트랜잭션/락 동작 확인.
- **ArchUnit:** 모듈 고립 원칙 준수 확인.
