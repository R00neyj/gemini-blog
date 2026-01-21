import { useState, useEffect } from 'react';
import qrcodeImg from '../assets/qrcode.png';

export default function InstallPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [isIOS] = useState(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Capture install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsOpen(false);
      }
    } else {
      // Fallback or just show instructions
      setIsOpen(true);
    }
  };

  // Don't show on login/signup pages if desired, but request says "mobile Fab" generally.
  // We'll keep it simple and always show it on mobile unless installed.

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 bg-black/40 backdrop-blur-xl text-white rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 hover:bg-white/5 active:scale-95 transition-all duration-300 flex-shrink-0"
        aria-label="앱 설치 안내"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-primary border border-secondary rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Gemini Blog 앱 설치</h3>
            <p className="text-gray-300 mb-6 text-sm">
              홈 화면에 추가하여 더욱 편리하게 이용하세요.
            </p>

            <div className="flex flex-col items-center gap-6">
              {/* QR Code */}
              <div className="bg-white p-2 rounded-xl">
                <img src={qrcodeImg} alt="Install QR Code" className="w-32 h-32 object-contain" />
              </div>

              {/* Install Guide */}
              <div className="w-full space-y-3">
                {deferredPrompt ? (
                   <button 
                    onClick={handleInstallClick}
                    className="w-full py-3 bg-accent hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
                  >
                    지금 설치하기
                  </button>
                ) : (
                  <div className="bg-secondary/50 p-4 rounded-xl text-sm text-gray-300 border border-white/5">
                    {isIOS ? (
                      <div className="space-y-3">
                        <p className="font-semibold text-accent flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          iOS Safari 설치 가이드
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-xs leading-relaxed">
                          <li>Safari 브라우저 하단의 <strong className="text-white">공유 버튼</strong>(네모와 화살표 모양)을 누릅니다.</li>
                          <li>리스트를 아래로 내려 <strong className="text-white">'홈 화면에 추가'</strong>를 선택합니다.</li>
                          <li>우측 상단의 <strong className="text-white">'추가'</strong> 버튼을 눌러 완료합니다.</li>
                        </ol>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="font-semibold text-accent flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Android / Chrome 설치 가이드
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-xs leading-relaxed">
                          <li>브라우저 우측 상단의 <strong className="text-white">더보기 메뉴</strong>(점 3개)를 누릅니다.</li>
                          <li><strong className="text-white">'앱 설치'</strong> 또는 <strong className="text-white">'홈 화면에 추가'</strong>를 선택합니다.</li>
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
