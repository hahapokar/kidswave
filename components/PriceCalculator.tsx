
import React, { useState } from 'react';
import { Addon } from '../types';

interface PriceCalculatorProps {
  basePrice: number;
  addons: Addon[];
  lang: 'zh' | 'en';
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ basePrice, addons, lang }) => {
  const [selectedAddons, setSelectedAddons] = useState<Set<number>>(new Set());

  const content = {
    zh: {
      title: '价格估算工具',
      baseForm: '作品基础形式 (A)',
      estimatedTotal: '预计总计 (ESTIMATED TOTAL)',
      finalNote: '* 最终价格以正式合同为准'
    },
    en: {
      title: 'Price Calculator',
      baseForm: 'Base Design (A)',
      estimatedTotal: 'Estimated Total',
      finalNote: '* Final price subject to formal contract'
    }
  };

  const t = content[lang];

  const toggleAddon = (index: number) => {
    const next = new Set(selectedAddons);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedAddons(next);
  };

  const total = basePrice + Array.from(selectedAddons).reduce((acc, idx) => acc + addons[idx].price, 0);

  return (
    <div className="bg-white border border-gray-100 p-8 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium mb-6 serif-font">{t.title}</h3>
      
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center pb-4 border-bottom border-gray-50">
          <span className="text-gray-500 text-sm">{t.baseForm}</span>
          <span className="font-medium">¥{basePrice.toLocaleString()}</span>
        </div>

        {addons.map((addon, idx) => (
          <label key={idx} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                checked={selectedAddons.has(idx)}
                onChange={() => toggleAddon(idx)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{addon.label}</span>
            </div>
            <span className="text-sm font-medium text-gray-500">+ ¥{addon.price}</span>
          </label>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{t.estimatedTotal}</p>
          <p className="text-3xl font-bold serif-font text-neutral-900">¥{total.toLocaleString()}</p>
        </div>
        <div className="text-xs text-gray-400 italic">
          {t.finalNote}
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
