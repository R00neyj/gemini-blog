import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다. 메일함을 확인해주세요.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-20 animate-fade-in">
      <div className="bg-surface p-8 rounded-xl shadow-lg border border-secondary max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">비밀번호 재설정</h1>
        
        {message ? (
          <div className="text-center">
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg mb-6">
              {message}
            </div>
            <Link 
              to="/login"
              className="text-accent hover:underline"
            >
              로그인 페이지로 돌아가기
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                가입한 이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-secondary rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                placeholder="example@email.com"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? '전송 중...' : '재설정 링크 보내기'}
            </button>

            <div className="text-center text-sm text-gray-400">
              <Link to="/login" className="hover:text-white transition-colors">
                로그인 페이지로 돌아가기
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
