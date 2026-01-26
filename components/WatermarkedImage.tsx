
import React from 'react';

interface WatermarkedImageProps {
  src: string;
  alt: string;
  className?: string;
  isSemiPublic?: boolean;
}

const WatermarkedImage: React.FC<WatermarkedImageProps> = ({ src, alt, className = "", isSemiPublic = false }) => {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSemiPublic ? 'opacity-60' : ''}`}
        loading="lazy"
      />
      {/* CSS Watermark Layer */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20 rotate-[-30deg]">
        <div className="grid grid-cols-3 gap-16 text-xs font-bold uppercase tracking-widest text-white whitespace-nowrap">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i}>DESIGNER PORTFOLIO © COPYRIGHT</span>
          ))}
        </div>
      </div>
      {/* Semi-public overlay */}
      {isSemiPublic && (
        <div className="absolute inset-0 bg-white/30 pointer-events-none" />
      )}
      {/* Glossy Overlay for "Premium" feel */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-white/5 pointer-events-none" />
    </div>
  );
};

export default WatermarkedImage;
