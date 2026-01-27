
import React from 'react';

interface WatermarkedImageProps {
  src: string;
  alt: string;
  className?: string;
  isSemiPublic?: boolean;
  blurPercentage?: number;
}

const WatermarkedImage: React.FC<WatermarkedImageProps> = ({ src, alt, className = "", isSemiPublic = false, blurPercentage = 0 }) => {
  const blurPx = (blurPercentage || 0) / 10;
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        style={{ filter: isSemiPublic && blurPx > 0 ? `blur(${blurPx}px)` : undefined }}
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSemiPublic ? 'opacity-60' : ''}`}
        loading="lazy"
      />
      {/* CSS Watermark Layer - denser full-cover repeating text for semi-public items */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="absolute inset-0 rotate-[-30deg] opacity-20 flex items-center justify-center"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridAutoRows: '1.6rem',
            gap: '0.5rem'
          }}
        >
          {Array.from({ length: 6 * 8 }).map((_, i) => (
            <div key={i} className="text-[10px] font-bold uppercase tracking-widest text-white text-center select-none">
              DESIGNER PORTFOLIO © COPYRIGHT
            </div>
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
