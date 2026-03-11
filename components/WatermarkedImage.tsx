import React from 'react';

interface WatermarkedImageProps {
  src: string;
  alt: string;
  className?: string;
  isSemiPublic?: boolean;
  // 这个参数现在代表水印的浓度 (0-100)
  blurPercentage?: number; 
}

const WatermarkedImage: React.FC<WatermarkedImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  isSemiPublic = false, 
  blurPercentage = 0 
}) => {
  
  // 1. 将 0-100 的数值映射为 0.0 到 0.8 的透明度
  // 即使是 100%，我们也保留一点透明度(0.8)，否则会完全遮住底图
  const watermarkOpacity = (blurPercentage || 0) / 100 * 0.8;

  // 2. 依然保留极轻微的模糊感（可选，如果不想要模糊，可以将 blurPx 设为 0）
  const blurPx = isSemiPublic ? (blurPercentage / 20) : 0; 

  return (
    <div className={`relative overflow-hidden group ${className} bg-neutral-200`}>
      {/* 底图 */}
      <img 
        src={src} 
        alt={alt} 
        style={{ 
          filter: isSemiPublic && blurPx > 0 ? `blur(${blurPx}px)` : undefined 
        }}
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105`}
        loading="lazy"
      />

      {/* 动态平铺水印层 */}
      {isSemiPublic && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            // 使用内联 SVG 实现平铺，这是最稳妥的“铺满”方案
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ctext x='50%25' y='50%25' font-size='10' font-weight='bold' fill='white' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle' transform='rotate(-35, 60, 60)'%3Ekidswave studio%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '120px 120px',
            opacity: watermarkOpacity, // 这里受后台滑块控制
            mixBlendMode: 'overlay', // 混合模式让水印与底图融合得更高级
          }}
        />
      )}

      {/* 叠加层：提升质感 */}
      {isSemiPublic && (
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      )}
      
      {/* 装饰性高光 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-white/5 pointer-events-none" />
    </div>
  );
};

export default WatermarkedImage;