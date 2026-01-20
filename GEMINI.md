# Gemini Community Project Context

이 문서는 `gemini-community` 프로젝트의 기술 스택, 구조, 그리고 개발 컨벤션을 정의합니다. AI 에이전트 및 개발자는 이 문서를 참고하여 프로젝트의 일관성을 유지해야 합니다.

## 1. 프로젝트 개요 (Project Overview)

이 프로젝트는 **React 19**와 **Vite 7**을 기반으로 구축된 최신 프론트엔드 웹 애플리케이션입니다. 빠른 개발 환경(HMR)과 최적화된 빌드 시스템을 갖추고 있으며, ESLint를 통해 코드 품질을 관리하고 있습니다.

### 핵심 기술 스택
- **Framework:** React v19.2.0 (Functional Components, Hooks)
- **Build Tool:** Vite v7.2.4
- **Language:** JavaScript (ES Modules)
- **Linting:** ESLint v9 (Flat Config) + React Plugins
- **Styling:** Standard CSS

## 2. 시작하기 및 실행 (Build & Run)

프로젝트 루트에서 다음 명령어를 사용하여 의존성을 설치하고 애플리케이션을 실행할 수 있습니다.

### 의존성 설치
```bash
npm install
```

### 주요 스크립트 (`package.json`)
| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버를 시작합니다. (기본 포트: 5173) |
| `npm run build` | 프로덕션 배포를 위한 빌드를 수행합니다. (`dist` 폴더 생성) |
| `npm run lint` | ESLint를 실행하여 코드 스타일과 오류를 검사합니다. |
| `npm run preview` | 빌드된 결과물(`dist`)을 로컬에서 미리보기 합니다. |

## 3. 프로젝트 구조 (Directory Structure)

```text
gemini-community/
├── public/              # 정적 자원 (favicon, robots.txt 등)
├── src/                 # 소스 코드 메인 디렉토리
│   ├── assets/          # 컴포넌트 내부에서 import하여 사용하는 이미지/폰트
│   ├── App.css          # App 컴포넌트 전용 스타일
│   ├── App.jsx          # 메인 애플리케이션 컴포넌트
│   ├── index.css        # 전역 스타일 정의
│   └── main.jsx         # 애플리케이션 진입점 (Entry Point)
├── eslint.config.js     # ESLint 설정 (Flat Config)
├── vite.config.js       # Vite 빌드 설정
└── package.json         # 의존성 및 스크립트 관리
```

## 4. 개발 컨벤션 (Development Conventions)

### 코딩 스타일
- **컴포넌트:** 모든 컴포넌트는 함수형 컴포넌트(Functional Component)로 작성하며, React Hooks를 사용합니다.
- **모듈 시스템:** ES Modules (`import`/`export`) 문법을 엄격히 준수합니다.
- **Strict Mode:** `main.jsx`에서 `<StrictMode>`가 활성화되어 있으므로, 개발 모드에서 컴포넌트가 두 번 렌더링될 수 있음을 인지해야 합니다.
- **Type Safety:** 현재 TypeScript가 아닌 JavaScript(`type: module`) 프로젝트입니다. `prop-types` 사용이나 JSDoc을 통한 타입 힌트 제공을 권장합니다.

### 린팅 규칙 (ESLint)
- `eslint.config.js`에 정의된 Flat Config를 따릅니다.
- `react-hooks/recommended`: Hooks 규칙(의존성 배열 등)을 엄격히 준수해야 합니다.
- `no-unused-vars`: 사용되지 않는 변수는 에러로 처리됩니다. (단, `_`나 대문자로 시작하는 변수는 예외)

### 스타일링
- 전역 스타일은 `index.css`, 컴포넌트별 스타일은 해당 컴포넌트 이름과 매칭되는 CSS 파일(예: `App.css`)을 import하여 사용합니다.

## 5. 참고 사항
- 이미지 경로는 `public` 폴더의 경우 `/`로 접근하며, `src/assets`의 경우 import 문을 통해 사용합니다.
- Vite 환경 변수는 `import.meta.env` 객체를 통해 접근합니다.
