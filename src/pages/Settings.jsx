import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { subscribeToPushNotifications, unsubscribeFromPushNotifications, checkSubscriptionStatus } from "../utils/pushNotification";
import { toast } from "react-hot-toast";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  // Avatar states
  const [avatarType, setAvatarType] = useState("emoji"); // 'emoji' or 'symbol'
  const [avatarValue, setAvatarValue] = useState("🚀");
  const [avatarBg, setAvatarBg] = useState("bg-blue-500");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const emojis = ["🚀", "⭐", "🔥", "💎", "🌈", "🍀", "🐱", "🐶", "🦊", "🎨", "💻", "☕", "🎮", "⚽", "🍔", "😎", "🤔", "👀", "✨", "🎉", "💡", "📚", "🎵", "🎬", "✈️", "🍕", "🍦", "🍺", "🍷", "🥃"];
  const symbols = ["favorite", "star", "bolt", "auto_awesome", "rocket_launch", "computer", "palette", "menu_book", "home", "person", "settings", "notifications"];
  const bgColors = [
    { name: "Blue", class: "bg-blue-500" },
    { name: "Red", class: "bg-red-500" },
    { name: "Green", class: "bg-green-500" },
    { name: "Amber", class: "bg-amber-500" },
    { name: "Purple", class: "bg-purple-500" },
    { name: "Pink", class: "bg-pink-500" },
    { name: "Indigo", class: "bg-indigo-500" },
    { name: "Slate", class: "bg-slate-600" },
    { name: "Zinc", class: "bg-zinc-800" },
  ];

  useEffect(() => {
    if (user?.user_metadata?.username) {
      setUsername(user.user_metadata.username);
    }
    
    // Parse avatar_url if it exists (Format: TYPE|VALUE|BG)
    const currentAvatar = user?.user_metadata?.avatar_url || "";
    if (currentAvatar.includes("|")) {
      const [type, value, bg] = currentAvatar.split("|");
      setAvatarType(type);
      setAvatarValue(value);
      setAvatarBg(bg);
    }

    // Check push status
    checkSubscriptionStatus().then(setPushEnabled);
  }, [user]);

  const handlePushToggle = async () => {
    setPushLoading(true);
    try {
      if (pushEnabled) {
        await unsubscribeFromPushNotifications(user.id);
        setPushEnabled(false);
        toast.success("알림이 해제되었습니다.");
      } else {
        await subscribeToPushNotifications(user.id);
        setPushEnabled(true);
        toast.success("알림이 설정되었습니다! 이제 새 댓글 알림을 받을 수 있습니다.");
      }
    } catch (error) {
      console.error(error);
      toast.error("알림 설정 중 오류가 발생했습니다: " + error.message);
    } finally {
      setPushLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    const newAvatarUrl = `${avatarType}|${avatarValue}|${avatarBg}`;

    try {
      // 1. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          username: username,
          avatar_url: newAvatarUrl
        },
      });
      if (authError) throw authError;

      // 2. Update Profiles Table
      const { error: profileError } = await supabase.from("profiles").update({ 
        username: username,
        avatar_url: newAvatarUrl
      }).eq("id", user.id);

      if (profileError) throw profileError;

      setMessage({ type: "success", content: "프로필이 성공적으로 업데이트되었습니다." });
    } catch (err) {
      setMessage({ type: "error", content: "업데이트 중 오류가 발생했습니다: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", content: "비밀번호가 일치하지 않습니다." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage({ type: "success", content: "비밀번호가 성공적으로 변경되었습니다." });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({ type: "error", content: "비밀번호 변경 중 오류가 발생했습니다: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">내 프로필 설정</h1>

        {message.content && <div className={`mb-6 p-4 rounded-lg border ${message.type === "success" ? "bg-green-900/20 border-green-500 text-green-300" : "bg-red-900/20 border-red-500 text-red-300"}`}>{message.content}</div>}

        <div className="space-y-8">
          {/* Avatar Section */}
          <section className="p-0 sm:p-4">
            <h2 className="text-xl font-semibold text-white mb-8 flex items-center">
              <span className="w-1.5 h-6 bg-accent rounded-full mr-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              내 아바타 꾸미기
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Preview */}
              <div className="flex flex-col items-center gap-4">
                <div className={`w-32 h-32 rounded-3xl ${avatarBg} flex items-center justify-center shadow-2xl border-4 border-white/10 transition-all duration-300`}>
                  {avatarType === "emoji" ? (
                    <span className="text-6xl">{avatarValue}</span>
                  ) : (
                    <span className="material-symbols-rounded text-6xl text-white select-none">
                      {avatarValue}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400 font-medium">아바타 미리보기</span>
              </div>

              {/* Controls */}
              <div className="flex-1 space-y-6 w-full">
                {/* Type Toggle */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  <button 
                    onClick={() => { setAvatarType("emoji"); setAvatarValue(emojis[0]); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${avatarType === "emoji" ? "bg-accent text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                  >
                    이모지
                  </button>
                  <button 
                    onClick={() => { setAvatarType("symbol"); setAvatarValue(symbols[0]); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${avatarType === "symbol" ? "bg-accent text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                  >
                    아이콘
                  </button>
                </div>

                {/* Value Picker */}
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 bg-white/5 rounded-xl border border-white/5 scrollbar-hide">
                  {(avatarType === "emoji" ? emojis : symbols).map((val) => (
                    <button
                      key={val}
                      onClick={() => setAvatarValue(val)}
                      className={`aspect-square flex items-center justify-center rounded-lg transition-all ${avatarValue === val ? "bg-white/20 scale-110 border border-white/20" : "hover:bg-white/10"}`}
                    >
                      {avatarType === "emoji" ? (
                        <span className="text-xl">{val}</span>
                      ) : (
                        <span className="material-symbols-rounded text-xl text-white">{val}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Background Picker */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">배경색</label>
                  <div className="flex flex-wrap gap-3">
                    {bgColors.map((color) => (
                      <button
                        key={color.class}
                        onClick={() => setAvatarBg(color.class)}
                        className={`w-8 h-8 rounded-full ${color.class} transition-all ${avatarBg === color.class ? "ring-2 ring-white ring-offset-2 ring-offset-primary scale-110" : "hover:scale-105"}`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="p-0 sm:p-4">
            <h2 className="text-xl font-semibold text-white mb-8 flex items-center">
              <span className="w-1.5 h-6 bg-accent rounded-full mr-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              알림 설정
            </h2>
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
              <div>
                <h3 className="text-white font-medium">새 댓글 알림</h3>
                <p className="text-sm text-gray-400 mt-1">내 글에 댓글이 달리면 푸시 알림을 받습니다.</p>
              </div>
              <button
                onClick={handlePushToggle}
                disabled={pushLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 ${pushEnabled ? 'bg-accent' : 'bg-gray-700'}`}
              >
                <span
                  className={`${pushEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
          </section>

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
                  value={user?.email || ""} 
                  disabled 
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">닉네임</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-accent/20 disabled:opacity-50 mt-4">
                {loading ? "저장 중..." : "프로필 저장"}
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
                  minLength={6}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all disabled:opacity-50 mt-4">
                {loading ? "처리 중..." : "비밀번호 변경"}
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
              <p className="text-gray-400 text-sm">계정에서 로그아웃하거나 다른 계정으로 로그인합니다.</p>
              <button
                onClick={async () => {
                  await signOut();
                  navigate("/login");
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
