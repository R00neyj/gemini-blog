# 기능 명세서: 성능 최적화 (Performance Optimization)

## 1. 개요 (Overview)
애플리케이션의 초기 로딩 속도를 개선하고, 불필요한 네트워크 리소스 낭비를 줄이기 위해 이미지 지연 로딩(Lazy Loading)과 코드 스플리팅을 적용합니다.

## 2. 요구사항 (Requirements)

### 2.1. 이미지 지연 로딩 (Image Lazy Loading)
- **대상:**
  - 게시글 목록의 썸네일 (향후 썸네일 추가 시).
  - 게시글 본문 내의 고용량 이미지.
  - 사용자 아바타 (목록 등 다수 렌더링 시).
- **기술:**
  - HTML 표준 `loading="lazy"` 속성 활용.
  - 또는 `react-lazy-load-image-component` 라이브러리 도입 (스켈레톤 UI, 블러 효과 등이 필요할 경우).
  - 현재는 표준 속성(`loading="lazy"`)과 `decoding="async"` 조합을 우선 적용.

### 2.2. 코드 스플리팅 (Code Splitting)
- **대상:** 라우트 단위 분할.
- **적용:** `React.lazy`와 `Suspense`를 사용하여 초기 번들 사이즈를 줄입니다.
  - `Write`, `PostEdit`, `Settings` 등 초기 진입에 필수적이지 않은 페이지들을 분리.

### 2.3. 에셋 최적화
- **폰트:** 서브셋 폰트 사용 또는 `preload` 적용 검토. (현재 Pretendard CDN 사용 중이므로 캐싱 정책 확인)
- **아이콘:** SVG 아이콘을 컴포넌트화하거나 스프라이트 방식 고려.

## 3. 구현 로직 (Implementation Logic)

### 3.1. 컴포넌트 수정
- **`Avatar.jsx`**: `img` 태그에 `loading="lazy"` 속성 추가.
- **Markdown 렌더러**: 게시글 본문 이미지에 lazy loading 적용.

### 3.2. 라우터 수정 (`main.jsx` or `App.jsx`)
- 페이지 컴포넌트 import 문을 동적 import로 변경.
- `<Suspense fallback={<Loading />}>` 래퍼 적용.

## 4. 작업 단위 (Tasks)
1. [Refactor] `App.jsx` 라우트 컴포넌트에 `React.lazy` 적용.
2. [UI] `Avatar` 및 주요 이미지 엘리먼트에 `loading="lazy"` 추가.
3. [Test] Network 탭에서 번들 분할 및 이미지 로딩 시점 확인.
