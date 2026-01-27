
import React from 'react';
import { PortfolioItem, Visibility } from '../types';
import WatermarkedImage from './WatermarkedImage';
import { getCategoryLabel, getVisibilityLabel } from '../utils/labels';
import { translateCategory, translateAgeGroup } from '../utils/translations';

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: (item: PortfolioItem) => void;
  lang: 'zh' | 'en';
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, onClick, lang }) => {
  const isExclusive = item.visibility === Visibility.EXCLUSIVE;
  const isSemiPublic = item.visibility === Visibility.SEMI_PUBLIC;

  return (
    <div 
      onClick={() => onClick(item)}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 rounded-sm mb-4">
        <WatermarkedImage 
          src={item.coverImage} 
          alt={item.title} 
          className="w-full h-full"
          isSemiPublic={isSemiPublic}
          blurPercentage={item.blurPercentage}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] tracking-widest uppercase font-medium shadow-sm">
            {translateCategory(item.category, lang)}
          </span>
          {isExclusive && (
            <span className="px-3 py-1 bg-neutral-900 text-white text-[10px] tracking-widest uppercase font-bold shadow-sm">
              {lang === 'zh' ? 'SOLD / EXCLUSIVE (专属定制)' : 'SOLD / EXCLUSIVE'}
            </span>
          )}
          {isSemiPublic && (
              <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[10px] tracking-widest uppercase font-bold shadow-sm border border-amber-200">
              {getVisibilityLabel(item.visibility, lang)}
            </span>
          )}
        </div>
      </div>
      
        <div className="space-y-1">
        <h3 className="text-sm font-medium text-neutral-800 group-hover:underline underline-offset-4">{item.title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-xs text-neutral-400">{translateAgeGroup(item.ageGroup, lang)}</span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
