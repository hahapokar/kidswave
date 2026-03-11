
import React from 'react';
import { Addon } from '../types';

interface PriceCalculatorProps {
  basePrice?: number;
  copyrightFee?: number;
  usageFee?: number;
  addons: Addon[];
  lang: 'zh' | 'en';
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ basePrice = 0, copyrightFee = 0, usageFee = 0, addons, lang }) => {
  const content = {
    zh: {
      title: '作品定价',
      basePrice: '一口价',
      copyright: '© 版权声明：此作品设计版权归设计师所有',
      estimatedTotal: '总计'
    },
    en: {
      title: 'Design Price',
      basePrice: 'Fixed Price',
      copyright: '© Copyright: The intellectual property rights of this design belong to the designer',
      estimatedTotal: 'Total'
    }
  };

  const t = content[lang];

  const baseTotal = (copyrightFee || usageFee) ? (copyrightFee + usageFee) : basePrice;

  return (
    <div className="bg-white border border-gray-100 p-8 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium mb-6 serif-font">{t.title}</h3>
      
      <div className="space-y-4 mb-8">
        {/* 一口价 */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">
            {t.basePrice}
          </span>
          <span className="text-2xl font-bold text-gray-900">¥{baseTotal.toLocaleString()}</span>
        </div>

        {/* 版权申明 */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-900 font-medium">
            {t.copyright}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{t.estimatedTotal}</p>
          <p className="text-3xl font-bold serif-font text-neutral-900">¥{baseTotal.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
