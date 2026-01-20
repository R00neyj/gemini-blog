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

## 3. 생성 가이드
- **배경색:** 주조색(`#0D1326`) 또는 흰색 배경 권장.
- **아이콘 스타일:** `pwa-` 아이콘들은 여백이 충분한 원형 또는 둥근 사각형 디자인이 좋습니다.
- **도구 추천:** [RealFaviconGenerator](https://realfavicongenerator.net/) 또는 [Maskable.app](https://maskable.app/editor) 등을 사용하여 규격별 아이콘을 일괄 생성할 수 있습니다.

---
*참고: `vite.config.js`의 `manifest` 설정에 위 파일명들이 등록되어 있습니다.*
