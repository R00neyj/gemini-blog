import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';

export default function CommentItem({ comment, user, replies, onSubmitReply, onDelete }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const textareaRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    onSubmitReply(e, replyContent, comment.id);
    setReplyContent('');
    setIsReplying(false);
  };

  const handleTextareaChange = (e) => {
    setReplyContent(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    if (isReplying && textareaRef.current) {
        textareaRef.current.focus();
    }
  }, [isReplying]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Comment */}
      <div className="flex space-x-4 p-4 bg-primary/50 rounded-lg border border-secondary/30 hover:border-secondary/60 transition-colors">
        <Avatar 
          src={comment.profiles?.avatar_url} 
          alt="profile" 
          size="sm" 
          className="border-accent/20 flex-shrink-0" 
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm text-white truncate">{comment.profiles?.username || 'Unknown'}</span>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatDate(comment.created_at)}</span>
          </div>
          <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center gap-3 mt-3">
            {/* Reply Button */}
            {user && (
              <button 
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs text-gray-400 hover:text-accent font-medium flex items-center gap-1 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                답글
              </button>
            )}

            {/* Delete Button */}
            {user && user.id === comment.user_id && (
              <button 
                onClick={() => onDelete(comment.id)}
                className="text-xs text-gray-500 hover:text-red-400 font-medium transition-colors"
              >
                삭제
              </button>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-4 animate-slide-down">
              <div className="flex flex-col space-y-2">
                <textarea
                  ref={textareaRef}
                  value={replyContent}
                  onChange={handleTextareaChange}
                  placeholder={`@${comment.profiles?.username}님에게 답글 작성...`}
                  className="w-full px-3 py-2 border border-secondary bg-surface text-white text-sm rounded-lg focus:ring-1 focus:ring-accent focus:border-transparent outline-none resize-none min-h-[40px] overflow-hidden"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReplying(false)}
                    className="px-3 py-1.5 border border-secondary text-gray-400 text-xs font-medium rounded-lg hover:bg-white/5 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    답글 등록
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {replies && replies.length > 0 && (
        <div className="pl-10 sm:pl-12 space-y-4 border-l-2 border-secondary/30 ml-4">
          {replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              user={user} 
              replies={[]} // Limit depth to 2 levels implies replies to replies are flat or disallowed visually here? 
                           // For MVP, let's allow arbitrary nesting or flatten?
                           // The spec says "maximum 2 depth recommended".
                           // If I pass [] here, grand-children won't render.
                           // Actually, if we want strict 2-depth, we pass [] or handle grand-children as siblings of children.
                           // Let's pass `reply.replies` if we want recursive, but for 2-depth limit, we might flatten.
                           // "답글은 부모 댓글 하단에 들여쓰기... 모바일에서는 2 depth 권장"
                           // I'll make it recursive for now but style it.
              onSubmitReply={onSubmitReply} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
