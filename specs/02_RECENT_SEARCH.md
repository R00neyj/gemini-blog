# 기능 명세서: 최근 검색어 저장 (Recent Search History)

## 1. 개요 (Overview)
사용자가 검색한 키워드를 브라우저의 로컬 스토리지(`localStorage`)에 저장하여, 이후 검색 페이지 진입 시 최근 검색했던 단어들을 빠르게 재검색할 수 있도록 돕습니다.

## 2. 요구사항 (Requirements)

### 2.1. 저장 로직
- **저장 시점:** 사용자가 검색어를 입력하고 검색 버튼을 누르거나 엔터(Enter)를 쳤을 때.
- **저장소:** 브라우저 `localStorage`.
- **키 이름:** `recent_searches` (JSON Array string).
- **최대 개수:** 최근 10개까지만 유지 (FIFO 구조: 가장 오래된 검색어 삭제).
- **중복 처리:** 이미 존재하는 검색어를 다시 검색하면, 기존 항목을 제거하고 최상단(최신)으로 올림.
- **빈 값 처리:** 공백(`trim()`) 검색어는 저장하지 않음.

### 2.2. UI/UX
- **표시 위치:** 검색 입력창 하단 또는 검색 결과가 없을 때 초기 화면.
- **표시 시점:** 검색 입력창이 비어있거나, 포커스(Focus) 되었을 때 (또는 상시 표시).
- **리스트 아이템:**
  - 검색어 텍스트 (클릭 시 즉시 검색 실행).
  - 삭제(X) 버튼 (클릭 시 해당 검색어만 목록에서 제거).
- **전체 삭제:** 목록 상단 또는 하단에 "최근 검색어 지우기" 버튼 제공.

## 3. 구현 로직 (Implementation Logic)

### 3.1. Hook 생성 (`useRecentSearches`)
- 로컬 스토리지 CRUD를 담당하는 커스텀 훅을 만들어 관리합니다.
- `searches` (state): 검색어 배열.
- `addSearch(term)`: 검색어 추가 함수.
- `removeSearch(term)`: 개별 삭제 함수.
- `clearSearches()`: 전체 삭제 함수.

### 3.2. 컴포넌트 수정 (`Search.jsx`)
- 검색 실행 핸들러(`handleSearch`)에서 `addSearch` 호출.
- 검색 결과가 없거나 입력 전일 때 `RecentSearchList` 컴포넌트 렌더링.

## 4. 작업 단위 (Tasks)
1. [Logic] `useRecentSearches` 커스텀 훅 구현.
2. [UI] `Search.jsx` 내부에 최근 검색어 목록 UI 섹션 추가.
3. [UI] 검색어 클릭 이벤트 및 삭제 이벤트 연동.
