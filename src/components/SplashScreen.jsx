export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary animate-fade-in">
      <div className="relative flex flex-col items-center">
        {/* Logo/Icon Container with Pulse Effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-24 h-24 bg-surface border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
            <img 
              src="/pwa-192x192.png" 
              alt="Logo" 
              className="w-16 h-16 object-contain animate-float"
            />
          </div>
        </div>

        {/* Brand Name with Gradient Text */}
        <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-2">
          GEMINI COMMUNITY
        </h1>
        
        {/* Subtle Loading Indicator */}
        <div className="flex items-center gap-1 mt-4">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
        </div>
      </div>
      
      {/* Footer Text */}
      <div className="absolute bottom-12 text-gray-500 text-xs font-medium tracking-widest uppercase">
        Establishing Secure Connection
      </div>
    </div>
  );
}
