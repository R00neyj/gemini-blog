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
- **비밀번호 재설정 (Forgot Password):** 이메일을 통한 비밀번호 재설정 링크 발송 및 변경 기능.
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

### 3.4. 사용자 설정 및 프로필 (User Settings) - [New]
- **프로필 수정:** 사용자의 닉네임(이름) 수정.
- **아바타 커스터마이징:** 
  - 서버 리소스 절약을 위해 이미지 업로드 대신 이모지(Emoji)와 구글 심볼(Google Symbols)을 조합하여 나만의 아바타 생성.
  - 배경색 선택 기능 제공.
- **비밀번호 변경:** 보안을 위해 비밀번호를 변경하는 기능 (프로필 수정 페이지 내 포함).
- **진입점:** 내 블로그 화면 또는 내비게이션 바에서 접근.

### 3.5. 모바일 접근성 및 PWA (Mobile Accessibility) - [Updated]
- **설치 지원:** 브라우저 주소창 또는 설정 메뉴를 통해 홈 화면에 앱 추가 가능.
- **QR 코드 공유:** 홈 화면 우측 하단에 QR 코드 버튼(FAB) 배치. 클릭 시 현재 사이트 URL의 QR 코드를 모달로 띄워 모바일 기기에서 쉽게 접속/설치 유도.
- **Manifest:** 앱 아이콘, 이름, 테마 색상 설정.

### 3.6. 푸시 알림 시스템 (Push Notifications) - [New]
- **구독 관리:** 설정 페이지에서 알림 수신 동의/거부 토글 제공.
- **웹 푸시:** Service Worker와 Web Push API를 활용한 알림 전송.
- **알림 트리거:** 내 글에 댓글이 달렸을 때 작성자에게 즉시 푸시 알림 발송 (Supabase Edge Function 활용).

## 4. 데이터베이스 스키마 설계 (Database Schema - Supabase)

### `profiles` (Users)
Supabase Auth의 `users` 테이블과 연동되는 프로필 테이블
- `id` (UUID, PK, FK to auth.users)
- `username` (Text)
- `avatar_url` (Text)
- `created_at` (Timestamp)

### `push_subscriptions` (Push Notifications) - [New]
사용자의 웹 푸시 구독 정보 저장
- `id` (UUID, PK)
- `user_id` (UUID, FK to auth.users)
- `subscription` (JSONB - Endpoint, Keys)
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
- `/`: 홈 (전체 공개 글 목록 + QR 코드 FAB)
- `/login`: 로그인 페이지
- `/signup`: 회원가입 페이지
- `/reset-password`: 비밀번호 재설정 페이지 (이메일 입력 또는 새 비번 입력)
- `/write`: 새 글 작성 (로그인 필요)
- `/post/:id`: 게시글 상세 및 댓글
- `/post/:id/edit`: 게시글 수정 (본인 확인 필요)
- `/blog/:username`: 사용자별 블로그 홈 (내 블로그)
- `/settings`: 프로필 수정 및 비밀번호 변경 페이지 (신규)

## 6. 개발 로드맵
1. **환경 설정:** 프로젝트 초기화, PWA 플러그인 설정, 라우터 설정.
2. **Supabase 연동:** 프로젝트 생성, 테이블 구축, 클라이언트 연결.
3. **인증 구현:** 로그인, 회원가입 UI 및 로직.
4. **게시글 기능:** CRUD 및 공개/비공개 토글 구현.
5. **댓글 기능:** 게시글 상세 페이지 내 댓글 구현.
6. **PWA 적용:** Manifest 및 Service Worker 설정.
7. **기능 추가 (Sprint 2):**
   - 사용자 설정 페이지 (프로필/비밀번호 수정).
   - 모바일 설치 유도용 QR 코드 버튼.
8. **UI/UX 개선 및 디테일 최적화 (완료):** 
   - 내비게이션 바 아이콘 적용 및 인터랙션 애니메이션 고도화.
   - **반응형 네비게이션 구조 개편:**
     - **PC/Desktop:** 좌측 고정 사이드바(Sidebar) 구현 및 최적화.
       - '내 블로그' 등 동적 경로 하이라이트 적용.
       - 로고를 PWA 이미지로 교체 및 접힌 상태에서의 완벽한 중앙 정렬 실현.
     - **Mobile:** 최신 Apple UI 스타일의 하단 플로팅 네비게이션 바(BottomNav) 및 FAB 최적화.
       - 높이 축소 및 Glassmorphism 디자인 디테일 강화.
   - **디자인 시스템 일관성:**
     - 설정 페이지 등 주요 입력 필드에 둥근 모서리(rounded-xl) 투명 박스 스타일 적용.
   - **푸시 알림 구현:** Edge Function 및 Web Push 연동.
   - **레이아웃 고도화:** 데스크탑 2열 그리드 적용.

9. **추후 구현 예정 (Future Features):**
   - **프로필 아이콘 커스터마이징:** 이모지와 구글 심볼(Material Symbols)을 활용한 아바타 생성기 구현 (서버 업로드 대체).