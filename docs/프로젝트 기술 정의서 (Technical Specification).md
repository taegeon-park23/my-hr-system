# **프로젝트 기술 정의서 (Technical Specification)**

## **1\. 개요 (Overview)**

본 문서는 HR 시스템 구축을 위한 **아키텍처 설계 원칙, 개발 표준 가이드라인, 시스템 구조**를 정의한다. 모든 개발자는 본 문서에 정의된 아키텍처 원칙(Modular Monolith, CQRS 등)과 규약을 준수하여 개발해야 한다.

## **2\. 아키텍처 설계 원칙 (Architecture Principles)**

### **2.1 Modular Monolith (모듈형 모놀리스)**

* **물리적 구조:** 단일 배포 단위(Single Deployment Unit)를 유지하여 초기 인프라 복잡성을 낮춘다.  
* **논리적 구조:** 마이크로서비스(MSA)에 준하는 **엄격한 모듈 격리**를 적용한다.  
  * 모듈 간 DB 테이블 직접 참조(JOIN) 금지 (Write 모델 한정).  
  * 모듈 간 통신은 오직 \*\*공개 API(Interface)\*\*와 \*\*이벤트(Event)\*\*만 허용한다.

### **2.2 CQRS (명령과 조회의 책임 분리)**

* **Command (쓰기):** 데이터 정합성과 비즈니스 규칙이 중요하므로 도메인 주도 설계(DDD)를 따르며 모듈 간 격리를 엄수한다.  
* **Query (읽기):** 조회 성능이 최우선이므로, **모든 도메인 테이블에 대한 조인(JOIN)을 허용**하는 별도의 조회 전용 계층(queries)을 둔다.

### **2.3 Policy-Based Authorization (정책 기반 권한 제어)**

* 비즈니스 로직(Service) 내에 if (user.isAdmin)과 같은 권한 코드를 섞지 않는다.  
* 모든 권한 판단은 \*\*Policy 모듈(PDP)\*\*로 위임하며, **AOP**를 통해 컨트롤러 진입 전 차단한다.

## **3\. 백엔드 개발 가이드라인 (Backend)**

### **3.1 기술 스택**

* **Language:** Java 17+ (or Kotlin)  
* **Framework:** Spring Boot 3.x  
* **Data Access:** JPA (Command용), MyBatis/JOOQ (Query용)  
* **Build Tool:** Gradle (Multi-module 구조 권장)

### **3.2 패키지 및 모듈 구조**

최상위 레벨에서 역할에 따라 3가지 영역으로 명확히 분리한다. 특히 **custom** 패키지를 통해 테넌트별 특화 로직을 격리한다.

src/main/java/com/hr  
│  
├── modules/                \# \[Write Layer\] 핵심 비즈니스 로직 (도메인별 격리)  
│   ├── user/               \# \- 사용자 모듈  
│   ├── approval/           \# \- 결재 모듈 (범용 엔진)  
│   ├── policy/             \# \- 권한/정책 모듈 (PDP)  
│   ├── custom/             \# \[Custom Layer\] ★ 테넌트 전용 로직 격리  
│   │   ├── samsung/        \# \- 삼성 전용 기능 (예: 골프장 예약)  
│   │   └── lg/             \# \- LG 전용 기능  
│   └── ...                 \# (각 모듈은 api, domain, service, controller 패키지 보유)  
│  
├── queries/                \# \[Read Layer\] 화면/조회 최적화 (모든 테이블 접근 가능)  
│   ├── dashboard/          \# \- 대시보드용 복잡한 쿼리  
│   └── org\_chart/          \# \- 조직도용 계층형 쿼리  
│  
└── common/                 \# \[Shared Kernel\] 유틸리티, 공통 설정  
    ├── security/           \# \- AOP, Custom Annotation  
    └── event/              \# \- Domain Event Base

### **3.3 개발 규약**

1. **퍼사드 패턴 (Facade Pattern) 적용:**  
   * 컨트롤러는 절대 Service의 복잡한 로직을 직접 조합하지 않는다.  
   * 여러 모듈의 데이터 조합이 필요한 경우 Facade 클래스를 생성하여 처리한다.  
   * *예: PayrollQueryFacade가 PayrollService와 UserModuleApi를 호출하여 조립.*  
2. **의존성 방향:**  
   * queries \-\> modules (허용: 조회 모듈은 도메인 모델을 읽을 수 있음)  
   * modules \-\> modules (금지: 서로 직접 참조 불가. xxxModuleApi 인터페이스로만 통신)  
3. **트랜잭션:**  
   * queries 패키지의 모든 서비스는 @Transactional(readOnly \= true)를 기본으로 한다.

### **3.4 멀티 테넌트 확장성 전략 (Multi-Tenancy Strategy)**

1. **Configuration-Driven (기능 제어):**  
   * 단순 기능 On/Off, UI 테마, 기본 설정값(예: 급여 지급일)은 TenantConfig 테이블의 JSON 설정을 통해 제어한다.  
   * 코드 변경 없이 DB 설정만으로 테넌트별 동작을 변경할 수 있어야 한다.  
2. **Strategy Pattern (비즈니스 로직 분기):**  
   * 급여 계산(PayrollCalculator), 연차 생성(VacationGenerator) 등 테넌트별로 로직이 완전히 달라지는 경우, if (companyId \== A) 분기를 지양한다.  
   * 대신 공통 인터페이스를 정의하고, supports(companyId) 메서드를 가진 구현체를 여러 개 만들어 런타임에 주입받아 사용한다.  
3. **Isolation Rule (코드 격리):**  
   * 특정 테넌트만을 위한 전용 로직(Class)이나 완전히 새로운 기능은 modules/custom/{tenant\_name}/ 패키지 하위에 격리하여 관리한다.  
   * 이를 통해 Core 로직이 특정 회사의 요구사항으로 인해 오염되는 것을 방지한다.

## **4\. 프론트엔드 개발 가이드라인 (Frontend)**

### **4.1 기술 스택**

* **Framework:** Next.js (App Router)  
* **Language:** TypeScript  
* **State Management:** Zustand or TanStack Query (Server State)  
* **Styling:** Tailwind CSS / SCSS modules  
* **Documentation:** **Storybook** (UI 컴포넌트 개발 및 문서화) **\[NEW\]**

### **4.2 아키텍처: FSD (Feature-Sliced Design) 변형**

페이지 중심 개발을 지양하고, **기능(Feature)** 중심의 응집도 높은 구조를 채택한다. 테넌트별 UI 컴포넌트는 custom 폴더에 격리한다.

src/  
├── .storybook/             \# \[Storybook\] 설정 파일  
├── app/                    \# \[Router\] URL 라우팅 및 레이아웃 정의 (로직 없음)  
│   ├── (auth)/login/  
│   ├── dashboard/  
│   └── approval/  
│  
├── features/               \# \[Business Logic\] 실제 기능 구현체  
│   ├── approval/           \# \- 결재 관련 UI, API Hook, 상태 관리  
│   ├── vacation/  
│   └── custom/             \# \[Custom Features\] ★ 테넌트 전용 UI 격리  
│       ├── samsung/        \# \- 삼성 전용 컴포넌트 (예: GolfBooking)  
│       └── ...  
│  
├── shared/                 \# \[Shared\] 재사용 가능한 공통 컴포넌트 (비즈니스 로직 X)  
│   ├── ui/                 \#   (Button, Modal, AuthGuard)  
│   │   ├── Button.tsx  
│   │   └── Button.stories.tsx \# ★ Story 파일 Colocation  
│   └── lib/                \#   (axios instance, utils)  
│  
└── widgets/                \# \[Composition\] 여러 기능을 조립한 거대 컴포넌트  
    └── Sidebar/            \#   (UserFeature \+ MenuFeature 조합)

### **4.3 개발 규약**

1. **AuthGuard 사용:** 페이지 접근 권한 제어는 if문 대신 \<AuthGuard requirement="PERM\_CODE"\> 컴포넌트로 선언적으로 처리한다.  
2. **API 호출 분리:** 컴포넌트 내부에서 fetch/axios를 직접 사용하지 않고, features/{name}/api 폴더에 정의된 **Custom Hook**을 통해서만 호출한다.  
3. **View Mode 패턴:** 대시보드 등 조회 화면은 viewMode ('MY', 'TEAM', 'COMPANY') props를 통해 재사용성을 높인다.  
4. **Storybook Driven Development (SDD):** **\[NEW\]**  
   * shared/ui 패키지의 모든 컴포넌트는 반드시 \*.stories.tsx 파일을 포함해야 한다.  
   * 복잡한 페이지 개발 전, Storybook에서 단위 컴포넌트(Atom/Molecule)를 먼저 개발하고 검증하는 **상향식(Bottom-Up) 개발**을 지향한다.

### **4.4 프론트엔드 멀티 테넌트 전략**

1. **Dynamic Imports (동적 로딩):**  
   * 테넌트별로 상이한 UI가 필요한 경우, next/dynamic을 사용하여 런타임에 해당 테넌트용 컴포넌트만 로드한다. (번들 사이즈 최적화)  
   * 예: const WelfareView \= dynamic(() \=\> import(config.welfareType \=== 'POINT' ? './PointView' : './ReceiptView'))  
2. **Server-Driven UI:**  
   * 메뉴 구조나 화면 구성 요소는 백엔드(TenantConfig)에서 내려주는 설정값에 따라 렌더링 여부를 결정한다.

## **5\. 데이터베이스 설계 원칙**

1. **테이블 소유권:** 각 테이블은 반드시 하나의 module에 의해서만 관리(Create/Update/Delete)되어야 한다.  
2. **참조 무결성:** 모듈 간 관계는 FK(Foreign Key) 제약조건을 걸되, JPA Entity 레벨에서는 객체 참조(@ManyToOne) 대신 \*\*ID 참조(Long userId)\*\*를 사용한다.  
3. **읽기 최적화:** departments 테이블의 path\_string 컬럼처럼, 재귀 쿼리 부하를 줄이기 위한 반정규화(Denormalization) 컬럼을 적극 도입한다.  
4. **유연한 데이터 구조 (JSON Column):**  
   * 테넌트별로 상이한 부가 정보(예: 복지 포인트 사용처, 영수증 메타데이터)를 저장하기 위해, 주요 테이블에 attributes (JSON) 컬럼을 추가하여 스키마 변경 없이 데이터를 수용한다.

## **6\. 로컬 개발 환경 정의 (Local Development)**

모든 개발자는 **Docker**를 사용하여 동일한 로컬 환경에서 개발을 진행한다.

### **6.1 Docker Compose 구성 (docker-compose.yml)**

version: '3.8'  
services:  
  \# 1\. 메인 데이터베이스 (MySQL 8.0)  
  hr-db:  
    image: mysql:8.0  
    environment:  
      MYSQL\_ROOT\_PASSWORD: root  
      MYSQL\_DATABASE: hr\_system  
    ports:  
      \- "3306:3306"  
    volumes:  
      \- ./data/mysql:/var/lib/mysql  
      \- ./init.sql:/docker-entrypoint-initdb.d/init.sql \# 초기 스키마 및 시드 데이터

  \# 2\. 캐시 및 세션 저장소 (Redis)  
  hr-redis:  
    image: redis:alpine  
    ports:  
      \- "6379:6379"

  \# 3\. 로컬용 메일 서버 (MailHog \- 결재 알림 테스트용)  
  hr-mail:  
    image: mailhog/mailhog  
    ports:  
      \- "1025:1025" \# SMTP  
      \- "8025:8025" \# Web UI

### **6.2 실행 가이드**

1. **환경 설정:** 프로젝트 루트의 .env.local 파일을 생성하여 DB 접속 정보 등을 설정한다.  
2. **실행:** docker-compose up \-d 명령어로 인프라 실행.  
3. **백엔드:** ./gradlew bootRun (로컬 프로파일 활성화).  
4. **프론트엔드:** npm run dev (로컬 백엔드 포트 연결).  
   * **Storybook:** npm run storybook (6006 포트 실행).