# **디자인 시스템 가이드 (Design System Guide)**

## **1\. 개요 (Overview)**

본 문서는 전담 디자이너 없이 개발팀이 일관된 사용자 경험(UX)과 인터페이스(UI)를 구축하기 위한 표준 가이드라인이다.  
HR 시스템의 특성상 \*\*"신뢰성(Trust)", "명확성(Clarity)", "효율성(Efficiency)"\*\*을 최우선 가치로 둔다.

## **2\. 디자인 원칙 (Principles)**

1. **데이터 중심 (Data-First):** 화려한 그래픽보다 데이터(텍스트, 숫자)의 가독성을 우선한다.  
2. **예측 가능성 (Predictability):** 모든 버튼, 입력창, 모달의 동작과 위치는 시스템 전체에서 일관되어야 한다.  
3. **상태의 명확화 (Clear Status):** '승인', '반려', '대기' 등의 상태는 색상과 아이콘으로 명확히 구분되어야 한다.

## **3\. 컬러 시스템 (Color System)**

Tailwind CSS의 기본 컬러 팔레트를 활용하되, 의미(Semantic)를 부여하여 사용한다.  
멀티 테넌트 지원을 위해 Primary Color는 CSS Variable로 관리한다.

### **3.1 브랜드 컬러 (Brand Colors)**

| 역할 | 변수명 | 기본값 (Tailwind) | 용도 |
| :---- | :---- | :---- | :---- |
| **Primary** | \--color-primary | Indigo-600 (\#4F46E5) | 주요 버튼, 활성 링크, 강조 텍스트 |
| **Primary Hover** | \--color-primary-dark | Indigo-700 (\#4338CA) | Primary 버튼 호버 상태 |
| **Background** | \--color-bg-base | Slate-50 (\#F8FAFC) | 전체 페이지 배경색 |

### **3.2 상태 컬러 (Status Colors) \- HR 핵심**

| 상태 | 색상 계열 | 용도 (배지/텍스트) | 예시 |
| :---- | :---- | :---- | :---- |
| **Success** | Emerald-600 | 승인 완료, 정상, 출근 | bg-emerald-100 text-emerald-800 |
| **Warning** | Amber-500 | 결재 대기, 검토 중, 지각 | bg-amber-100 text-amber-800 |
| **Danger** | Rose-600 | 반려, 삭제, 퇴사, 결근 | bg-rose-100 text-rose-800 |
| **Info** | Blue-500 | 진행 중, 임시 저장 | bg-blue-100 text-blue-800 |
| **Neutral** | Slate-500 | 취소, 미정, 휴직 | bg-slate-100 text-slate-800 |

### **3.3 텍스트 컬러 (Typography Colors)**

| 역할 | 색상 (Tailwind) | 용도 |
| :---- | :---- | :---- |
| **Title** | Slate-900 | 페이지 타이틀, 모달 헤더 |
| **Body** | Slate-700 | 본문, 테이블 데이터, 입력값 |
| **Sub/Hint** | Slate-500 | 도움말, 플레이스홀더, 비활성 텍스트 |
| **Disabled** | Slate-300 | 비활성 버튼 텍스트 |

## **4\. 타이포그래피 (Typography)**

가독성이 뛰어난 산세리프 서체를 사용한다.

* **한글/영문:** Pretendard (표준), Inter (대안)

### **4.1 폰트 스케일 (Font Scale)**

| 역할 | 사이즈 (Size) | 두께 (Weight) | 행간 (Line Height) | Tailwind Class |
| :---- | :---- | :---- | :---- | :---- |
| **H1 (Page Title)** | 24px (1.5rem) | Bold (700) | 32px | text-2xl font-bold |
| **H2 (Section)** | 20px (1.25rem) | SemiBold (600) | 28px | text-xl font-semibold |
| **H3 (Card Title)** | 18px (1.125rem) | SemiBold (600) | 28px | text-lg font-semibold |
| **Body (Default)** | 16px (1rem) | Regular (400) | 24px | text-base |
| **Small (Hint)** | 14px (0.875rem) | Regular (400) | 20px | text-sm |
| **Tiny (Label)** | 12px (0.75rem) | Medium (500) | 16px | text-xs font-medium |

## **5\. UI 컴포넌트 가이드 (Components)**

### **5.1 버튼 (Buttons)**

버튼은 높이 40px (Small: 32px)을 표준으로 하며, Rounded-md (4px\~6px) 코너를 사용한다.

* **Primary (주요 액션):** bg-\[--color-primary\] text-white hover:bg-\[--color-primary-dark\]  
  * *예: 저장, 승인, 신청*  
* **Secondary (보조 액션):** bg-white border border-slate-300 text-slate-700 hover:bg-slate-50  
  * *예: 취소, 돌아가기, 임시저장*  
* **Danger (위험 액션):** bg-rose-600 text-white hover:bg-rose-700  
  * *예: 삭제, 반려*  
* **Ghost (아이콘 버튼):** bg-transparent text-slate-500 hover:bg-slate-100  
  * \*예: 닫기(X), 더보기(...)\_

### **5.2 입력 폼 (Forms)**

* **Input/Select:**  
  * 높이: 40px  
  * Border: border-slate-300  
  * Focus: ring-2 ring-\[--color-primary\] ring-offset-1  
  * Error: border-rose-500 ring-rose-200  
* **Label:** Input 상단에 위치, text-sm font-medium text-slate-700.

### **5.3 데이터 그리드 (Data Grid / Table)**

HR 시스템의 핵심 컴포넌트이다.

* **Header:** bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider.  
* **Row:** bg-white border-b border-slate-200 hover:bg-slate-50 transition-colors.  
* **Cell Padding:** px-6 py-4 whitespace-nowrap.  
* **Pagination:** 테이블 하단 우측 정렬.

### **5.4 모달 (Modal)**

* **Overlay:** bg-black/50 backdrop-blur-sm (반투명 검정 \+ 블러).  
* **Container:** bg-white rounded-lg shadow-xl.  
* **Size:**  
  * Small (알림): max-w-sm  
  * Medium (일반 폼): max-w-md  
  * Large (상세 정보): max-w-2xl

## **6\. 레이아웃 및 간격 (Layout & Spacing)**

### **6.1 간격 시스템 (Spacing System)**

Tailwind의 4배수 시스템을 준수한다.

* **Compact:** 4px (1), 8px (2) \- 아이콘과 텍스트 사이.  
* **Default:** 16px (4) \- 컴포넌트 내부 패딩 (p-4).  
* **Section:** 24px (6), 32px (8) \- 카드 간 간격, 섹션 간 간격.  
* **Layout:** 48px (12) 이상 \- 큰 레이아웃 구분.

### **6.2 반응형 브레이크포인트 (Breakpoints)**

* **Mobile:** \< 640px (1열 레이아웃, 햄버거 메뉴)  
* **Tablet:** 640px \~ 1024px (사이드바 축소)  
* **Desktop:** \> 1024px (사이드바 고정, 다단 레이아웃)

## **7\. 아이콘 (Iconography)**

일관된 두께(Stroke)와 스타일을 가진 오픈소스 아이콘 라이브러리를 사용한다.

* **추천 라이브러리:** **Lucide React** (Tailwind와 호환성 최상, 깔끔함)  
* **사이즈 표준:**  
  * 버튼 내부: w-4 h-4 (16px)  
  * 메뉴 아이콘: w-5 h-5 (20px)  
  * 강조 아이콘: w-6 h-6 (24px)  
* **색상:** 텍스트 색상(currentColor)을 따라가도록 설정.

## **8\. 테넌트 커스터마이징 가이드 (Theming)**

tailwind.config.js 설정을 통해 테넌트별 테마를 지원한다.

// tailwind.config.js 예시  
module.exports \= {  
  theme: {  
    extend: {  
      colors: {  
        primary: {  
          DEFAULT: 'var(--color-primary)', // CSS 변수 매핑  
          dark: 'var(--color-primary-dark)',  
        },  
      },  
    },  
  },  
};

* **구현:** 백엔드에서 TenantConfig로 색상 코드를 내려주면, 프론트엔드 최상위 레이아웃(layout.tsx)에서 style 태그로 CSS 변수를 주입한다.  
  \<div style={{ '--color-primary': config.themeColor } as React.CSSProperties}\>  
    {children}  
  \</div\>

## **9\. 컴포넌트 개발 및 문서화 도구 (Storybook) \[NEW\]**

일관된 UI 품질 유지와 디자이너와의 원활한 협업을 위해 **Storybook**을 필수 개발 도구로 사용한다.

### **9.1 도입 목적**

1. **격리된 개발 환경 (Isolation):** 복잡한 비즈니스 로직이나 데이터 연동 없이, UI 컴포넌트만 독립적으로 개발하고 테스트한다.  
2. **살아있는 문서 (Living Documentation):** 코드가 수정되면 문서(Storybook)도 자동으로 업데이트되어, 항상 최신 디자인 가이드 상태를 유지한다.  
3. **인터랙티브 테스트 (Interactive Testing):** Controls 패널을 통해 다양한 Props(상태, 색상, 사이즈) 변화를 즉시 시뮬레이션한다.

### **9.2 작성 가이드라인**

* **대상:** shared/ui 내의 모든 공통 컴포넌트(Button, Input, Modal 등)는 필수적으로 Story 파일을 포함해야 한다.  
* **경로:** 컴포넌트 파일과 동일한 위치에 생성한다. (예: Button.tsx \-\> Button.stories.tsx)  
* **필수 포함 항목:**  
  * **Default Story:** 컴포넌트의 기본 상태.  
  * **Variants:** 주요 변형 상태 (예: Primary, Secondary, Danger, Disabled).  
  * **Controls:** ArgsType을 정의하여 테넌트 테마 컬러나 텍스트를 동적으로 변경해 볼 수 있어야 한다.  
* **접근성 체크:** addon-a11y를 통해 명도 대비(Contrast Ratio) 등 웹 접근성 준수 여부를 자동 점검한다.