import defaultAvatar from "../assets/Profile.png";

export default function Avatar({ src, alt, size = "md", className = "" }) {
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-2xl",
    xl: "w-20 h-20 text-3xl",
    "2xl": "w-32 h-32 text-5xl",
  };

  const iconSizeClasses = {
    xs: "text-xs",
    sm: "text-[16px]",
    md: "text-[20px]",
    lg: "text-[32px]",
    xl: "text-[40px]",
    "2xl": "text-[64px]",
  };

  const renderContent = () => {
    if (!src) {
      return <img src={defaultAvatar} alt={alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />;
    }

    // Check if it's a custom avatar (Format: type|value|bg)
    if (typeof src === 'string' && src.trim().includes("|")) {
      const [type, value, bg] = src.trim().split("|");
      return (
        <div className={`w-full h-full ${bg} flex items-center justify-center`}>
          {type === "emoji" ? (
            <span>{value}</span>
          ) : (
            <span className={`material-symbols-rounded ${iconSizeClasses[size] || "text-xl"} text-white select-none`}>
              {value}
            </span>
          )}
        </div>
      );
    }

    // Otherwise, assume it's a URL
    return <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />;
  };

  return (
    <div className={`${sizeClasses[size] || sizeClasses.md} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10 ${className}`}>
      {renderContent()}
    </div>
  );
}
