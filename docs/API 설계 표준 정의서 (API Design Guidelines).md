# **API 설계 표준 정의서 (API Design Guidelines)**

## **1\. 개요**

본 문서는 HR 시스템의 RESTful API 설계 원칙을 정의한다. 모든 API는 이 표준을 준수하여 일관성 있는 인터페이스를 제공해야 한다.

## **2\. URI 네이밍 규칙 (URI Naming)**

### **2.1 기본 원칙**

* **소문자 사용:** 대문자는 사용하지 않는다. (kebab-case 권장)  
* **복수형 명사:** 리소스는 복수형을 사용한다. (/users, /departments)  
* **계층 구조:** 하위 리소스는 ID 뒤에 붙인다. (/users/{id}/vacations)

### **2.2 테넌트(Tenant) 식별**

* **헤더 기반 (Header-Based):** URL에 테넌트 ID를 노출하지 않고, HTTP Header로 식별한다. (보안 및 URL 깔끔함 유지)  
  * X-Tenant-ID: 100 (Gateway 또는 Filter에서 토큰 파싱 후 주입)  
* **슈퍼 어드민 전용:** 특정 테넌트를 지정해 관리할 때는 명시적인 Path를 사용한다.  
  * GET /api/admin/tenants/{tenantId}/stats

## **3\. 요청/응답 표준 (Request/Response)**

### **3.1 공통 응답 포맷 (Envelope)**

모든 API는 아래 JSON 구조를 유지한다. HTTP Status Code가 200이어도 비즈니스 로직 실패일 수 있다.

{  
  "success": true,          // 성공 여부 (true/false)  
  "data": { ... },          // 성공 시 데이터 (실패 시 null)  
  "error": {                // 성공 시 null  
    "code": "ERR\_USER\_001", // 에러 식별 코드  
    "message": "사용자를 찾을 수 없습니다.", // 사용자 표시 메시지  
    "details": \[\]           // 선택적 상세 정보 (Validation Field 등)  
  },  
  "metadata": {             // 선택적 메타데이터 (페이징, 서버시간 등)  
    "timestamp": "2024-12-12T10:00:00Z"  
  }  
}

### **3.2 페이징 (Pagination)**

대용량 데이터(근태 로그, 급여 내역) 조회를 위해 페이징은 필수다.

* **요청 (Request):**  
  * page: 페이지 번호 (1부터 시작)  
  * size: 페이지 당 개수 (기본 20\)  
  * sort: 정렬 조건 (field,asc or field,desc)  
  * 예: GET /api/users?page=1\&size=50\&sort=name,asc  
* **응답 (Response Metadata):**  
  "metadata": {  
    "pagination": {  
      "currentPage": 1,  
      "totalPages": 10,  
      "totalItems": 195,  
      "hasNext": true  
    }  
  }

## **4\. HTTP Method 및 Status Code**

| Method | 용도 | 성공 시 Status | 비고 |
| :---- | :---- | :---- | :---- |
| **GET** | 리소스 조회 | 200 OK | 캐싱 가능 |
| **POST** | 리소스 생성 / 복잡한 조회 | 201 Created / 200 OK | 생성 시 Location 헤더 반환 권장 |
| **PUT** | 리소스 전체 수정 | 200 OK | 멱등성 보장 |
| **PATCH** | 리소스 일부 수정 | 200 OK | 변경된 필드만 전송 |
| **DELETE** | 리소스 삭제 | 204 No Content | Response Body 없음 |

### **주요 에러 코드**

* 400 Bad Request: 입력값 유효성 실패 (Validation)  
* 401 Unauthorized: 인증 토큰 없음 또는 만료  
* 403 Forbidden: **\[Policy\]** 권한 부족 (Role, Ticket, Scope 위반)  
* 404 Not Found: 리소스 없음 (타 테넌트 리소스 접근 시에도 404 반환하여 존재 여부 은폐)  
* 429 Too Many Requests: API Rate Limit 초과  
* 500 Internal Server Error: 서버 로직 에러 (버그)

## **5\. 데이터 포맷 (Data Formats)**

### **5.1 날짜 및 시간**

* **Request/Response:** 모든 날짜와 시간은 **ISO 8601 (YYYY-MM-DDThh:mm:ssZ)** 형식을 사용한다.  
* **Timezone:** 서버는 항상 **UTC**로 저장하고 처리하며, 클라이언트(프론트엔드)가 브라우저 타임존에 맞춰 변환하여 보여준다.  
* *예외:* birthDate, hireDate 같은 순수 날짜는 YYYY-MM-DD 사용.

### **5.2 금액 (Money)**

* 소수점 처리를 위해 String 또는 정수형(최소 단위)으로 주고받는다.  
* 부동소수점(float, double) 사용 금지. (예: 100000 or "100000.00")

## **6\. API 버전 관리 (Versioning)**

* **URI Versioning:** Breaking Change가 발생할 경우 버전을 올린다.  
  * /api/v1/users \-\> /api/v2/users  
* 하위 호환성이 유지되는 변경(필드 추가 등)은 버전 변경 없이 배포한다.