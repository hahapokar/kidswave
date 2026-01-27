
import React, { useState } from 'react';
import { Addon } from '../types';

interface PriceCalculatorProps {
  basePrice?: number;
  copyrightFee?: number;
  usageFee?: number;
  addons: Addon[];
  lang: 'zh' | 'en';
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ basePrice = 0, copyrightFee = 0, usageFee = 0, addons, lang }) => {
  const [includeBasePrice, setIncludeBasePrice] = useState(true);
  const [selectedServices, setSelectedServices] = useState<Set<number>>(new Set());

  // 所有服务选项（包含原addons概念的增值服务）
  const allServices = [
    { label: lang === 'zh' ? '工艺版单' : 'Tech Pack', price: 100 },
    { label: lang === 'zh' ? '齐色建议' : 'Color Palette', price: 50 },
    { label: lang === 'zh' ? '面辅料建议与供应商信息' : 'Fabric & Supplier Info', price: 100 },
    { label: lang === 'zh' ? '小幅度改图' : 'Minor Revisions', price: 50 },
    { label: lang === 'zh' ? '协助批复样板' : 'Sample Approval Support', price: 50 }
  ];

  const content = {
    zh: {
      title: '价格估算工具',
      baseForm: '作品基础形式 (A)',
      services: '增值服务',
      estimatedTotal: '总计 (ESTIMATED TOTAL)',
      finalNote: ''
    },
    en: {
      title: 'Price Calculator',
      baseForm: 'Base Design (A)',
      services: 'Additional Services',
      estimatedTotal: 'Total',
      finalNote: ''
    }
  };

  const t = content[lang];

  const toggleService = (index: number) => {
    const next = new Set(selectedServices);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedServices(next);
  };

  const servicesTotal = Array.from(selectedServices).reduce((acc, idx) => acc + allServices[idx].price, 0);
  const computedBase = (copyrightFee || usageFee) ? (copyrightFee + usageFee) : basePrice;
  const total = (includeBasePrice ? computedBase : 0) + servicesTotal;

  return (
    <div className="bg-white border border-gray-100 p-8 rounded-lg shadow-sm">
      <h3 className="text-xl font-medium mb-6 serif-font">{t.title}</h3>
      
      <div className="space-y-4 mb-8">
        {/* 基础价格（可勾选） */}
        <label className="flex items-center justify-between group cursor-pointer pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              checked={includeBasePrice}
              onChange={() => setIncludeBasePrice(!includeBasePrice)}
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
              {t.baseForm}
            </span>
          </div>
          <span className="text-base font-bold text-gray-900">¥{computedBase.toLocaleString()}</span>
        </label>

        {/* 增值服务标题 */}
        <div className="pt-2">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-800 mb-3">
            {t.services}
          </p>
        </div>

        {/* 所有增值服务选项 */}
        {allServices.map((service, idx) => (
          <label 
            key={`service-${idx}`} 
            className="flex items-center justify-between group cursor-pointer bg-amber-50/50 px-4 py-3 rounded hover:bg-amber-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                checked={selectedServices.has(idx)}
                onChange={() => toggleService(idx)}
                className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-amber-900 group-hover:text-amber-950 transition-colors font-medium">
                {service.label}
              </span>
            </div>
            <span className="text-sm font-bold text-amber-800">+ ¥{service.price}</span>
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
