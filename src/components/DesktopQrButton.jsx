import { useState } from "react";
import qrCodeImg from "../assets/qrcode.png";

export default function DesktopQrButton() {
  const [showQrModal, setShowQrModal] = useState(false);

  return (
    <>
      {/* QR Code Floating Action Button - Hidden on mobile, shown on desktop */}
      <button
        onClick={() => setShowQrModal(true)}
        className="hidden sm:flex fixed bottom-8 right-8 p-4 bg-accent/50 backdrop-blur-xl text-white rounded-full shadow-[0_8px_32px_rgba(59,130,246,0.4)] border border-white/10 hover:bg-accent/70 transition-all z-40 hover:scale-110 animate-float focus:outline-none"
        aria-label="모바일 설치 QR코드 보기"
        title="모바일에서 보기"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" strokeWidth="2" rx="1" />
          <rect x="14" y="3" width="7" height="7" strokeWidth="2" rx="1" />
          <rect x="3" y="14" width="7" height="7" strokeWidth="2" rx="1" />
          <path d="M14 14h7v7h-7z" fill="currentColor" stroke="none" className="opacity-50" />
        </svg>
      </button>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowQrModal(false)}>
          <div className="bg-surface p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative border border-secondary animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">모바일에서 즐기기</h2>
            <p className="text-gray-400 mb-6">QR코드를 스캔하여 앱을 설치하세요.</p>

            <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-inner">
              <img src={qrCodeImg} alt="App QR Code" className="w-48 h-48 object-contain" />
            </div>

            <button onClick={() => setShowQrModal(false)} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors border border-white/5">
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
