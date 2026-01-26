import React, { useState } from 'react';

interface CustomizationFormProps {
  lang: 'zh' | 'en';
  onClose?: () => void;
}

const CustomizationForm: React.FC<CustomizationFormProps> = ({ lang, onClose }) => {
  const [formData, setFormData] = useState({
    brandName: '',
    category: '',
    ageGroup: '',
    quantity: '',
    budget: '',
    style: '',
    deadline: '',
    requirements: ''
  });

  const content = {
    zh: {
      title: '专属定制问卷',
      brandName: '品牌名称',
      category: '产品类别',
      ageGroup: '年龄段',
      quantity: '预计数量',
      budget: '预算范围',
      style: '设计风格偏好',
      deadline: '期望交付时间',
      requirements: '其他需求说明',
      submit: '提交定制需求',
      close: '关闭',
      categories: ['外服', '家居服', '服饰', '其他'],
      ageGroups: ['婴童(0-3岁)', '小童(3-6岁)', '中童(6-12岁)'],
      styles: ['简约现代', '复古经典', '运动休闲', '甜美可爱', '个性潮流']
    },
    en: {
      title: 'Customization Form',
      brandName: 'Brand Name',
      category: 'Product Category',
      ageGroup: 'Age Group',
      quantity: 'Estimated Quantity',
      budget: 'Budget Range',
      style: 'Design Style',
      deadline: 'Expected Delivery',
      requirements: 'Additional Requirements',
      submit: 'Submit Request',
      close: 'Close',
      categories: ['Outerwear', 'Loungewear', 'Accessories', 'Other'],
      ageGroups: ['Infant (0-3)', 'Kids (3-6)', 'Juniors (6-12)'],
      styles: ['Minimalist Modern', 'Vintage Classic', 'Sporty Casual', 'Sweet & Cute', 'Trendy']
    }
  };

  const t = content[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(lang === 'zh' ? '提交成功！我们会尽快联系您。' : 'Submitted successfully! We will contact you soon.');
    console.log('Customization form data:', formData);
  };

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-white border border-gray-100 p-8 rounded-lg shadow-sm">
      <h3 className="text-2xl font-bold serif-font mb-6 text-center">{t.title}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
            {t.brandName}
          </label>
          <input 
            type="text"
            value={formData.brandName}
            onChange={(e) => setFormData({...formData, brandName: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
              {t.category}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
              required
            >
              <option value="">-</option>
              {t.categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
              {t.ageGroup}
            </label>
            <select
              value={formData.ageGroup}
              onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
              required
            >
              <option value="">-</option>
              {t.ageGroups.map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
              {t.quantity}
            </label>
            <input 
              type="text"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              placeholder={lang === 'zh' ? '例如：100-500件' : 'e.g., 100-500 pcs'}
              className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
              {t.budget}
            </label>
            <input 
              type="text"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              placeholder={lang === 'zh' ? '例如：5-10万' : 'e.g., $10k-20k'}
              className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
            {t.style}
          </label>
          <select
            value={formData.style}
            onChange={(e) => setFormData({...formData, style: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
          >
            <option value="">-</option>
            {t.styles.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
            {t.deadline}
          </label>
          <input 
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
            {t.requirements}
          </label>
          <textarea 
            value={formData.requirements}
            onChange={(e) => setFormData({...formData, requirements: e.target.value})}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none resize-none"
            placeholder={lang === 'zh' ? '请描述您的详细需求...' : 'Please describe your requirements...'}
          />
        </div>

        <div className="flex gap-4">
          <button 
            type="submit"
            className="flex-1 py-4 bg-neutral-900 text-white hover:bg-black transition-all text-xs tracking-widest uppercase font-bold"
          >
            {t.submit}
          </button>
          {onClose && (
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-4 border border-gray-300 hover:bg-gray-50 transition-all text-xs tracking-widest uppercase font-bold"
            >
              {t.close}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CustomizationForm;
