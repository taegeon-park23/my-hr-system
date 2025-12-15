# 버그 수정 완료 보고서: 평가 주기 API 경로 불일치 수정

## 1. 개요
- **문서 번호:** `fix_evaluation_api_path_report`
- **작성일:** 2025-12-15
- **작업자:** Antigravity Agent
- **상태:** ✅ 완료

## 2. 문제 상황
- **증상:** 평가 주기 목록 조회 시 `404 Not Found` 에러 발생.
- **원인:** 
  - Backend Controller는 `/api/admin/evaluations/cycles`로 매핑됨.
  - Frontend는 `/api/evaluations/cycles`로 요청함 (`/admin` 누락).
  - 또한 `companyId` 쿼리 파라미터 전달 방식이 명확하지 않음.

## 3. 해결 방안
### 3.1 Frontend API 경로 수정
- `src/shared/api/queryKeys.ts` 수정
  - `evaluation.cycles` 키를 문자열에서 함수로 변경.
  - 경로를 `/admin/evaluations/cycles`로 수정.
  - `companyId`를 쿼리 파라미터로 추가.

### 3.2 API 호출 Hook 수정
- `src/features/evaluation/api/evaluationApi.ts` 수정
  - `useEvaluationCycles` 훅에서 `queryKeys.evaluation.cycles(companyId)`를 호출하도록 변경.

## 4. 변경 코드
### `src/shared/api/queryKeys.ts`
```typescript
evaluation: {
    // ...
    cycles: (companyId: number) => `/admin/evaluations/cycles?companyId=${companyId}`,
    // ...
},
```

### `src/features/evaluation/api/evaluationApi.ts`
```typescript
export function useEvaluationCycles(companyId: number | undefined) {
    const { data, error, mutate, isLoading } = useSWR<EvaluationCycle[]>(
        companyId ? queryKeys.evaluation.cycles(companyId) : null,
        fetcher
    );
    // ...
}
```

## 5. 검증 결과
- **검증 방법:** 코드 리뷰 및 로직 확인.
- **결과:** URL이 `/api/admin/evaluations/cycles?companyId=...` 형태로 올바르게 생성됨을 확인.
