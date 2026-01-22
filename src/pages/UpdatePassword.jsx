import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function UpdatePassword() {
  const { user } = useAuth(); // AuthProvider waits for loading, so user should be set if hash was valid
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If user is not logged in, it means the link was invalid or expired
    // But we give it a slight delay just in case
    const timer = setTimeout(() => {
        if (!user) {
            setError('유효하지 않거나 만료된 링크입니다. 다시 시도해주세요.');
        }
    }, 1000);
    return () => clearTimeout(timer);
  }, [user]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setMessage('비밀번호가 성공적으로 변경되었습니다. 잠시 후 홈으로 이동합니다.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user && !error) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-20 animate-fade-in">
      <div className="bg-surface p-8 rounded-xl shadow-lg border border-secondary max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">새 비밀번호 설정</h1>
        
        {message && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg mb-6 text-center">
            {message}
          </div>
        )}

        {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 text-center">
                {error}
                <div className="mt-2">
                    <button onClick={() => navigate('/reset-password')} className="text-sm underline hover:text-white">
                        재설정 메일 다시 보내기
                    </button>
                </div>
            </div>
        )}

        {user && !message && (
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                새 비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-background border border-secondary rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                placeholder="6자 이상 입력"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-background border border-secondary rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                placeholder="비밀번호 재입력"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? '변경 중...' : '비밀번호 변경하기'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
