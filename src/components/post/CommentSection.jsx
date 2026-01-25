import { Link } from 'react-router-dom';
import { useRef, useEffect, useMemo } from 'react';
import CommentItem from './CommentItem';

export default function CommentSection({ comments, user, newComment, onCommentChange, onSubmit, onDelete }) {
  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    const textarea = e.target;
    onCommentChange(textarea.value);
    
    // Auto-resize height
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Reset height when newComment is cleared
  useEffect(() => {
    if (newComment === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [newComment]);

  // Build Comment Tree
  const rootComments = useMemo(() => {
    const commentMap = {};
    // Deep copy to avoid mutating original props directly if needed, but here simple ref is fine
    // We create wrapper objects
    comments.forEach(c => {
      commentMap[c.id] = { ...c, replies: [] };
    });

    const roots = [];
    comments.forEach(c => {
      if (c.parent_id && commentMap[c.parent_id]) {
        commentMap[c.parent_id].replies.push(commentMap[c.id]);
      } else {
        roots.push(commentMap[c.id]);
      }
    });
    
    return roots;
  }, [comments]);

  return (
    <section className="bg-surface rounded-xl shadow-lg p-5 sm:p-8 border border-secondary/50">
      <h3 className="text-xl font-bold text-white mb-6">댓글 {comments.length}개</h3>
      
      {/* Comment List */}
      <div className="space-y-6 mb-8">
        {rootComments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            user={user} 
            replies={comment.replies}
            onSubmitReply={onSubmit} // Pass the same handler
            onDelete={onDelete}
          />
        ))}
        
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-4 text-sm">첫 번째 댓글을 남겨보세요!</p>
        )}
      </div>

      {/* Main Comment Form */}
      {user ? (
        <form onSubmit={(e) => onSubmit(e)} className="mt-6">
          <div className="flex flex-col space-y-3">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={handleTextareaChange}
              placeholder="댓글을 입력하세요..."
              className="w-full px-4 py-3 border border-secondary bg-primary text-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none min-h-[60px] max-h-[300px] overflow-y-auto placeholder-gray-500 transition-all duration-200"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
              >
                댓글 등록
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-primary/50 p-4 rounded-lg text-center border border-secondary/30">
          <p className="text-gray-400 text-sm">
            댓글을 작성하려면 <Link to="/login" className="text-accent font-medium hover:text-blue-400 hover:underline">로그인</Link>이 필요합니다.
          </p>
        </div>
      )}
    </section>
  );
}