# Gemini Community Blog

**Gemini Community Blog**는 React와 Supabase를 기반으로 구축된 현대적인 커뮤니티 블로그 플랫폼입니다.
사용자는 자신만의 블로그 공간을 가지며, 글을 작성하고 다른 사용자와 소통할 수 있습니다.

## ✨ 주요 기능

- **사용자별 블로그 주소**: `/blog/:username` 형태의 고유 주소 제공
- **글 작성 및 관리**: 마크다운(또는 텍스트) 기반의 게시글 작성, 수정, 삭제
- **다크 모드 UI**: 눈이 편안한 어두운 테마와 세련된 디자인 (Tailwind CSS v4)
- **반응형 웹 디자인**: 모바일과 데스크톱 모두에 최적화된 UI
- **인증 시스템**: Supabase Auth를 이용한 회원가입 및 로그인

## 🛠 기술 스택

- **Frontend**: React v19, Vite v7
- **Styling**: Tailwind CSS v4
- **Backend & Database**: Supabase (PostgreSQL, Auth)
- **Deployment**: (배포 예정)

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/R00neyj/gemini-blog.git
cd gemini-blog
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 Supabase 키를 입력하세요.
(`.env.example` 파일을 참고하세요.)

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173`으로 접속하여 확인합니다.

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.