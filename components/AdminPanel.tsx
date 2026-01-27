import React, { useState, useEffect } from 'react';
import WatermarkedImage from './WatermarkedImage';
import { Category, Visibility, AgeGroup, PortfolioItem } from '../types';

interface AdminPanelProps {
  lang: 'zh' | 'en';
}

const AdminPanel: React.FC<AdminPanelProps> = ({ lang }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stats'>('list');
  
  const [formData, setFormData] = useState({
    title: '',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    // 拆分价格：版权费 + 使用权费
    copyrightFee: 0,
    usageFee: 0,
    description: '',
    blurLevel: 0,
    password: '',
    assignedUsers: [] as string[],
    imageFile: null as File | null,
    imagePreview: ''
  });

  // 统计数据
  const stats = {
    total: items.length,
    public: items.filter(i => i.visibility === Visibility.PUBLIC).length,
    semiPublic: items.filter(i => i.visibility === Visibility.SEMI_PUBLIC).length,
    exclusive: items.filter(i => i.visibility === Visibility.EXCLUSIVE).length,
    byCategory: {
      [Category.OUTERWEAR]: items.filter(i => i.category === Category.OUTERWEAR).length,
      [Category.LOUNGEWEAR]: items.filter(i => i.category === Category.LOUNGEWEAR).length,
      [Category.ACCESSORIES]: items.filter(i => i.category === Category.ACCESSORIES).length,
      [Category.PATTERNS]: items.filter(i => i.category === Category.PATTERNS).length
    }
  };

  const content = {
    zh: {
      title: '作品管理后台',
      tabs: { list: '作品列表', add: '添加作品', stats: '统计概览' },
      stats: {
        title: '数据统计',
        total: '总作品数',
        public: '公开作品',
        semiPublic: '半公开作品',
        exclusive: '专属定制',
        byCategory: '分类统计',
        mostViewed: '访问量排行',
        viewCount: '访问次数'
      },
      form: {
        title: '作品标题',
        category: '类别',
        ageGroup: '年龄段',
        visibility: '可见性',
        basePrice: '基础价格',
        description: '作品描述',
        uploadImage: '上传图片',
        blurLevel: '模糊度',
        blurNote: '半公开作品将应用此模糊度',
        password: '访问密码',
        passwordNote: '半公开图片需要设置密码',
        assignUsers: '分配用户',
        assignUsersNote: '输入用户邮箱，多个邮箱用逗号分隔',
        save: '保存',
        cancel: '取消',
        delete: '删除',
        edit: '编辑'
      },
      categories: {
        [Category.OUTERWEAR]: '外服',
        [Category.LOUNGEWEAR]: '家居服',
        [Category.ACCESSORIES]: '服饰',
        [Category.PATTERNS]: '花稿'
      },
      visibility: {
        [Visibility.PUBLIC]: '公开',
        [Visibility.SEMI_PUBLIC]: '半公开',
        [Visibility.EXCLUSIVE]: '专属定制'
      },
      messages: {
        saved: '保存成功！',
        deleted: '删除成功！',
        selectImage: '请选择图片',
        confirmDelete: '确认删除这个作品吗？'
      }
    },
    en: {
      title: 'Portfolio Management',
      tabs: { list: 'Portfolio List', add: 'Add Item', stats: 'Statistics' },
      stats: {
        title: 'Data Overview',
        total: 'Total Items',
        public: 'Public',
        semiPublic: 'Semi-Public',
        exclusive: 'Exclusive',
        byCategory: 'By Category',
        mostViewed: 'Most Viewed',
        viewCount: 'Views'
      },
      form: {
        title: 'Title',
        category: 'Category',
        ageGroup: 'Age Group',
        visibility: 'Visibility',
        basePrice: 'Base Price',
        description: 'Description',
        uploadImage: 'Upload Image',
        blurLevel: 'Blur Level',
        blurNote: 'Semi-public items will apply this blur',
        password: 'Access Password',
        passwordNote: 'Required for semi-public images',
        assignUsers: 'Assign Users',
        assignUsersNote: 'Enter user emails, separated by commas',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit'
      },
      categories: {
        [Category.OUTERWEAR]: 'Outerwear',
        [Category.LOUNGEWEAR]: 'Loungewear',
        [Category.ACCESSORIES]: 'Accessories',
        [Category.PATTERNS]: 'Patterns'
      },
      visibility: {
        [Visibility.PUBLIC]: 'Public',
        [Visibility.SEMI_PUBLIC]: 'Semi-Public',
        [Visibility.EXCLUSIVE]: 'Exclusive'
      },
      messages: {
        saved: 'Saved successfully!',
        deleted: 'Deleted successfully!',
        selectImage: 'Please select an image',
        confirmDelete: 'Confirm delete this item?'
      }
    }
  };

  const t = content[lang];

  // 加载作品数据
  useEffect(() => {
    const savedItems = localStorage.getItem('portfolioItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // 保存到 localStorage
  const saveItems = (newItems: PortfolioItem[]) => {
    localStorage.setItem('portfolioItems', JSON.stringify(newItems));
    setItems(newItems);
    // 触发自定义事件通知 App.tsx 重新加载数据
    window.dispatchEvent(new Event('portfolioUpdated'));
  };

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          imagePreview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 添加/更新作品
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('handleSubmit called', { formData, editingItem });
    
    if (!formData.imagePreview && !editingItem) {
      alert(t.messages.selectImage);
      return;
    }

    // 验证半公开图片必须有密码
    if (formData.visibility === Visibility.SEMI_PUBLIC && !formData.password) {
      alert(lang === 'zh' ? '半公开作品必须设置密码' : 'Semi-public items require a password');
      return;
    }

    const newItem: PortfolioItem = {
      id: editingItem?.id || `item-${Date.now()}`,
      title: formData.title,
      coverImage: formData.imagePreview || editingItem?.coverImage || '',
      originalImage: formData.visibility === Visibility.SEMI_PUBLIC && formData.blurLevel > 0 
        ? (formData.imagePreview || editingItem?.coverImage) 
        : undefined,
      category: formData.category,
      ageGroup: formData.ageGroup,
      visibility: formData.visibility,
      copyrightFee: formData.copyrightFee,
      usageFee: formData.usageFee,
      basePrice: (formData.copyrightFee || 0) + (formData.usageFee || 0),
      description: formData.description,
      blurPercentage: formData.visibility === Visibility.SEMI_PUBLIC ? formData.blurLevel : 0,
      password: formData.visibility === Visibility.SEMI_PUBLIC ? formData.password : undefined,
      assignedUsers: formData.visibility === Visibility.EXCLUSIVE ? formData.assignedUsers : undefined,
      viewCount: editingItem?.viewCount || 0,
      addons: editingItem?.addons || [
        { label: '提供 AI 文件', price: 200 },
        { label: '配色方案建议', price: 150 }
      ]
    };

    console.log('New item created:', newItem);

    let newItems: PortfolioItem[];
    if (editingItem) {
      newItems = items.map(item => item.id === editingItem.id ? newItem : item);
    } else {
      newItems = [...items, newItem];
    }

    console.log('Saving items:', newItems);
    saveItems(newItems);
    alert(t.messages.saved);
    resetForm();
    setActiveTab('list');
  };

  // 删除作品
  const handleDelete = (id: string) => {
    if (confirm(t.messages.confirmDelete)) {
      const newItems = items.filter(item => item.id !== id);
      saveItems(newItems);
      alert(t.messages.deleted);
    }
  };

  // 编辑作品
  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    const inferredCopyright = item.copyrightFee ?? Math.round((item.basePrice || 0) * 0.6);
    const inferredUsage = item.usageFee ?? ((item.basePrice || 0) - inferredCopyright);
    setFormData({
      title: item.title,
      category: item.category,
      ageGroup: item.ageGroup,
      visibility: item.visibility,
      copyrightFee: inferredCopyright,
      usageFee: inferredUsage,
      description: item.description,
      blurLevel: item.blurPercentage || 0,
      password: item.password || '',
      assignedUsers: item.assignedUsers || [],
      imageFile: null,
      imagePreview: item.coverImage
    });
    setActiveTab('add');
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      title: '',
      category: Category.OUTERWEAR,
      ageGroup: AgeGroup.KIDS,
      visibility: Visibility.PUBLIC,
      copyrightFee: 0,
      usageFee: 0,
      description: '',
      blurLevel: 0,
      password: '',
      assignedUsers: [],
      imageFile: null,
      imagePreview: ''
    });
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold serif-font">{t.title}</h1>
          <p className="text-sm text-neutral-400 mt-2">
            {lang === 'zh' ? '管理您的作品集' : 'Manage your portfolio'}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'list'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {t.tabs.list}
              </button>
              <button
                onClick={() => {
                  setActiveTab('add');
                  resetForm();
                }}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'add'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {t.tabs.add}
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'stats'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {t.tabs.stats}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'stats' ? (
              // 统计页面
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">{t.stats.title}</h2>
                
                {/* 总体统计 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium mb-2">{t.stats.total}</div>
                    <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                    <div className="text-sm text-green-600 font-medium mb-2">{t.stats.public}</div>
                    <div className="text-3xl font-bold text-green-900">{stats.public}</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg border border-amber-200">
                    <div className="text-sm text-amber-600 font-medium mb-2">{t.stats.semiPublic}</div>
                    <div className="text-3xl font-bold text-amber-900">{stats.semiPublic}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                    <div className="text-sm text-purple-600 font-medium mb-2">{t.stats.exclusive}</div>
                    <div className="text-3xl font-bold text-purple-900">{stats.exclusive}</div>
                  </div>
                </div>

                {/* 分类统计 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">{t.stats.byCategory}</h3>
                  <div className="space-y-3">
                    {Object.entries(stats.byCategory).map(([cat, count]) => (
                      <div key={cat} className="flex items-center justify-between">
                        <span className="text-neutral-700">{t.categories[cat as Category]}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-48 bg-neutral-100 rounded-full h-2">
                            <div 
                              className="bg-neutral-900 h-2 rounded-full transition-all"
                              style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 访问量排行 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">{t.stats.mostViewed}</h3>
                  <div className="space-y-3">
                    {[...items]
                      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                      .slice(0, 10)
                      .map((item, index) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded transition-colors">
                          <div className="text-2xl font-bold text-neutral-300 w-8 text-center">
                            #{index + 1}
                          </div>
                          <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-neutral-900 truncate">{item.title}</div>
                            <div className="text-xs text-neutral-500">
                              {t.categories[item.category]} · {t.visibility[item.visibility]}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-right">
                            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            <span className="text-lg font-bold text-neutral-900">
                              {item.viewCount || 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    {items.length === 0 && (
                      <div className="text-center py-8 text-neutral-400 text-sm">
                        {lang === 'zh' ? '暂无访问数据' : 'No view data yet'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : activeTab === 'list' ? (
              // 作品列表
              <div className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">
                    {lang === 'zh' ? '暂无作品' : 'No items yet'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative aspect-[4/5] bg-neutral-100">
                          <WatermarkedImage
                            src={item.coverImage}
                            alt={item.title}
                            className="w-full h-full"
                            isSemiPublic={item.visibility === Visibility.SEMI_PUBLIC}
                            blurPercentage={item.blurPercentage}
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <span className="px-2 py-1 bg-white/90 text-xs font-medium rounded">
                              {t.categories[item.category]}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              item.visibility === Visibility.PUBLIC ? 'bg-green-100 text-green-800' :
                              item.visibility === Visibility.SEMI_PUBLIC ? 'bg-amber-100 text-amber-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {t.visibility[item.visibility]}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                          <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-neutral-700">
                              <div>版权费: ¥{(item.copyrightFee ?? item.basePrice ?? 0)}</div>
                              <div>使用权费: ¥{(item.usageFee ?? 0)}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-xs font-medium rounded transition-colors"
                              >
                                {t.form.edit}
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded transition-colors"
                              >
                                {t.form.delete}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // 添加/编辑表单
              <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-6">
                {/* 图片上传区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 左侧：图片上传 */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t.form.uploadImage}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      {formData.imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={formData.imagePreview}
                            alt="Preview"
                            className="max-h-96 w-full object-contain mx-auto rounded"
                            style={{
                              filter: formData.visibility === Visibility.SEMI_PUBLIC 
                                ? `blur(${formData.blurLevel / 10}px)` 
                                : 'none'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imagePreview: '', imageFile: null })}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            {lang === 'zh' ? '移除图片' : 'Remove Image'}
                          </button>
                          {/* Homepage preview (matches how it will appear on the site) */}
                          <div className="mt-4">
                            <p className="text-xs text-neutral-500 mb-2">{lang === 'zh' ? '首页预览' : 'Homepage Preview'}</p>
                            <div className="w-full max-w-xs mx-auto rounded overflow-hidden border border-gray-200">
                              <div className="aspect-[4/5] bg-neutral-100">
                                <WatermarkedImage
                                  src={formData.imagePreview}
                                  alt={formData.title || 'homepage-preview'}
                                  className="w-full h-full"
                                  isSemiPublic={formData.visibility === Visibility.SEMI_PUBLIC}
                                  blurPercentage={formData.visibility === Visibility.SEMI_PUBLIC ? formData.blurLevel : 0}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12">
                          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <label className="cursor-pointer">
                            <span className="text-base text-neutral-600 font-medium">
                              {lang === 'zh' ? '点击上传图片' : 'Click to upload image'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                          <p className="text-xs text-neutral-400 mt-2">
                            {lang === 'zh' ? '支持 JPG, PNG, GIF 格式' : 'Support JPG, PNG, GIF'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 右侧：模糊度设置（半公开作品时显示） */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {lang === 'zh' ? '图片效果设置' : 'Image Effect Settings'}
                    </label>
                    <div className="border-2 border-gray-200 rounded-lg p-6 h-full">
                      {formData.visibility === Visibility.SEMI_PUBLIC ? (
                        <div className="space-y-6">
                          {/* 模糊度控制 */}
                          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-5">
                            <div className="flex items-center justify-between mb-4">
                              <label className="text-base font-bold text-amber-900">
                                {t.form.blurLevel}
                              </label>
                              <span className="text-3xl font-bold text-amber-600">
                                {formData.blurLevel}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={formData.blurLevel}
                              onChange={(e) => setFormData({ ...formData, blurLevel: Number(e.target.value) })}
                              className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                            />
                            <div className="flex justify-between text-xs text-amber-700 mt-2 font-medium">
                              <span>0% (清晰)</span>
                              <span>50% (中度)</span>
                              <span>100% (完全模糊)</span>
                            </div>
                          </div>

                          {/* 实时预览提示 */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900 mb-1">
                                  {lang === 'zh' ? '💡 实时预览' : '💡 Live Preview'}
                                </p>
                                <p className="text-xs text-blue-700">
                                  {lang === 'zh' 
                                    ? '左侧图片会实时显示模糊效果，调整滑块查看不同程度的模糊' 
                                    : 'The image on the left shows real-time blur effect'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 推荐设置 */}
                          <div>
                            <p className="text-xs font-medium text-neutral-600 mb-2">
                              {lang === 'zh' ? '推荐设置：' : 'Recommended:'}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { label: lang === 'zh' ? '轻度' : 'Light', value: 20 },
                                { label: lang === 'zh' ? '中度' : 'Medium', value: 50 },
                                { label: lang === 'zh' ? '重度' : 'Heavy', value: 80 }
                              ].map(preset => (
                                <button
                                  key={preset.value}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, blurLevel: preset.value })}
                                  className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
                                    formData.blurLevel === preset.value
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-white border border-gray-300 text-gray-700 hover:border-amber-400'
                                  }`}
                                >
                                  {preset.label} {preset.value}%
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-center">
                          <div className="space-y-3">
                            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            <p className="text-sm text-gray-500">
                              {lang === 'zh' 
                                ? '选择"半公开"可见性后\n可设置图片模糊度' 
                                : 'Select "Semi-Public" to\nenable blur settings'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 基本信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t.form.title}
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t.form.basePrice}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={formData.copyrightFee}
                        onChange={(e) => setFormData({ ...formData, copyrightFee: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                        placeholder={lang === 'zh' ? '版权费' : 'Copyright Fee'}
                        required
                      />
                      <input
                        type="number"
                        value={formData.usageFee}
                        onChange={(e) => setFormData({ ...formData, usageFee: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                        placeholder={lang === 'zh' ? '使用权费' : 'Usage Fee'}
                        required
                      />
                    </div>
                    <p className="text-xs text-neutral-400 mt-2">{lang === 'zh' ? '总价 = 版权费 + 使用权费' : 'Total = Copyright + Usage'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t.form.category}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                    >
                      {Object.values(Category).map(cat => (
                        <option key={cat} value={cat}>{t.categories[cat]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t.form.ageGroup}
                    </label>
                    <select
                      value={formData.ageGroup}
                      onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as AgeGroup })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                    >
                      <option value={AgeGroup.INFANT}>{lang === 'zh' ? '婴童' : 'Infant'}</option>
                      <option value={AgeGroup.KIDS}>{lang === 'zh' ? '小中童' : 'Kids'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t.form.visibility}
                    </label>
                    <select
                      value={formData.visibility}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value as Visibility })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                    >
                      {Object.values(Visibility).map(vis => (
                        <option key={vis} value={vis}>{t.visibility[vis]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 半公开密码设置 */}
                {formData.visibility === Visibility.SEMI_PUBLIC && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t.form.password} *
                    </label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={lang === 'zh' ? '设置访问密码（例如：abc123）' : 'Set access password (e.g., abc123)'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                      required
                    />
                    <p className="text-xs text-neutral-500 mt-2">{t.form.passwordNote}</p>
                  </div>
                )}

                {/* 专属定制用户分配 */}
                {formData.visibility === Visibility.EXCLUSIVE && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t.form.assignUsers}
                    </label>
                    <input
                      type="text"
                      value={formData.assignedUsers.join(', ')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        assignedUsers: e.target.value.split(',').map(email => email.trim()).filter(email => email) 
                      })}
                      placeholder={lang === 'zh' ? '例如：user1@email.com, user2@email.com' : 'e.g., user1@email.com, user2@email.com'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-neutral-500 mt-2">{t.form.assignUsersNote}</p>
                  </div>
                )}

                {/* 描述 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t.form.description}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>

                {/* 按钮 */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('list');
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t.form.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-black transition-colors"
                  >
                    {t.form.save}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
