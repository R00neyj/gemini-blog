# 기능 명세서: 대댓글 (답글) 시스템 (Nested Comments)

## 1. 개요 (Overview)
기존의 1차원적인 댓글 시스템을 확장하여, 특정 댓글에 대한 답글(Reply)을 작성할 수 있는 **계층형 댓글(Nested Comments)** 구조를 구현합니다. 이를 통해 사용자 간의 구체적인 소통과 토론을 지원합니다.

## 2. 데이터베이스 스키마 설계 (Database)

### `comments` 테이블 수정
`parent_id` 컬럼을 추가하여 자기 참조 관계(Self-Referencing)를 설정합니다.

```sql
ALTER TABLE comments 
ADD COLUMN parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;
-- parent_id가 NULL이면 최상위 댓글, 값이 있으면 답글(대댓글)
```

## 3. UI/UX 요구사항

### 3.1. 댓글 목록 표시
- **계층 구조 시각화:**
  - 최상위 댓글은 기존대로 표시됩니다.
  - 답글은 부모 댓글 하단에 들여쓰기(Indentation)되어 표시됩니다. (예: `ml-8` or `pl-4 border-l`)
  - 모바일에서는 들여쓰기 공간 확보를 위해 깊이(Depth) 제한을 두거나, UI를 간소화합니다. (최대 2 depth 권장: 댓글 -> 답글)
- **답글 정렬:**
  - 최상위 댓글: 최신순(DESC) 또는 등록순(ASC) (현재 정책 유지)
  - 답글: 등록순(ASC)으로 정렬하여 대화의 흐름이 자연스럽게 보이도록 함.

### 3.2. 답글 작성 (Reply Action)
- **답글 버튼:** 각 댓글 하단(좋아요/삭제 버튼 옆)에 '답글 달기' 텍스트 버튼 배치.
- **입력 폼:**
  - 버튼 클릭 시 해당 댓글 바로 아래에 답글 작성 폼이 나타납니다 (Toggle).
  - 폼 디자인은 메인 댓글 작성 폼과 유사하되, 더 컴팩트하게 구성합니다.
  - `취소` 버튼을 두어 작성을 중단할 수 있어야 합니다.

### 3.3. 알림 (Notifications)
- 내 댓글에 답글이 달리면 `notifications` 테이블에 알림이 생성되어야 합니다.
- `type`: 'comment' (기존 재사용) 또는 'reply'로 구분 (로직상 'comment'로 통일해도 무방).
- 알림 메시지: "OOO님이 회원님의 댓글에 답글을 남겼습니다."

## 4. 구현 로직 (Implementation Logic)

### 4.1. 데이터 조회 (Select)
- Supabase Query 시 `comments` 테이블을 조회하되, 클라이언트 사이드에서 `id`와 `parent_id`를 기반으로 트리를 구성하거나, 
- 1차원 배열로 가져온 후 렌더링 시점에 필터링하여 매핑합니다. (데이터 양이 많지 않으므로 후자 권장)

### 4.2. 데이터 저장 (Insert)
- 답글 작성 시 `post_id`는 유지하고, `parent_id`에 부모 댓글의 ID를 포함하여 INSERT 합니다.

### 4.3. 삭제 (Delete)
- `ON DELETE CASCADE` 설정에 의해 부모 댓글 삭제 시 하위 답글도 자동 삭제됩니다.
- UI에서는 "삭제된 댓글입니다"로 표시하고 대댓글을 유지할지, 아예 지울지 결정해야 함. (현재 MVP는 완전 삭제 방식 채택)

## 5. 작업 단위 (Tasks)
1. [DB] `comments` 테이블에 `parent_id` 컬럼 추가 마이그레이션 적용.
2. [Frontend] `CommentSection.jsx` 컴포넌트 구조 변경 (재귀적 렌더링 또는 분리).
3. [Frontend] 댓글 아이템(`CommentItem`) 컴포넌트 분리 및 답글 폼 구현.
4. [Backend] 알림 트리거 로직 점검 (대댓글 작성 시 원댓글 작성자에게 알림).
