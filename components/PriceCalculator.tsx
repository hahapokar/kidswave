
import React, { useState } from 'react';
import { Addon } from '../types';

interface PriceCalculatorProps {
  basePrice: number;
  addons: Addon[];
  lang: 'zh' | 'en';
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ basePrice, addons, lang }) => {
  const [selectedAddons, setSelectedAddons] = useState<Set<number>>(new Set());

  // 增值服务选项
  const valueAddedServices = [
    { label: lang === 'zh' ? '工艺版单' : 'Tech Pack', price: 100 },
    { label: lang === 'zh' ? '齐色建议' : 'Color Palette', price: 50 },
    { label: lang === 'zh' ? '面辅料建议与供应商信息' : 'Fabric & Supplier Info', price: 100 },
    { label: lang === 'zh' ? '小幅度改图' : 'Minor Revisions', price: 50, perTime: true },
    { label: lang === 'zh' ? '协助批复样板' : 'Sample Approval Support', price: 50, perTime: true }
  ];

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

  const addonTotal = Array.from(selectedAddons).reduce((acc, idx) => acc + addons[idx].price, 0);
  const total = basePrice + addonTotal;

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

        {/* 增值服务分隔线 */}
        <div className="border-t border-amber-200 pt-4 mt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-800 mb-3">
            {lang === 'zh' ? '增值服务' : 'Value-Added Services'}
          </p>
        </div>

        {/* 增值服务选项 */}
        {valueAddedServices.map((service, idx) => (
          <label key={`service-${idx}`} className="flex items-center justify-between group cursor-pointer bg-amber-50/50 px-3 py-2 rounded">
            <div className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-amber-900 group-hover:text-amber-950 transition-colors font-medium">
                {service.label}{service.perTime ? ` (¥${service.price}/${lang === 'zh' ? '次' : 'time'})` : ''}
              </span>
            </div>
            {!service.perTime && (
              <span className="text-sm font-bold text-amber-800">+ ¥{service.price}</span>
            )}
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
