# Gemini Community Blog - 개발 진척도 (Progress Tracking)

## 1. 초기 설정 (Setup)
- [x] React + Vite 프로젝트 구조 확인 및 정리
- [x] `react-router-dom` 설치 및 라우팅 구조 잡기
- [x] Supabase 클라이언트 라이브러리 설치 (`@supabase/supabase-js`)
- [x] TailwindCSS 설치 및 색상 팔레트 설정 (Primary, Secondary, Accent)
- [x] 스타일링 기본 구조 잡기 (CSS Reset 및 공통 스타일)

## 2. PWA 설정 (Progressive Web App)
- [x] `vite-plugin-pwa` 설치
- [x] `manifest.webmanifest` 설정 (아이콘, 이름, 색상)
- [x] 서비스 워커(Service Worker) 설정 및 오프라인 페이지 대응 확인

## 3. 백엔드 및 데이터베이스 (Supabase)
- [x] Supabase 프로젝트 생성
- [x] **Table 생성:** `profiles`
- [x] **Table 생성:** `posts` (RLS 정책 설정: 공개 글은 누구나 읽기 가능, 작성/수정은 본인만)
- [x] **Table 생성:** `comments` (RLS 정책 설정)
- [x] 환경 변수(`.env`) 설정

## 4. 기능 구현 - 인증 (Authentication)
- [x] 로그인 페이지 UI 구현
- [x] 회원가입 페이지 UI 구현
- [x] Supabase Auth 연동 (로그인/로그아웃/회원가입 로직)
- [x] AuthContext 또는 전역 상태 관리로 유저 세션 관리
- [x] Protected Route 구현 (로그인 안 된 유저 접근 제한)
- [x] **비밀번호 재설정:** `/reset-password` 페이지 구현 (이메일 발송)

## 5. 기능 구현 - 게시글 (Posts)
- [x] **Create:** 게시글 작성 페이지 UI 및 로직 (공개/비공개 선택 포함)
- [x] **Read (List):** 메인 페이지 (모든 공개 글 목록)
- [x] **Read (List):** 내 블로그 페이지 (내 글 전체 목록, 비공개 포함)
- [x] **Read (Detail):** 게시글 상세 보기 페이지
- [x] **Update:** 게시글 수정 기능
- [x] **Delete:** 게시글 삭제 기능

## 6. 기능 구현 - 댓글 (Comments)
- [x] 댓글 작성 컴포넌트 UI
- [x] 댓글 목록 컴포넌트 UI
- [x] 게시글 상세 페이지에 댓글 통합

## 7. 추가 기능 (Sprint 2)
- [x] **사용자 설정:** 프로필(닉네임) 수정 및 비밀번호 변경 기능 (`/settings`)
- [x] **모바일 접근성:** 홈 화면 QR 코드 버튼(FAB) 및 모달 구현

## 8. 최적화 및 배포 (Refinement & Deployment)
- [x] **UI 개선:** 내비게이션 바 메뉴(홈, 글쓰기, 내 블로그, 설정)에 아이콘 추가
- [x] **UI 개선:** 프리미엄 애니메이션 추가 (Fade-in, Slide-up, Hover Effects, Mobile Menu Slide-down)
- [x] **UI 최적화:** 모바일 화면에서 불필요한 QR FAB 버튼 숨김 처리
- [x] **UX 개선:** Native Alert/Confirm을 Toast 알림(`react-hot-toast`)으로 교체
- [x] **Refactoring:** 게시글 상세 페이지(`PostDetail`) 컴포넌트 분리 (`PostHeader`, `CommentSection`)
- [ ] 버그 수정 및 테스트
- [ ] 최종 빌드 확인 (`npm run build`)
