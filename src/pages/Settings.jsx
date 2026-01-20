import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Settings() {
  const { user } = useAuth();
  
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    if (user?.user_metadata?.username) {
      setUsername(user.user_metadata.username);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      // 1. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { username: username }
      });
      if (authError) throw authError;

      // 2. Update Profiles Table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: username })
        .eq('id', user.id);
      
      if (profileError) throw profileError;

      setMessage({ type: 'success', content: '프로필이 성공적으로 업데이트되었습니다.' });
    } catch (err) {
      setMessage({ type: 'error', content: '업데이트 중 오류가 발생했습니다: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', content: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', content: '비밀번호가 성공적으로 변경되었습니다.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', content: '비밀번호 변경 중 오류가 발생했습니다: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pt-24 bg-primary">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">내 프로필 설정</h1>

        {message.content && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' ? 'bg-green-900/20 border-green-500 text-green-300' : 'bg-red-900/20 border-red-500 text-red-300'
          }`}>
            {message.content}
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-surface p-8 rounded-2xl border border-secondary/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-accent rounded-full mr-3"></span>
              기본 정보 수정
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">이메일 (변경 불가)</label>
                <input
                  type="text"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 bg-primary/50 border border-secondary rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">닉네임</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-primary border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-accent text-white rounded-lg font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                {loading ? '저장 중...' : '프로필 저장'}
              </button>
            </form>
          </section>

          {/* Password Section */}
          <section className="bg-surface p-8 rounded-2xl border border-secondary/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-accent rounded-full mr-3"></span>
              비밀번호 변경
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">새 비밀번호</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="6자 이상 입력"
                  className="w-full px-4 py-2 bg-primary border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-primary border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                  minLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-secondary text-white rounded-lg font-bold hover:bg-slate-600 transition-all disabled:opacity-50 border border-accent/30"
              >
                {loading ? '처리 중...' : '비밀번호 변경'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
