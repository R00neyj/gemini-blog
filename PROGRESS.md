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
  - **대댓글(답글) 시스템 (2026-01-26)**
    - DB 스키마 업데이트 (`parent_id` 추가)
    - 재귀적 UI 컴포넌트 구현 (`CommentItem`)
    - 답글 작성/삭제 및 UI 들여쓰기 처리
- [x] **검색 시스템 (2026-01-26)**
  - 제목/내용 기반 검색 (`ilike`)
  - **최근 검색어 기능 (Search History)**
    - 로컬 스토리지 기반 검색어 저장/삭제/전체삭제
    - 최근 10개 키워드 유지 및 중복 제거
  - **검색어 하이라이팅**: 검색 결과 내 일치하는 텍스트 강조 표시
- [x] **성능 최적화 (2026-01-26)**
  - **Code Splitting**: `React.lazy` 및 `Suspense`를 적용하여 라우트 단위 번들 분할 (`App.jsx`)
  - **이미지 지연 로딩**: `loading="lazy"` 및 `decoding="async"` 속성 적용
- [x] **PWA 및 모바일 최적화**
  - [x] Manifest 파일 생성 및 아이콘 설정
  - [x] Service Worker 등록 (vite-plugin-pwa)
  - [x] 모바일 설치 안내 UI (PWA Install FAB & Modal)
  - [x] **PC QR코드 버튼 고도화**:
    - 색상(Accent Color) 및 Glassmorphism(투명도 40%, 블러) 적용
    - `DesktopQrButton` 컴포넌트 분리
- [x] **UI/UX 개선 및 디테일 최적화**
  - [x] `Layout` 컴포넌트 도입으로 구조 리팩토링
  - [x] **반응형 네비게이션 구조 개편**
    - Desktop: 좌측 고정 `Sidebar`
    - Mobile: 하단 플로팅 `BottomNav`
  - [x] **모바일 네비게이션 고도화 (2026-01-26)**:
    - 스크롤 방향에 따른 BottomNav 자동 숨김/표시 (Hide on scroll down)
    - 에디터 페이지(`Write`, `Edit`) 진입 시 BottomNav 자동 숨김
    - 프로필 버튼 스타일 및 높이 일관성 확보
  - [x] **UI 디테일 고도화**
    - 모바일 네비바 블러 효과 수정 (Wrapper div로 스타일 이동하여 `backdrop-blur` 정상화)
    - 모바일 하단바 아이템 간 `gap-1` 추가
    - 설정 페이지 UI 개선 (투명 박스 스타일, 아바타 가로 스크롤 색상 피커, 확장형 그리드)
    - **PWA 설치 FAB 개선**: 백드랍 블러 클리핑 수정 및 네비바와 가시성 동기화
  - [x] **디자인 미니멀리즘 및 브랜드 강화**:
    - Notion 스타일 다크 모드 (`#191919`)
    - 레이아웃 여백 최적화 (24px)
    - 폰트 시스템 개편 (Pretendard)
    - 이미지/아바타 Lazy Loading 적용 (`loading="lazy"`, `decoding="async"`)
- [x] **기능 고도화**
  - [x] **사용자 프로필 아이콘 커스터마이징** (이모지/심볼 조합)
  - [x] **Markdown 에디터 최적화 (2026-01-26)**
    - PC: 1:1 실시간 가로 분할 뷰 고정
    - 모바일: 작성 집중 모드 (`preview="edit"`) 자동 전환
    - 툴바 드랍다운 메뉴 스타일 및 클리핑 문제 해결
    - 폰트 일관성 적용 (Pretendard)
  - [x] **푸시 알림 및 알림 센터 (2026-01-26)**
    - [x] 알림 삭제 RLS 정책 추가 및 정상화
    - [x] 알림 설정(Push Toggle) 권한 체크 및 RLS Update 정책 수정 완료
    - [x] 실시간 알림 뱃지 및 연동

## 🚧 진행 중인 작업 (In Progress)



- [ ] **검색 기능 강화**: 사용자 프로필 아이디(Username) 검색 가능하도록 확장

- [ ] **배포 설정 최적화**: SPA 라우팅 규칙 및 디렉토리 설정 최종 확인 (Netlify 등)

- [ ] **알림 시스템 고도화**: 알림 클릭 후 해당 게시글 이동 시 '읽음' 처리 연동





## 📅 예정된 작업 (Upcoming)



- **안정성 확보**: Global Error Boundary 구현

- **기술 스택 업그레이드**: TypeScript 마이그레이션

- **SEO 최적화**: 메타 태그 및 소셜 공유 미리보기 설정
