# Gemini Community Blog - 프로젝트 기획서 (Project Planning)

## 1. 프로젝트 개요 (Overview)
본 프로젝트는 **React**와 **Supabase**를 활용하여 구축하는 사용자 중심의 블로그 플랫폼입니다. 사용자는 글을 작성, 수정, 삭제할 수 있으며, 타인의 글에 댓글을 달 수 있는 소셜 기능을 포함합니다. 또한 **PWA(Progressive Web App)** 기술을 적용하여 모바일 및 데스크탑 환경에서 네이티브 앱처럼 설치하여 사용할 수 있습니다.

## 2. 기술 스택 (Tech Stack)
- **Frontend:** React v19, Vite v7
- **Language:** JavaScript (ES Modules)
- **Styling:** TailwindCSS
- **Color Palette:**
  - Primary (60%): `#222222`
  - Secondary (30%): `#334155`
  - Accent (10%): `#3B82F6`
- **Backend & Database:** Supabase (PostgreSQL, Auth, Realtime)
- **PWA:** vite-plugin-pwa
- **Deployment:** Vercel or Netlify (추후 결정)

## 3. 핵심 기능 명세 (Functional Requirements)

### 3.1. 인증 (Authentication)
- **로그인/로그아웃:** 이메일/비밀번호 또는 소셜 로그인(GitHub/Google) 지원.
- **회원가입:** 신규 사용자 등록.
- **세션 관리:** 로그인 상태 유지 및 보호된 라우트 접근 제어.

### 3.2. 블로그 게시글 관리 (Blog Post Management)
- **게시글 작성 (Create):** 제목, 본문 작성. (Markdown 에디터 또는 텍스트 에디터 도입 고려)
- **게시글 목록 (Read):**
  - **전체 글 목록:** 공개(Public)된 모든 사용자의 글 조회.
  - **내 글 목록:** 내가 작성한 글(공개/비공개 포함) 조회.
- **게시글 상세 (Read Detail):** 개별 게시글의 전체 내용 조회.
- **게시글 수정 (Update):** 본인 글에 한해 내용 수정 가능.
- **게시글 삭제 (Delete):** 본인 글에 한해 삭제 가능.
- **공개 범위 설정:** 작성/수정 시 `Public`(공개) 또는 `Private`(비공개) 설정 가능. (기본값: Public)

### 3.3. 댓글 시스템 (Comment System)
- **댓글 작성:** 타인 또는 본인의 게시글에 댓글 등록.
- **댓글 목록:** 게시글 하단에 댓글 리스트 표시.
- **권한:** 로그인한 사용자만 댓글 작성 가능.

### 3.4. PWA (Progressive Web App)
- **설치 가능:** 브라우저 주소창 또는 설정 메뉴를 통해 홈 화면에 앱 추가 가능.
- **오프라인 지원:** 캐싱을 통해 오프라인 상태에서도 기본 UI 로드 (선택 사항).
- **Manifest:** 앱 아이콘, 이름, 테마 색상 설정.

## 4. 데이터베이스 스키마 설계 (Database Schema - Supabase)

### `profiles` (Users)
Supabase Auth의 `users` 테이블과 연동되는 프로필 테이블
- `id` (UUID, PK, FK to auth.users)
- `username` (Text)
- `avatar_url` (Text)
- `created_at` (Timestamp)

### `posts`
- `id` (UUID, PK)
- `user_id` (UUID, FK to profiles.id)
- `title` (Text)
- `content` (Text)
- `is_public` (Boolean, Default: true)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### `comments`
- `id` (UUID, PK)
- `post_id` (UUID, FK to posts.id)
- `user_id` (UUID, FK to profiles.id)
- `content` (Text)
- `created_at` (Timestamp)

## 5. 페이지 구조 (Routing)
- `/`: 홈 (전체 공개 글 목록)
- `/login`: 로그인 페이지
- `/signup`: 회원가입 페이지
- `/write`: 새 글 작성 (로그인 필요)
- `/post/:id`: 게시글 상세 및 댓글
- `/post/:id/edit`: 게시글 수정 (본인 확인 필요)
- `/my-blog`: 내 글 목록 관리 (로그인 필요)

## 6. 개발 로드맵
1. **환경 설정:** 프로젝트 초기화, PWA 플러그인 설정, 라우터 설정.
2. **Supabase 연동:** 프로젝트 생성, 테이블 구축, 클라이언트 연결.
3. **인증 구현:** 로그인, 회원가입 UI 및 로직.
4. **게시글 기능:** CRUD 및 공개/비공개 토글 구현.
5. **댓글 기능:** 게시글 상세 페이지 내 댓글 구현.
6. **PWA 적용:** Manifest 및 Service Worker 설정.
7. **UI/UX 개선:** 스타일링 및 사용자 경험 최적화.
