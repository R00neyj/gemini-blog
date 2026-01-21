import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import MDEditor from '@uiw/react-md-editor';

export default function PostHeader({ post, isOwner, onDelete }) {
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

  return (
    <article className="bg-surface rounded-xl shadow-lg p-5 sm:p-8 mb-8 border border-secondary/50">
      <header className="mb-6 border-b border-secondary pb-6">
        <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <Link to={post.profiles?.username ? `/blog/${post.profiles.username}` : '#'} className="block">
               <Avatar 
                 src={post.profiles?.avatar_url} 
                 alt="profile" 
                 size="md" 
                 className="border-accent/30 hover:border-accent transition-colors" 
               />
             </Link>
            <div>
              <Link 
                to={post.profiles?.username ? `/blog/${post.profiles.username}` : '#'}
                className="font-medium text-white hover:text-accent hover:underline transition-colors"
              >
                {post.profiles?.username || 'Unknown'}
              </Link>
              <p className="text-sm text-gray-400">{formatDate(post.created_at)}</p>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <Link 
                to={`/post/${post.id}/edit`} 
                className="px-3 py-1 text-sm border border-secondary rounded hover:bg-secondary text-gray-300"
              >
                수정
              </Link>
              <button 
                onClick={onDelete}
                className="px-3 py-1 text-sm border border-red-900/50 rounded hover:bg-red-900/20 text-red-400"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </header>
      
      <div className="prose max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed" data-color-mode="dark">
        <MDEditor.Markdown source={post.content} style={{ backgroundColor: 'transparent', color: 'inherit' }} />
      </div>
    </article>
  );
}
