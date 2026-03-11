import { supabase } from './supabaseClient';
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_PORTFOLIO } from './services/mockData';
import { Visibility, PortfolioItem, User } from './types';
import PortfolioCard from './components/PortfolioCard';
import PriceCalculator from './components/PriceCalculator';
import WatermarkedImage from './components/WatermarkedImage';
import ContactPage from './components/ContactPage';
import CustomizationForm from './components/CustomizationForm';
import AdminPanel from './components/AdminPanel';
import ImagePasswordPrompt from './components/ImagePasswordPrompt';
import DesignerPage from './components/DesignerPage';
import { translateCategory, translateAgeGroup } from './utils/translations';

// 定义符合你需求的新类别
enum Category {
  APPAREL = "服装类",
  PATTERN = "花稿类",
  TEXTILE = "纺织品类",
  MORE = "更多类别"
}

// 类别规范化函数：将旧的类别值映射到新的类别值
const normalizeCategoryValue = (value: string): string => {
  if (!value) return '';
  
  const categoryMap: Record<string, string> = {
    // 旧值 -> 新值
    '外服': Category.APPAREL,
    'OUTERWEAR': Category.APPAREL,
    'Outerwear': Category.APPAREL,
    '家居服': Category.PATTERN,
    'LOUNGEWEAR': Category.PATTERN,
    'Loungewear': Category.PATTERN,
    '服饰': Category.TEXTILE,
    'ACCESSORIES': Category.TEXTILE,
    'Accessories': Category.TEXTILE,
    '花稿': Category.PATTERN,
    'PATTERNS': Category.PATTERN,
    'Patterns': Category.PATTERN,
    // 新值保持不变
    '服装类': Category.APPAREL,
    '花稿类': Category.PATTERN,
    '纺织品类': Category.TEXTILE,
    '更多类别': Category.MORE,
  };
  
  return categoryMap[value] || value;
};

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  
  // 云端数据状态
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  
  // 密码与解锁状态
  const [showImagePasswordPrompt, setShowImagePasswordPrompt] = useState(false);
  const [imagePasswordUnlocked, setImagePasswordUnlocked] = useState<Set<string>>(new Set());

  // 后台管理状态
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // 页面切换状态
  const [showContactPage, setShowContactPage] = useState(false);
  const [showDesignerPage, setShowDesignerPage] = useState(true); // 默认开启设计师介绍大页面
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);

  // --- 1. 从云端同步数据 ---
  const fetchCloudData = async () => {
    console.log('正在同步云端数据...');
    const [pRes, dRes] = await Promise.all([
      supabase.from('portfolio_items').select('*').order('id', { ascending: false }),
      supabase.from('designers').select('*')
    ]);

    if (pRes.data) setPortfolioItems(pRes.data);
    if (dRes.data) setDesigners(dRes.data);
  };

  useEffect(() => {
    fetchCloudData();

    // 实时监听云端变动
    const channel = supabase.channel('cloud-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_items' }, fetchCloudData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // --- 2. 逻辑处理 ---
  const filteredItems = useMemo(() => {
    const list = portfolioItems.filter(item => {
      if (selectedCategory === 'ALL') return true;
      const normalizedItemCategory = normalizeCategoryValue(item.category);
      return normalizedItemCategory === selectedCategory;
    });
    return list.sort((a, b) => {
      const order = { [Visibility.PUBLIC]: 0, [Visibility.EXCLUSIVE]: 1, [Visibility.SEMI_PUBLIC]: 2 };
      return order[a.visibility as Visibility] - order[b.visibility as Visibility];
    });
  }, [selectedCategory, portfolioItems]);

  const handleCardClick = (item: PortfolioItem) => {
    if (item.visibility === Visibility.SEMI_PUBLIC && !imagePasswordUnlocked.has(item.id)) {
      setSelectedItem(item);
      setShowImagePasswordPrompt(true);
    } else {
      setSelectedItem(item);
    }
  };

  const handleImagePasswordSuccess = (itemId: string) => {
    setImagePasswordUnlocked(prev => new Set(prev).add(itemId));
    setShowImagePasswordPrompt(false);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'wlj666') {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('管理权限验证失败');
    }
  };

  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <header className="bg-white border-b p-4 flex justify-between items-center px-8">
          <h1 className="font-bold tracking-tighter">KIDSWAVE STUDIO ADMIN</h1>
          <button onClick={() => setIsAdminLoggedIn(false)} className="text-xs font-bold border px-4 py-2 rounded">退出管理</button>
        </header>
        <AdminPanel lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 沉浸式导航栏 */}
      <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 h-24 flex items-center justify-between px-10">
        <div className="cursor-pointer" onClick={() => setShowDesignerPage(true)}>
          <h1 className="text-3xl font-black serif-font">KIDSWAVE</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-12 text-base font-bold tracking-[0.15em] uppercase">
          <button onClick={() => setShowDesignerPage(false)} className={`py-2 px-4 rounded-lg transition-all ${!showDesignerPage ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}>作品集</button>
          <button onClick={() => setShowDesignerPage(true)} className={`py-2 px-4 rounded-lg transition-all ${showDesignerPage ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}>设计师</button>
          <button onClick={() => setShowContactPage(true)} className="py-2 px-4 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-all">联系</button>
          <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="bg-neutral-200 text-black px-4 py-2 rounded-lg font-bold hover:bg-neutral-300 transition-all">{lang === 'zh' ? 'EN' : 'CN'}</button>
        </nav>
      </header>

      <main className="pt-24">
        {showDesignerPage ? (
          /* --- 场景 1: 设计师开屏大页面 --- */
          <section className="animate-in fade-in duration-700">
            <div className="relative h-[90vh] flex flex-col items-center justify-center text-center p-6">
              {/* 这里会自动加载你上传的设计师头像 */}
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-10 shadow-2xl border-4 border-white">
                 <img src={designers[0]?.image || "https://images.unsplash.com/photo-1554044065-3b0d372d9c4c?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover" alt="Designer" />
              </div>
              <h2 className="text-6xl md:text-8xl font-bold serif-font mb-8 tracking-tighter">
                {designers[0]?.name || "KIDSWAVE DESIGN"}
              </h2>
              <p className="max-w-2xl text-xl text-neutral-700 leading-relaxed mb-16 px-4">
                {designers[0]?.bio || "致力于探索儿童审美的边界。我们相信设计不仅仅是服装，更是关于成长的叙事逻辑。"}
              </p>
              
              <button 
                onClick={() => setShowDesignerPage(false)}
                className="group relative px-16 py-6 bg-black text-white text-lg font-bold tracking-[0.3em] uppercase rounded-full overflow-hidden hover:scale-105 transition-transform shadow-lg"
              >
                <span className="relative z-10">{lang === 'zh' ? '查看作品集' : 'Enter Portfolio'}</span>
                <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              </button>
            </div>
          </section>
        ) : (
          /* --- 场景 2: 九宫格作品列表 --- */
          <section className="max-w-7xl mx-auto px-6 py-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-wrap gap-4 mb-16 justify-center">
              {['ALL', ...Object.values(Category)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-8 py-3 text-sm font-bold tracking-widest uppercase border-2 rounded-lg transition-all ${
                    selectedCategory === cat ? 'bg-black text-white border-black' : 'text-black border-neutral-400 hover:border-black hover:bg-neutral-50'
                  }`}
                >
                  {cat === 'ALL' ? '全部作品' : cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map(item => (
                <PortfolioCard key={item.id} item={item} onClick={handleCardClick} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 作品详情弹窗 */}
      {selectedItem && !showImagePasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-12 overflow-y-auto">
          <div className="bg-white w-full max-w-6xl rounded-2xl overflow-hidden flex flex-col md:flex-row relative">
            <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 z-10 bg-white/50 p-2 rounded-full hover:bg-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
            </button>

            {/* 图片展示区：关键修复！解锁后显示 originalImage */}
            <div className="md:w-1/2 bg-neutral-100 aspect-[3/4] md:aspect-auto">
              <WatermarkedImage 
                src={imagePasswordUnlocked.has(selectedItem.id) ? (selectedItem.originalImage || selectedItem.coverImage) : selectedItem.coverImage} 
                alt={selectedItem.title} 
                className="w-full h-full object-cover"
                isSemiPublic={selectedItem.visibility === 'SEMI_PUBLIC' && !imagePasswordUnlocked.has(selectedItem.id)}
                blurPercentage={selectedItem.blurPercentage}
              />
            </div>

            {/* 文字说明区 */}
            <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-between">
              <div className="space-y-8">
                <div>
                  <span className="text-xs font-bold text-neutral-600 tracking-widest uppercase">{selectedItem.category}</span>
                  <h2 className="text-5xl font-bold serif-font mt-4">{selectedItem.title}</h2>
                </div>

                <div className="space-y-6 text-base text-neutral-800 leading-relaxed">
                  <p><strong className="text-black">{lang === 'zh' ? '设计说明：' : 'Description: '}</strong>{selectedItem.designInspiration}</p>
                  {selectedItem.fabricSuggestions && <p><strong className="text-black">{lang === 'zh' ? '建议面料：' : 'Fabric: '}</strong>{selectedItem.fabricSuggestions}</p>}
                </div>

                <div className="bg-neutral-100 p-8 rounded-xl space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{lang === 'zh' ? '意向一口价' : 'Fixed Price'}</span>
                    <span className="text-4xl font-black">￥{selectedItem.basePrice}</span>
                  </div>
                  <p className="text-xs text-neutral-700 border-t pt-6">© 版权申明：该设计方案版权归设计师本人所有，购买仅获相应授权。</p>
                </div>
              </div>

              <button onClick={() => setShowContactPage(true)} className="w-full py-6 bg-black text-white font-bold text-lg uppercase tracking-widest mt-10 rounded-xl hover:bg-neutral-900 transition-all">
                {lang === 'zh' ? '获取授权/联系设计' : 'Inquire for Rights'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 密码弹窗 */}
      {showImagePasswordPrompt && selectedItem && (
        <ImagePasswordPrompt
          itemTitle={selectedItem.title}
          correctPassword={selectedItem.password || ''}
          onCancel={() => { setShowImagePasswordPrompt(false); setSelectedItem(null); }}
          onSuccess={() => handleImagePasswordSuccess(selectedItem.id)}
          lang={lang}
        />
      )}

      {/* 联系页面与管理员入口 */}
      {showContactPage && <ContactPage onClose={() => setShowContactPage(false)} lang={lang} />}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-6">
          <form onSubmit={handleAdminSubmit} className="bg-white p-12 rounded-2xl max-w-sm w-full text-center space-y-6">
            <h3 className="font-bold text-xl uppercase tracking-tighter">Maintainer Access</h3>
            <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="PASSWORD" 
              className="w-full p-4 bg-neutral-100 rounded-lg text-center outline-none focus:ring-2 focus:ring-black" />
            <button type="submit" className="w-full py-4 bg-black text-white font-bold">VERIFY</button>
            <button type="button" onClick={() => setShowAdminLogin(false)} className="text-[10px] text-neutral-400">CANCEL</button>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="py-20 text-center border-t border-gray-300">
        <p className="text-xs text-neutral-600 tracking-[0.4em] uppercase">© 2026 KIDSWAVE STUDIO PORTFOLIO</p>
        <button onClick={() => setShowAdminLogin(true)} className="mt-4 text-xs text-neutral-500 hover:text-black transition-colors">ADMIN</button>
      </footer>
    </div>
  );
};

export default App;