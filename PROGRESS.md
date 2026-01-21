# 프로젝트 진행 상황 (Project Progress)

## ✅ 완료된 작업 (Completed)

- [x] **프로젝트 초기 설정**
  - React + Vite 환경 구성
  - TailwindCSS 설치 및 설정
  - ESLint 설정
- [x] **기본 기능 구현**
  - 라우팅 설정 (React Router)
  - 인증 컨텍스트 (AuthContext) 구성
  - 기본 페이지 생성 (Home, Login, Signup 등)
- [x] **게시글 및 댓글 시스템**
  - 게시글 작성/수정/삭제 (CRUD)
  - 공개/비공개 설정
  - 댓글 작성/삭제 기능 구현 (`CommentSection`)
- [x] **PWA 및 모바일 최적화**
  - [x] Manifest 파일 생성 및 아이콘 설정
  - [x] Service Worker 등록 (vite-plugin-pwa)
  - [x] 모바일 설치 안내 UI (PWA Install FAB & Modal)
  - [x] iOS/Android 설치 가이드
  - [x] **PC QR코드 버튼 고도화**:
    - 색상(Accent Color) 및 Glassmorphism(투명도 40%, 블러) 적용
    - `DesktopQrButton` 컴포넌트 분리 및 중복 표시 버그 수정
    - 모달 디자인 개선 (닫기 버튼 시인성 강화)
- [x] **UI/UX 개선 및 디테일 최적화**
  - [x] `Layout` 컴포넌트 도입으로 구조 리팩토링
  - [x] **반응형 네비게이션 구조 개편**
    - [x] Desktop: 좌측 고정 `Sidebar` (토글 애니메이션 최적화)
    - [x] Mobile: 하단 플로팅 `BottomNav` (Apple UI 스타일, 둥근 모서리, 균등 간격)
  - [x] **UI 디테일 고도화**
    - [x] PC 사이드바: '내 블로그' 등 동적 경로 하이라이트 버그 수정
    - [x] PC 사이드바: 로고를 CSS 'G' 대신 PWA 로고 이미지로 교체
    - [x] PC 사이드바: **접힌 상태에서 로고 중앙 정렬 완벽 수정 (Gap 제거)**
    - [x] PC 사이드바: **비로그인 시 글쓰기/내블로그/설정 대신 로그인 버튼 표시**
    - [x] 설정 페이지: 입력 필드 모서리 둥글게(rounded-xl) 처리 및 투명 박스 스타일 적용
    - [x] 모바일 네비바: 높이 축소 및 선택된 아이템 라운드 값 증가(rounded-full)
    - [x] 모바일 FAB: 네비바 높이와 시각적 균형을 맞추도록 크기 조정
- [x] **코드 품질 관리**
  - [x] 전역적인 ESLint 오류 해결 (useEffect 의존성, 미사용 변수 등)

## 🚧 진행 중인 작업 (In Progress)

- **기능 고도화**
  - [ ] 게시글 작성/수정 시 Markdown 에디터 도입
  - [ ] 사용자 프로필 아이콘 커스터마이징 (이모지/심볼 조합)

## 📅 예정된 작업 (Upcoming)

- 검색 기능 구현
- 게시글 좋아요/북마크 기능
- 알림 센터 (댓글, 좋아요 알림)