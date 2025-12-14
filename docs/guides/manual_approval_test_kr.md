# 결재 모듈 수동 테스트 가이드 (Samsung Tenant)

## 1. 개요
본 문서는 `samsung.com` 테넌트 환경에서 결재 시스템(휴가 신청 및 승인)을 수동으로 테스트하기 위한 절차를 안내합니다.

## 2. 사전 준비 (Data Setup)

테스트를 진행하기 위해 사전에 정의된 테스트 데이터(사용자, 부서)를 데이터베이스에 적재해야 합니다.

### 2.1 테스트 데이터 생성 스크립트 실행
프로젝트 루트 디렉토리에서 아래 명령어를 실행하여 데이터를 적재합니다.

**Windows PowerShell:**
```powershell
Get-Content backend\src\main\resources\sql\test_data_samsung.sql | docker exec -i hr-db mysql -uuser -ppassword hr_system
```

**Mac/Linux:**
```bash
docker exec -i hr-db mysql -uuser -ppassword hr_system < backend/src/main/resources/sql/test_data_samsung.sql
```

> **참고:** `hr-db`는 데이터베이스 컨테이너 이름이며, DB 접속 정보(`user`/`password`)는 `docker-compose.yml` 설정에 따릅니다.

### 2.2 생성된 계정 정보
모든 계정의 비밀번호는 **`password123`** 입니다.

| 역할 | 이름 | 이메일 (ID) | 부서 | 비고 |
| --- | --- | --- | --- | --- |
| **기안자 (Requester)** | Kim Staff | `kim.staff@samsung.com` | IT 개발팀 | 휴가 신청을 수행하는 사원 |
| **결재자 (Approver)** | Lee Manager | `lee.manager@samsung.com` | IT 개발팀 | 휴가를 승인/반려하는 팀장 |
| **인사 담당자** | Park HR | `park.hr@samsung.com` | 인사팀 | 전체 관리 (필요 시) |

---

## 3. 테스트 시나리오

### 시나리오 1: 정상 결재 승인 (Happy Path)

**목표:** 기안자가 휴가를 신청하고, 결재자가 이를 확인하여 승인 처리한다.

#### 1단계: 기안자 로그인 및 신청
1.  브라우저에서 `http://localhost:3000` 접속.
2.  로그인: `kim.staff@samsung.com` / `password123`
3.  **대시보드** 또는 **휴가(Vacation)** 메뉴로 이동.
4.  **[휴가 신청]** 버튼 클릭.
5.  입력 폼 작성:
    *   유형: `연차 (Annual)`
    *   기간: 내일 날짜 하루 선택
    *   사유: `개인 사정으로 인한 연차 신청`
6.  **[신청하기]** 클릭 -> "성공적으로 신청되었습니다" 메시지 확인.
7.  로그아웃 (사이드바 하단 로그아웃 아이콘 클릭).

#### 2단계: 결재자 로그인 및 승인
1.  로그인: `lee.manager@samsung.com` / `password123`
2.  **대시보드**의 "승인 대기중인 요청" 위젯 또는 **결재(Approval)** 메뉴 확인.
3.  `Kim Staff`의 휴가 신청 건 클릭하여 상세 내역 확인.
4.  **[승인(Approve)]** 버튼 클릭.
5.  상태가 `APPROVED`로 변경되었는지 확인.
6.  로그아웃.

#### 3단계: 결과 확인
1.  로그인: `kim.staff@samsung.com` / `password123`
2.  **휴가** 메뉴에서 내 신청 내역 조회.
3.  상태가 `승인됨 (APPROVED)`인지 확인하고, 잔여 연차가 차감되었는지 확인.

---

### 시나리오 2: 반려 및 재상신 (Rejection & Re-submit)

**목표:** 결재자가 신청을 반려하고, 기안자가 사유를 수정하여 재상신한다.

1.  **기안자(`kim.staff`)**: 새로운 휴가 신청 (사유: "늦잠") -> 상신.
2.  **결재자(`lee.manager`)**: 로그인 후 해당 요청 상세 조회 -> **[반려(Reject)]** 클릭 (반려 사유: "사유 불충분").
3.  **기안자(`kim.staff`)**: 로그인 후 "반려됨(REJECTED)" 상태 확인.
4.  (선택) 반려된 건을 수정하거나 새로 작성하여 다시 상신.

---

## 4. 트러블슈팅

**Q. 데이터가 없다고 나옵니다.**
A. 2.1 단계의 SQL 스크립트가 정상적으로 실행되었는지 확인하세요. DB 툴(DBeaver 등)로 `users` 테이블을 조회하여 `samsung.com` 계정들이 있는지 확인하세요.

**Q. 로그인이 안 됩니다.**
A. 비밀번호가 `password123`인지 확인하세요. 대소문자를 구분합니다.

**Q. 버튼이 보이지 않습니다.**
A. 브라우저 캐시를 지우거나 강력 새로고침(Ctrl+F5)을 하세요. 특정 권한(Role)에 따라 메뉴가 다를 수 있습니다.
