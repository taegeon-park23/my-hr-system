# **프로젝트 아키텍처 정의서 (Project Architecture Definition)**

## **1\. 개요 (Overview)**

본 문서는 HR 관리 시스템(Modular Monolith)의 **인프라 아키텍처, 네트워크 구성, 배포 파이프라인**을 정의한다. 시스템은 물리적으로 단일 배포 단위이나, 논리적으로는 **CQRS** 패턴을 따르며 \*\*고가용성(HA)\*\*과 **확장성**을 고려하여 설계되었다.

## **2\. 로컬 개발 환경 (Local Environment)**

모든 개발자는 **Docker Compose**를 사용하여 OS에 종속되지 않는 동일한 환경에서 개발한다.

### **2.1 로컬 아키텍처 다이어그램**

프론트엔드와 백엔드는 호스트 머신(개발자 PC)의 포트를 통해 통신하며, 인프라(DB, Redis 등)는 컨테이너 내부 네트워크로 격리된다.

graph TD  
    subgraph Host \[💻 Developer PC (Host OS)\]  
        Browser\[Chrome Browser\]  
        IDE\[IntelliJ / VS Code\]  
          
        subgraph Docker \[🐳 Docker Compose Network\]  
            Next\[Next.js (Frontend)\]  
            Boot\[Spring Boot (Backend)\]  
            MySQL\[(MySQL 8.0)\]  
            Redis\[(Redis)\]  
            Mail\[MailHog (SMTP Test)\]  
        end  
    end

    Browser \-- "http://localhost:3000" \--\> Next  
    Browser \-- "http://localhost:8025 (Mail UI)" \--\> Mail  
    Next \-- "API Call (Proxy)" \--\> Boot  
    Boot \-- "JDBC (Port 3306)" \--\> MySQL  
    Boot \-- "Jedis (Port 6379)" \--\> Redis  
    Boot \-- "SMTP (Port 1025)" \--\> Mail  
    IDE \-.-\>|"Hot Reload / Live Reload"| Next  
    IDE \-.-\>|"DevTools / Debug"| Boot

### **2.2 주요 구성 요소**

| 서비스명 | 이미지 | 역할 | 포트 매핑 |
| :---- | :---- | :---- | :---- |
| **hr-frontend** | node:18-alpine | Next.js 실행, HMR(Hot Module Replacement) 지원 | 3000:3000 |
| **hr-backend** | openjdk:17 | Spring Boot 애플리케이션 (Dev Profile) | 8080:8080 |
| **hr-db** | mysql:8.0 | 메인 데이터베이스 (초기 데이터 Init Script 포함) | 3306:3306 |
| **hr-redis** | redis:alpine | 세션 공유 및 조회 캐싱 | 6379:6379 |
| **hr-mail** | mailhog/mailhog | 결재 알림 등 이메일 발송 테스트용 가상 SMTP | 8025(UI), 1025(SMTP) |

## **3\. CI/CD 파이프라인 (Automated Delivery)**

GitHub Actions(또는 Jenkins)를 통한 자동 빌드 및 배포 프로세스이다. **단일 레포지토리(Monorepo)** 구조를 가정한다.

### **3.1 배포 흐름도**

flowchart LR  
    Dev\[🧑‍💻 Developer\]  
    Git\[GitHub Repository\]  
    CI\[⚙️ CI Server (GitHub Actions)\]  
    Registry\[📦 Container Registry (ECR/DockerHub)\]  
    CD\[🚀 CD Tool (ArgoCD / AWS CodeDeploy)\]  
    Env\[☁️ Target Environment\]

    Dev \--\>|Push (feature/\*)| Git  
    Git \--\>|Pull Request| CI  
      
    subgraph CI\_Process \[CI Pipeline\]  
        direction TB  
        Test\[Unit Test & ArchUnit\]  
        Build\[Gradle Build & Next Build\]  
        Dockerize\[Docker Image Build\]  
    end  
      
    CI \--\> CI\_Process  
    CI\_Process \--\>|Success| Registry  
    Registry \--\>|Image Tag Update| CD  
    CD \--\>|Rolling Update| Env

### **3.2 단계별 상세 정의**

1. **Test & Build:**  
   * Backend: ./gradlew test (JUnit, ArchUnit 아키텍처 검증 포함).  
   * Frontend: npm run lint & npm run build.  
2. **Containerize:**  
   * Jib(Java) 또는 Dockerfile을 사용하여 경량화된 컨테이너 이미지 생성.  
   * 이미지 태그 전략: release-v1.0.0-${commit\_hash}.  
3. **Deployment:**  
   * **Dev:** develop 브랜치 병합 시 자동 배포.  
   * **Prod:** main 브랜치 병합 후 승인(Manual Approval) 절차를 거쳐 배포.

## **4\. 운영 환경 아키텍처 (Production Architecture)**

**AWS 클라우드**를 기준으로 한 고가용성 아키텍처이다. **CQRS 패턴**을 인프라 레벨에서 지원하기 위해 **DB의 쓰기/읽기 엔드포인트를 분리**한다.

### **4.1 운영 아키텍처 다이어그램**

graph TD  
    User\[🌍 User Traffic\]  
    Route53\[AWS Route53 (DNS)\]  
    WAF\[🛡️ AWS WAF (Web Firewall)\]  
      
    subgraph VPC \[☁️ Virtual Private Cloud (VPC)\]  
          
        subgraph Public\_Subnet \[Public Subnet\]  
            ALB\[⚖️ Application Load Balancer\]  
            NAT\[NAT Gateway\]  
        end  
          
        subgraph App\_Subnet \[Private Subnet \- Application Layer\]  
            direction TB  
            NextGroup\[Next.js Cluster (ECS/K8s)\]  
            SpringGroup\[Spring Boot Cluster (ECS/K8s)\]  
        end  
          
        subgraph Data\_Subnet \[Private Subnet \- Data Layer\]  
            RedisClust\[Redis Cluster (ElastiCache)\]  
              
            subgraph RDS \[Aurora MySQL\]  
                Primary\[(Writer Instance)\]  
                Replica\[(Reader Instance 1..N)\]  
            end  
        end  
    end

    User \--\> Route53  
    Route53 \--\> WAF  
    WAF \--\> ALB  
      
    ALB \--\>|Path: /api/\*| SpringGroup  
    ALB \--\>|Path: /\*| NextGroup  
      
    NextGroup \-- "Internal API Call" \--\> SpringGroup  
      
    %% CQRS DB Connections  
    SpringGroup \-- "Command (Write)" \--\> Primary  
    SpringGroup \-- "Query (Read)" \--\> Replica  
    SpringGroup \-- "Cache" \--\> RedisClust  
      
    %% External Access via NAT  
    SpringGroup \-.-\>|Outbound (Email/Push)| NAT

### **4.2 계층별 구성 상세**

#### **A. 인입 계층 (Ingress Layer)**

* **WAF & CloudFront:** DDoS 방어 및 정적 리소스(JS, CSS, Image) 캐싱.  
* **Load Balancer (ALB):** SSL 종료(HTTPS) 및 트래픽 분산. /api 경로는 백엔드로, 나머지는 프론트엔드로 라우팅.

#### **B. 애플리케이션 계층 (App Layer)**

* **ECS Fargate / EKS:** 서버 관리 부담이 없는 컨테이너 오케스트레이션 사용.  
* **Auto Scaling:** CPU/Memory 사용량에 따라 컨테이너(Pod) 수 자동 조절.  
* **Zero-Downtime:** 롤링 업데이트(Rolling Update) 또는 블루/그린 배포 전략 적용.

#### **C. 데이터 계층 (Data Layer) \- CQRS 최적화**

* **Primary DB (Write):**  
  * modules/\* (Command) 작업이 수행되는 곳.  
  * 트랜잭션 ACID 보장.  
* **Read Replica DB (Read):**  
  * queries/\* (Query) 작업이 수행되는 곳.  
  * **Replication Lag**을 고려하여 실시간성이 덜 중요한 대시보드, 통계 쿼리에 활용.  
  * 부하 분산을 위해 여러 대의 Replica 구성 가능.  
* **Redis:**  
  * 세션 스토리지 (로그인 유지).  
  * 자주 조회되는 데이터(공통 코드, 조직도 캐시) 저장.

## **5\. 개발 환경 아키텍처 (Development Environment)**

비용 효율성을 위해 운영 환경과 유사하되 구성을 축소한다.

* **컴퓨팅:** 클러스터 대신 단일 EC2 인스턴스(Docker Compose) 또는 소규모 Spot Instance 클러스터 사용.  
* **데이터베이스:** RDS Single Instance (Multi-AZ 미적용, Read Replica 없음).  
* **접근 제어:** 사내 VPN 또는 특정 IP(Office)에서만 접근 가능하도록 Security Group 설정.

## **6\. 보안 아키텍처 (Security Architecture)**

### **6.1 네트워크 보안**

* **Private Subnet 원칙:** 모든 애플리케이션과 DB는 외부에서 직접 접근할 수 없는 Private Subnet에 배치한다.  
* **Bastion Host:** 운영자가 DB 등에 접근해야 할 경우, VPN을 통해 Bastion Host를 경유해서만 접근한다.

### **6.2 애플리케이션 보안**

* **Policy Module (PDP):** 비즈니스 로직 수행 전, 모든 요청은 Policy 모듈을 통해 권한(Role, Scope)이 검증된다.  
* **Secrets Management:** DB 비밀번호, API Key 등 민감 정보는 코드에 하드코딩하지 않고 **AWS Secrets Manager** 또는 **Vault**를 통해 런타임에 주입한다.