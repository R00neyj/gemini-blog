# Gemini Community Blog - 필요 이미지 자산 목록 (Required Assets)

PWA 기능 활성화 및 웹앱의 완성도를 위해 아래 이미지 파일들이 `public/` 디렉토리에 준비되어야 합니다.

## 1. PWA 및 파비콘 아이콘
이 파일들은 브라우저 탭, 모바일 홈 화면 설치 시 앱 아이콘으로 사용됩니다.

| 파일명 | 규격 | 용도 | 상태 |
| --- | --- | --- | --- |
| `favicon.ico` | 32x32 | 브라우저 탭 아이콘 | 필요 |
| `apple-touch-icon.png` | 180x180 | iOS 홈 화면 아이콘 | 필요 |
| `mask-icon.svg` | 가변 (SVG) | Safari 마스크 아이콘 | 필요 |
| `pwa-192x192.png` | 192x192 | Android/Chrome 표준 앱 아이콘 | 필요 |
| `pwa-512x512.png` | 512x512 | 고해상도 앱 아이콘 및 스플래시 화면 | 필요 |

## 2. 기본 로고 및 브랜딩
| 파일명 | 경로 | 용도 | 상태 |
| --- | --- | --- | --- |
| `logo.svg` | `src/assets/` | 서비스 메인 로고 (Navbar 등) | 필요 |
| `default-avatar.png` | `src/assets/` | 프로필 이미지가 없는 유저용 기본 이미지 | 필요 |

## 3. AI 이미지 생성 프롬프트 (Prompts)
외부 AI 도구(Midjourney, DALL-E, etc.)를 사용하여 이미지를 생성할 때 아래 프롬프트를 참고하세요.

### 🎨 앱 아이콘 & 로고 (App Icon & Logo)
**설명:** PWA 아이콘(`pwa-*.png`)과 메인 로고(`logo.svg`)로 사용할 수 있는 디자인입니다.
**Prompt:**
> A minimalist and modern app icon design for a tech community blog named "Gemini Community". The design should feature an abstract geometric symbol representing connection, constellations, or a twin star concept. Use a color palette of electric blue (#3B82F6) and deep violet on a dark charcoal (#222222) or transparent background. Vector style, flat design, high contrast, clean lines, rounded corners. No text.

### 👤 기본 사용자 프로필 (Default Avatar)
**설명:** `default-avatar.png`로 사용할 중성적이고 깔끔한 프로필 이미지입니다.
**Prompt:**
> A simple, flat vector illustration of a friendly robot face or a minimalist astronaut helmet, serving as a default user profile picture. Neutral colors (grey, slate blue, white). Circular frame, centered composition, clean vector art style, solid background color matching the UI theme (#334155). No text, no intricate details.

## 4. 생성 가이드 및 적용
1. **아이콘 생성**: 위 프롬프트로 생성된 이미지를 [RealFaviconGenerator](https://realfavicongenerator.net/) 같은 도구에 업로드하여 모든 사이즈(`favicon.ico`, `apple-touch-icon`, `pwa-*`)를 한 번에 생성하는 것을 추천합니다.
2. **파일 배치**:
   - 아이콘 파일들 → `public/` 폴더
   - `logo.svg` (또는 png), `default-avatar.png` → `src/assets/` 폴더
3. **코드 확인**: `vite.config.js`와 `index.html`에서 파일명이 일치하는지 확인하세요.