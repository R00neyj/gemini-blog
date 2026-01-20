import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Supabase signUp with user metadata (username)
    const { error } = await signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
      toast.error('회원가입 실패: ' + error.message);
    } else {
      toast.success('회원가입 확인 이메일을 확인해주세요!');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="max-w-md w-full space-y-8 p-6 sm:p-10 bg-surface rounded-xl shadow-2xl border border-secondary/50">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            새로운 블로그 여정을 시작해보세요
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm border border-red-900/50">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">사용자 이름 (닉네임)</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-secondary bg-primary placeholder-gray-500 text-white focus:outline-none focus:ring-accent focus:border-accent sm:text-sm mt-1"
                placeholder="Geminist"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-300">이메일 주소</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-secondary bg-primary placeholder-gray-500 text-white focus:outline-none focus:ring-accent focus:border-accent sm:text-sm mt-1"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" name="password" className="block text-sm font-medium text-gray-300">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-secondary bg-primary placeholder-gray-500 text-white focus:outline-none focus:ring-accent focus:border-accent sm:text-sm mt-1"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-accent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50"
            >
              {loading ? '가입 중...' : '가입하기'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-medium text-accent hover:text-blue-400">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
