import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
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
    <div className="min-h-screen p-4 pt-20 sm:p-6 sm:pt-24 bg-primary">
      <div className="max-w-2xl mx-auto space-y-8">
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
          <section className="p-0 sm:p-4">
            <h2 className="text-xl font-semibold text-white mb-8 flex items-center">
              <span className="w-1.5 h-6 bg-accent rounded-full mr-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              기본 정보 수정
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">이메일 (변경 불가)</label>
                <input
                  type="text"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-transparent border-b border-white/10 text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">닉네임</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-accent transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-accent/20 disabled:opacity-50 mt-4"
              >
                {loading ? '저장 중...' : '프로필 저장'}
              </button>
            </form>
          </section>

          {/* Password Section */}
          <section className="p-0 sm:p-4">
            <h2 className="text-xl font-semibold text-white mb-8 flex items-center">
              <span className="w-1.5 h-6 bg-accent rounded-full mr-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              비밀번호 변경
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">새 비밀번호</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="6자 이상 입력"
                  className="w-full px-4 py-3 bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-accent transition-colors"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-accent transition-colors"
                  minLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all disabled:opacity-50 mt-4"
              >
                {loading ? '처리 중...' : '비밀번호 변경'}
              </button>
            </form>
          </section>

          {/* Logout Section */}
          <section className="p-0 sm:p-4">
            <h2 className="text-xl font-semibold text-red-400 mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-red-500 rounded-full mr-3"></span>
              계정 작업
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                계정에서 로그아웃하거나 다른 계정으로 로그인합니다.
              </p>
              <button
                onClick={async () => {
                  await signOut();
                  navigate('/login');
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-transparent border border-red-500 text-red-400 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-all"
              >
                로그아웃
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
