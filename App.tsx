import { supabase } from './supabaseClient';
import React, { useState, useMemo, useEffect } from 'react';
import { Visibility, PortfolioItem } from './types';
import PortfolioCard from './components/PortfolioCard';
import PriceCalculator from './components/PriceCalculator';
import WatermarkedImage from './components/WatermarkedImage';
import ContactPage from './components/ContactPage';
import CustomizationForm from './components/CustomizationForm';
import AdminPanel from './components/AdminPanel';
import ImagePasswordPrompt from './components/ImagePasswordPrompt';
import DesignerPage from './components/DesignerPage';
import { translateCategory, translateAgeGroup } from './utils/translations';

// 1. 应用级别翻译配置
const APP_TRANSLATIONS = {
  portfolio: { zh: '作品集', en: 'Portfolio' },
  designers: { zh: '设计师', en: 'Designers' },
  contact: { zh: '联系我们', en: 'Contact' },
  enterPortfolio: { zh: '进入作品集 / ENTER', en: 'Enter Portfolio' },
  designerBioDefault: { 
    zh: '致力于探索儿童审美的边界。我们相信设计不仅仅是服装，更是关于成长的叙事逻辑。', 
    en: 'Dedicated to exploring the boundaries of children\'s aesthetics. We believe design is not just about clothing, but a narrative of growth.' 
  },
  designDescription: { zh: '设计说明', en: 'Description' },
  fabricLabel: { zh: '面料建议', en: 'Fabric' },
  fixedPrice: { zh: '意向一口价', en: 'Fixed Price' },
  copyright: { zh: '© 法律申明：设计版权归设计师所有，购买仅获相应商业授权。', en: '© Legal Notice: Copyright belongs to the designer. Purchase grants usage rights only.' },
  inquireBtn: { zh: '获取授权 / 立即联系', en: 'Inquire for Rights' },
  backToTop: { zh: '返回首页', en: 'Back' }
};

// 2. 定义新类别
enum Category {
  APPAREL = "服装类",
  PATTERN = "花稿类",
  TEXTILE = "纺织品类",
  MORE = "更多类别"
}

// 类别规范化函数
const normalizeCategoryValue = (value: string): string => {
  if (!value) return Category.MORE;
  const categoryMap: Record<string, string> = {
    '外服': Category.APPAREL, 'OUTERWEAR': Category.APPAREL,
    '家居服': Category.PATTERN, 'LOUNGEWEAR': Category.PATTERN,
    '花稿': Category.PATTERN, 'PATTERNS': Category.PATTERN,
    '服饰': Category.TEXTILE, 'ACCESSORIES': Category.TEXTILE,
    '服装类': Category.APPAREL, '花稿类': Category.PATTERN,
    '纺织品类': Category.TEXTILE, '更多类别': Category.MORE,
  };
  return categoryMap[value] || value;
};

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  
  // 云端数据
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  
  // 解锁状态
  const [showImagePasswordPrompt, setShowImagePasswordPrompt] = useState(false);
  const [imagePasswordUnlocked, setImagePasswordUnlocked] = useState<Set<string>>(new Set());

  // 后台状态
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // 页面导航与自动填表状态
  const [showContactPage, setShowContactPage] = useState(false);
  const [showDesignerPage, setShowDesignerPage] = useState(true); 
  const [initialContactMessage, setInitialContactMessage] = useState(''); // 新增：预填消息

  // --- 同步云端数据 ---
  const fetchCloudData = async () => {
    const [pRes, dRes] = await Promise.all([
      supabase.from('portfolio_items').select('*').order('id', { ascending: false }),
      supabase.from('designers').select('*')
    ]);
    if (pRes.data) setPortfolioItems(pRes.data);
    if (dRes.data) setDesigners(dRes.data);
  };

  useEffect(() => {
    fetchCloudData();
    const channel = supabase.channel('cloud-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_items' }, fetchCloudData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // --- 过滤逻辑 ---
  const filteredItems = useMemo(() => {
    const list = portfolioItems.filter(item => {
      if (selectedCategory === 'ALL') return true;
      return normalizeCategoryValue(item.category) === selectedCategory;
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
    setImagePasswordUnlocked(prev => {
      const next = new Set(prev);
      next.add(itemId);
      return next;
    });
    setShowImagePasswordPrompt(false);
  };

  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <header className="bg-white border-b p-6 flex justify-between items-center px-10 border-neutral-200">
          <h1 className="font-black text-xl">KIDSWAVE ADMIN</h1>
          <button onClick={() => setIsAdminLoggedIn(false)} className="text-xs font-bold border-2 border-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-all">EXIT</button>
        </header>
        <AdminPanel lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-neutral-900">
      {/* 沉浸式导航 */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-100 h-24 flex items-center justify-between px-8 md:px-16">
        <div className="cursor-pointer group" onClick={() => setShowDesignerPage(true)}>
          <h1 className="text-2xl font-black tracking-tighter serif-font group-hover:scale-105 transition-transform">KIDSWAVE</h1>
          <p className="text-[9px] tracking-[0.3em] uppercase text-neutral-400">Junior Portfolio</p>
        </div>
        
        <nav className="hidden md:flex items-center space-x-10 text-[10px] font-bold tracking-[0.2em] uppercase">
          <button onClick={() => setShowDesignerPage(false)} className={!showDesignerPage ? 'text-black border-b-2 border-black pb-1' : 'text-neutral-400 hover:text-black'}>{APP_TRANSLATIONS.portfolio[lang]}</button>
          <button onClick={() => setShowDesignerPage(true)} className={showDesignerPage ? 'text-black border-b-2 border-black pb-1' : 'text-neutral-400 hover:text-black'}>{APP_TRANSLATIONS.designers[lang]}</button>
          <button onClick={() => setShowContactPage(true)} className="text-neutral-400 hover:text-black">{APP_TRANSLATIONS.contact[lang]}</button>
          <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="bg-neutral-900 text-white px-3 py-1 rounded-sm text-[9px]">{lang === 'zh' ? 'EN' : 'CN'}</button>
        </nav>
      </header>

      <main className="pt-24">
        {showDesignerPage ? (
          /* --- 场景 1: 设计师开屏大页面 --- */
          <section className="animate-in fade-in duration-1000">
            <div className="relative h-[85vh] flex flex-col items-center justify-center text-center px-6">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden mb-12 shadow-2xl border-[6px] border-white relative z-10">
                 <img src={designers[0]?.image || "https://images.unsplash.com/photo-1554044065-3b0d372d9c4c?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover" alt="Designer" />
              </div>
              <h2 className="text-5xl md:text-8xl font-bold serif-font mb-6 tracking-tighter text-neutral-900">
                {designers[0]?.name || "KIDSWAVE DESIGN"}
              </h2>
              <p className="max-w-xl text-base md:text-lg text-neutral-500 leading-relaxed mb-14 px-4 font-light italic">
                {designers[0]?.bio || APP_TRANSLATIONS.designerBioDefault[lang]}
              </p>
              
              <button 
                onClick={() => setShowDesignerPage(false)}
                className="group relative px-12 py-5 bg-black text-white text-xs font-bold tracking-[0.4em] uppercase rounded-full overflow-hidden hover:scale-110 transition-all duration-500 shadow-2xl"
              >
                <span className="relative z-10">{APP_TRANSLATIONS.enterPortfolio[lang]}</span>
                <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </button>
            </div>
          </section>
        ) : (
          /* --- 场景 2: 九宫格列表 --- */
          <section className="max-w-7xl mx-auto px-6 py-12 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-wrap gap-3 mb-20 justify-center">
              {['ALL', ...Object.values(Category)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-8 py-3 text-[10px] tracking-widest uppercase border-b-2 transition-all font-bold ${
                    selectedCategory === cat ? 'border-black text-black bg-neutral-100' : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  {cat === 'ALL' ? (lang === 'zh' ? '全部品类' : 'All') : cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {filteredItems.map(item => (
                <PortfolioCard key={item.id} item={item} onClick={handleCardClick} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 作品详情 - 增加英文适配逻辑 */}
      {selectedItem && !showImagePasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-12 overflow-y-auto animate-in zoom-in-95 duration-300">
          <div className="bg-white w-full max-w-6xl rounded-3xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl">
            <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 z-10 bg-black/10 hover:bg-black text-white p-3 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5"/></svg>
            </button>

            {/* 图片展示: 解锁后展示 originalImage */}
            <div className="md:w-3/5 bg-neutral-100">
              <WatermarkedImage 
                src={imagePasswordUnlocked.has(selectedItem.id) ? (selectedItem.originalImage || selectedItem.coverImage) : selectedItem.coverImage} 
                alt={selectedItem.title} 
                className="w-full h-full"
                isSemiPublic={selectedItem.visibility === 'SEMI_PUBLIC' && !imagePasswordUnlocked.has(selectedItem.id)}
                blurPercentage={selectedItem.blurPercentage}
              />
            </div>

            {/* 信息说明 - 支持多语言字段展示 */}
            <div className="md:w-2/5 p-10 md:p-14 flex flex-col justify-between bg-white">
              <div className="space-y-10">
                <div>
                  <span className="text-[10px] font-black text-neutral-300 tracking-[0.3em] uppercase">{selectedItem.category}</span>
                  <h2 className="text-4xl font-bold serif-font mt-4 tracking-tighter">
                    {lang === 'zh' ? selectedItem.title : ((selectedItem as any).title_en || selectedItem.title)}
                  </h2>
                </div>

                <div className="space-y-6 text-sm text-neutral-500 leading-relaxed font-light">
                  <p>
                    <strong className="text-black font-bold mr-2">{APP_TRANSLATIONS.designDescription[lang]}</strong>
                    {lang === 'zh' ? selectedItem.designInspiration : ((selectedItem as any).designInspiration_en || selectedItem.designInspiration)}
                  </p>
                  {(lang === 'zh' ? selectedItem.fabricSuggestions : (selectedItem as any).fabricSuggestions_en) && (
                    <p>
                      <strong className="text-black font-bold mr-2">{APP_TRANSLATIONS.fabricLabel[lang]}</strong>
                      {lang === 'zh' ? selectedItem.fabricSuggestions : (selectedItem as any).fabricSuggestions_en}
                    </p>
                  )}
                </div>

                <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-xs font-bold text-neutral-400">{APP_TRANSLATIONS.fixedPrice[lang]}</span>
                    <span className="text-4xl font-black">￥{selectedItem.basePrice}</span>
                  </div>
                  <p className="text-[9px] text-neutral-400 border-t border-neutral-200 pt-6 leading-loose">{APP_TRANSLATIONS.copyright[lang]}</p>
                </div>
              </div>

              {/* 关键：自动填表按钮 */}
              <button 
                onClick={() => {
                  const titleStr = lang === 'zh' ? selectedItem.title : ((selectedItem as any).title_en || selectedItem.title);
                  const msg = lang === 'zh' 
                    ? `您好，我对作品《${titleStr}》非常感兴趣，希望能了解更多授权及合作细节。`
                    : `Hi, I am interested in "${titleStr}" and would like to know more about its licensing and cooperation details.`;
                  setInitialContactMessage(msg);
                  setShowContactPage(true);
                }} 
                className="w-full py-6 bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] mt-10 rounded-2xl shadow-xl hover:bg-neutral-800 transition-all"
              >
                {APP_TRANSLATIONS.inquireBtn[lang]}
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
          onSuccess={() => { handleImagePasswordSuccess(selectedItem.id); }}
          lang={lang}
        />
      )}

      {/* 联系页面 - 传递 initialMessage */}
      {showContactPage && (
        <ContactPage 
          onClose={() => {
            setShowContactPage(false);
            setInitialContactMessage('');
          }} 
          lang={lang} 
          initialMessage={initialContactMessage}
        />
      )}

      {/* 后台登录 */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-6 backdrop-blur-md">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (adminPassword === 'wlj666') { setIsAdminLoggedIn(true); setShowAdminLogin(false); setAdminPassword(''); }
            else { alert('验证失败'); }
          }} className="bg-white p-16 rounded-3xl max-w-sm w-full text-center space-y-8 shadow-2xl">
            <h3 className="font-bold text-xl tracking-tighter uppercase text-black">Studio Admin</h3>
            <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="PASSWORD" 
              className="w-full p-5 bg-neutral-100 rounded-2xl text-center outline-none focus:ring-2 focus:ring-black font-mono tracking-widest text-black" autoFocus />
            <button type="submit" className="w-full py-5 bg-black text-white font-black text-xs tracking-widest rounded-2xl hover:bg-neutral-800 transition-colors">AUTHORIZE</button>
            <button type="button" onClick={() => setShowAdminLogin(false)} className="text-[10px] text-neutral-400 hover:text-black">CANCEL</button>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="py-24 text-center border-t border-neutral-100 bg-white mt-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-4">
            <h4 className="text-2xl font-black serif-font text-black">KIDSWAVE</h4>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-light">重塑儿童审美的边界。通过极简主义设计语言为成长注入高级质感。</p>
          </div>
          <div className="flex flex-col md:items-end space-y-6">
             <p className="text-[9px] text-neutral-300 tracking-[0.4em] uppercase font-bold">© 2026 KIDSWAVE STUDIO PORTFOLIO</p>
             <button onClick={() => setShowAdminLogin(true)} className="text-[9px] font-bold text-neutral-200 hover:text-neutral-900 transition-colors uppercase tracking-[0.2em]">[ Maintainer Entrance ]</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;