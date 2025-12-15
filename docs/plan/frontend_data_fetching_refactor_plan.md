# 프론트엔드 데이터 페칭 레이어 리팩토링 계획 (Frontend Data Fetching Refactor Plan)

## 1. 개요 (Overview)
현재 프론트엔드에서 API 호출 실패 시 무한 재시도(Infinite Retries) 문제와 인증된 호출 누락(Missing Calls) 문제가 발생하고 있습니다. 이를 해결하기 위해 SWR 전역 설정과 Axios Fetcher를 표준화하여 안정적인 데이터 통신 환경을 구축합니다.

## 2. 현황 분석 (Current Status Analysis)
- **`src/app/providers.tsx`**: `SWRConfig`가 설정되어 있으나, 무한 루프 방지를 위한 핵심 옵션(`revalidateOnFocus`, `dedupingInterval`)이 누락되어 있습니다. `shouldRetryOnError`는 이미 `false`로 설정되어 있습니다.
- **`src/shared/api/fetcher.ts`**: 이미 커스텀 `client`를 사용하고 있으나, 표준화된 패턴을 확고히 하고 Envelope 패턴(`response.data.data`) 처리가 일관된지 확인이 필요합니다.
- **`src/shared/api/client.ts`**: Axios 인스턴스와 인터셉터 설정은 정상적으로 보입니다.

## 3. 변경 사항 (Proposed Changes)

### 3.1. SWR 전역 설정 강화 (`src/app/providers.tsx`)
`SWRConfig`에 다음 옵션을 추가/확인하여 네트워크 스팸 및 불필요한 요청을 방지합니다.
- `revalidateOnFocus: false`: 윈도우 포커스 시 자동 갱신 비활성화 (개발 중 불필요한 호출 방지)
- `shouldRetryOnError: false`: 에러 발생 시 자동 재시도 비활성화 (이미 유지)
- `dedupingInterval: 5000`: 5초 이내 중복 요청 방지

### 3.2. Fetcher 표준화 (`src/shared/api/fetcher.ts`)
- `client` 인스턴스 사용을 보장하여 인터셉터(`Authorization` 헤더)가 적용되도록 합니다.
- 현재 구현(`response.data.data` 반환)이 프로젝트의 Envelope 패턴과 일치하는지 확인하고 유지합니다.

## 4. 검증 계획 (Verification Plan)
- **코드 리뷰**: `providers.tsx` 내 옵션 적용 여부 확인.
- **동작 검증**:
    1. 브라우저 탭 전환 시 API 호출이 발생하지 않는지 확인 (`revalidateOnFocus: false`).
    2. API 에러(401/500) 발생 시 재시도가 멈추는지 확인 (`shouldRetryOnError: false`).
    3. 동일한 API 호출이 5초 내에 중복 발생하지 않는지 확인 (`dedupingInterval: 5000`).

## 5. 일정 (Schedule)
- **승인 즉시 실행**: `providers.tsx` 수정 및 `fetcher.ts` 검토.
