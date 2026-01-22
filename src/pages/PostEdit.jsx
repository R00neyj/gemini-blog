import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import MDEditor from '@uiw/react-md-editor';

export default function PostEdit() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Check ownership
      if (user && data.user_id !== user.id) {
        toast.error('수정 권한이 없습니다.');
        navigate('/');
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setIsPublic(data.is_public);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      toast.error('제목과 내용을 모두 입력해주세요.');
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title,
          content,
          is_public: isPublic,
          updated_at: new Date()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('게시글이 수정되었습니다.');
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.message);
      toast.error('수정 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto bg-surface rounded-xl shadow-lg p-5 sm:p-8 border border-secondary/50">
        <h1 className="text-3xl font-bold text-white mb-8">게시글 수정</h1>
        
        {error && (
          <div className="mb-6 bg-red-900/20 text-red-400 p-4 rounded-lg border border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-secondary bg-primary text-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-gray-500"
              required
            />
          </div>

          <div data-color-mode="dark">
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
              내용
            </label>
            <MDEditor
              value={content}
              onChange={setContent}
              height={500}
              className="border border-secondary rounded-lg overflow-hidden"
            />
          </div>

          <div className="flex items-center space-x-3 bg-primary p-4 rounded-lg border border-secondary/50">
            <input
              id="is-public"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 text-accent border-secondary rounded focus:ring-accent bg-surface"
            />
            <label htmlFor="is-public" className="text-gray-300 font-medium cursor-pointer select-none">
              이 글을 공개로 설정합니다 (체크 해제 시 비공개)
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-secondary text-gray-300 font-medium rounded-lg hover:bg-secondary/50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {saving ? '저장 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
