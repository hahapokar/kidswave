import { supabase } from './supabaseClient';
import React, { useState, useMemo, useEffect } from 'react';
import { Visibility, PortfolioItem, Category } from './types'; // 统一使用你的全局定义
import PortfolioCard from './components/PortfolioCard';
import WatermarkedImage from './components/WatermarkedImage';
import ContactPage from './components/ContactPage';
import AdminPanel from './components/AdminPanel';
import ImagePasswordPrompt from './components/ImagePasswordPrompt';
import { translateCategory } from './utils/translations';

// 1. 应用级别翻译配置 - 确保包含所有保底文案
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
};

// 2. 类别规范化函数：适配你 types.ts 里的复数形式 (PATTERNS/TEXTILES/OTHER)
const normalizeCategoryValue = (value: string): string => {
  if (!value) return Category.OTHER;
  const categoryMap: Record<string, string> = {
    '外服': Category.APPAREL, 
    'OUTERWEAR': Category.APPAREL,
    '家居服': Category.PATTERNS, 
    'LOUNGEWEAR': Category.PATTERNS,
    '花稿': Category.PATTERNS, 
    'PATTERNS': Category.PATTERNS,
    '服饰': Category.TEXTILES, 
    'ACCESSORIES': Category.TEXTILES,
    '纺织品类': Category.TEXTILES,
    '更多类别': Category.OTHER
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
  
  // 解锁与后台状态
  const [showImagePasswordPrompt, setShowImagePasswordPrompt] = useState(false);
  const [imagePasswordUnlocked, setImagePasswordUnlocked] = useState<Set<string>>(new Set());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // 导航与询盘
  const [showContactPage, setShowContactPage] = useState(false);
  const [showDesignerPage, setShowDesignerPage] = useState(true); 
  const [initialContactMessage, setInitialContactMessage] = useState('');

  // --- 同步数据 ---
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
        <header className="bg-white border-b p-6 flex justify-between items-center px-10">
          <h1 className="font-black text-2xl">KIDSWAVE ADMIN</h1>
          <button onClick={() => setIsAdminLoggedIn(false)} className="text-sm font-bold border-2 border-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-all">EXIT</button>
        </header>
        <AdminPanel lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-neutral-900">
      {/* 沉浸式导航栏 - 字体增大到 text-base (16px) */}
      <header className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-neutral-100 h-28 flex items-center justify-between px-8 md:px-16">
        <div className="cursor-pointer group" onClick={() => setShowDesignerPage(true)}>
          <h1 className="text-4xl font-black tracking-tighter serif-font">KIDSWAVE</h1>
          <p className="text-sm tracking-[0.3em] uppercase text-neutral-400 mt-1">Junior Portfolio</p>
        </div>
        
        <nav className="hidden md:flex items-center space-x-12 text-base font-bold tracking-[0.15em] uppercase">
          <button onClick={() => setShowDesignerPage(false)} className={!showDesignerPage ? 'text-black border-b-2 border-black pb-1' : 'text-neutral-400 hover:text-black'}>{APP_TRANSLATIONS.portfolio[lang]}</button>
          <button onClick={() => setShowDesignerPage(true)} className={showDesignerPage ? 'text-black border-b-2 border-black pb-1' : 'text-neutral-400 hover:text-black'}>{APP_TRANSLATIONS.designers[lang]}</button>
          <button onClick={() => setShowContactPage(true)} className="text-neutral-400 hover:text-black">{APP_TRANSLATIONS.contact[lang]}</button>
          <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="bg-neutral-900 text-white px-5 py-2 rounded-lg text-xs ml-4 tracking-widest">{lang === 'zh' ? 'ENGLISH' : '中文'}</button>
        </nav>
      </header>

      <main className="pt-28">
        {showDesignerPage ? (
          /* --- 场景 1: 设计师开屏大页面 --- */
          <section className="animate-in fade-in duration-1000">
            <div className="relative h-[85vh] flex flex-col items-center justify-center text-center px-6">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-12 shadow-2xl border-[6px] border-white relative z-10">
                 <img src={designers[0]?.image || "https://images.unsplash.com/photo-1554044065-3b0d372d9c4c?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover" alt="Designer" />
              </div>
              <h2 className="text-6xl md:text-9xl font-bold serif-font mb-8 tracking-tighter text-neutral-900">
                {lang === 'zh' ? designers[0]?.name : (designers[0]?.name_en || designers[0]?.name || "KIDSWAVE DESIGN")}
              </h2>
              <p className="max-w-3xl text-xl md:text-3xl text-neutral-500 leading-relaxed mb-16 px-4 font-light italic">
                {lang === 'zh' ? designers[0]?.bio : (designers[0]?.bio_en || APP_TRANSLATIONS.designerBioDefault[lang])}
              </p>
              
              <button 
                onClick={() => setShowDesignerPage(false)}
                className="group relative px-20 py-8 bg-black text-white text-lg font-bold tracking-[0.4em] uppercase rounded-full overflow-hidden hover:scale-105 transition-all shadow-2xl"
              >
                <span className="relative z-10">{APP_TRANSLATIONS.enterPortfolio[lang]}</span>
              </button>
            </div>
          </section>
        ) : (
          /* --- 场景 2: 九宫格列表 --- */
          <section className="max-w-7xl mx-auto px-6 py-12 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-wrap gap-4 mb-20 justify-center">
              {['ALL', ...Object.values(Category)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-10 py-4 text-base tracking-widest uppercase border-b-2 transition-all font-bold ${
                    selectedCategory === cat ? 'border-black text-black bg-neutral-100' : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  {/* 使用 as any 解决 enum 复数定义的类型冲突，确保翻译生效 */}
                  {cat === 'ALL' ? (lang === 'zh' ? '全部品类' : 'All Works') : translateCategory(cat as any, lang)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {filteredItems.map(item => (
                <PortfolioCard key={item.id} item={item} onClick={handleCardClick} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 作品详情 - 字体全面调大 */}
      {selectedItem && !showImagePasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12 overflow-y-auto animate-in zoom-in-95 duration-300">
          <div className="bg-white w-full max-w-7xl rounded-3xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl">
            <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 z-10 bg-black/10 hover:bg-black text-white p-4 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5"/></svg>
            </button>

            <div className="md:w-3/5 bg-neutral-100">
              <WatermarkedImage 
                src={imagePasswordUnlocked.has(selectedItem.id) ? (selectedItem.originalImage || selectedItem.coverImage) : selectedItem.coverImage} 
                alt={selectedItem.title} 
                className="w-full h-full"
                isSemiPublic={selectedItem.visibility === 'SEMI_PUBLIC' && !imagePasswordUnlocked.has(selectedItem.id)}
                blurPercentage={selectedItem.blurPercentage}
              />
            </div>

            <div className="md:w-2/5 p-12 md:p-20 flex flex-col justify-between bg-white">
              <div className="space-y-12">
                <div>
                  <span className="text-xl font-black text-neutral-400 tracking-[0.3em] uppercase">{translateCategory(selectedItem.category, lang)}</span>
                  <h2 className="text-5xl md:text-7xl font-bold serif-font mt-6 tracking-tighter text-black">
                    {lang === 'zh' ? selectedItem.title : ((selectedItem as any).title_en || selectedItem.title)}
                  </h2>
                </div>

                <div className="space-y-8 text-2xl text-neutral-600 leading-relaxed font-light">
                  <p><strong className="text-black font-bold mr-3">{APP_TRANSLATIONS.designDescription[lang]}</strong>{lang === 'zh' ? selectedItem.designInspiration : ((selectedItem as any).designInspiration_en || selectedItem.designInspiration)}</p>
                  {(lang === 'zh' ? selectedItem.fabricSuggestions : (selectedItem as any).fabricSuggestions_en) && (
                    <p><strong className="text-black font-bold mr-3">{APP_TRANSLATIONS.fabricLabel[lang]}</strong>{lang === 'zh' ? selectedItem.fabricSuggestions : (selectedItem as any).fabricSuggestions_en}</p>
                  )}
                </div>

                <div className="bg-neutral-50 p-12 rounded-3xl border border-neutral-100">
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-base font-bold text-neutral-500 uppercase tracking-widest">{APP_TRANSLATIONS.fixedPrice[lang]}</span>
                    <span className="text-6xl font-black text-black">￥{selectedItem.basePrice}</span>
                  </div>
                  <p className="text-sm text-neutral-400 border-t border-neutral-200 pt-8 leading-loose font-medium">{APP_TRANSLATIONS.copyright[lang]}</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  const titleStr = lang === 'zh' ? selectedItem.title : ((selectedItem as any).title_en || selectedItem.title);
                  const msg = lang === 'zh' ? `您好，我对作品《${titleStr}》非常感兴趣，希望能了解更多授权及合作细节。` : `Hi, I am interested in "${titleStr}" and would like to know more about its licensing and cooperation details.`;
                  setInitialContactMessage(msg);
                  setShowContactPage(true);
                }} 
                className="w-full py-10 bg-black text-white font-black text-xl uppercase tracking-[0.4em] mt-12 rounded-2xl shadow-xl hover:bg-neutral-800 transition-all"
              >
                {APP_TRANSLATIONS.inquireBtn[lang]}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 密码弹窗 */}
      {showImagePasswordPrompt && selectedItem && (
        <ImagePasswordPrompt itemTitle={selectedItem.title} correctPassword={selectedItem.password || ''} onCancel={() => { setShowImagePasswordPrompt(false); setSelectedItem(null); }} onSuccess={() => { handleImagePasswordSuccess(selectedItem.id); }} lang={lang} />
      )}

      {/* 联系页面 - 自动填表逻辑 */}
      {showContactPage && (
        <ContactPage 
          onClose={() => { setShowContactPage(false); setInitialContactMessage(''); }} 
          lang={lang} 
          initialMessage={initialContactMessage} 
        />
      )}

      {/* 管理员登录弹窗 */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-6 backdrop-blur-md">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (adminPassword === 'wlj666') { setIsAdminLoggedIn(true); setShowAdminLogin(false); setAdminPassword(''); }
            else { alert('验证失败'); }
          }} className="bg-white p-20 rounded-3xl max-w-md w-full text-center space-y-10 shadow-2xl">
            <h3 className="font-bold text-3xl tracking-tighter uppercase text-black">Studio Admin</h3>
            <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="PASSWORD" 
              className="w-full p-6 bg-neutral-100 rounded-2xl text-center outline-none focus:ring-2 focus:ring-black font-mono tracking-widest text-xl text-black" autoFocus />
            <button type="submit" className="w-full py-6 bg-black text-white font-black text-lg tracking-widest rounded-2xl hover:bg-neutral-800">AUTHORIZE</button>
            <button type="button" onClick={() => setShowAdminLogin(false)} className="text-sm text-neutral-400 hover:text-black">CANCEL</button>
          </form>
        </div>
      )}

      <footer className="py-32 text-center border-t border-neutral-100 bg-white mt-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center text-left">
          <div className="space-y-6">
            <h4 className="text-5xl font-black serif-font text-black">KIDSWAVE</h4>
            <p className="text-lg text-neutral-400 max-w-md font-light leading-relaxed">重塑儿童审美的边界。通过极简主义设计语言为成长注入高级质感。我们相信每一个细节都值得被精研。</p>
          </div>
          <div className="flex flex-col md:items-end space-y-10">
             <p className="text-sm text-neutral-300 tracking-[0.4em] uppercase font-bold">© 2026 KIDSWAVE STUDIO PORTFOLIO</p>
             <button onClick={() => setShowAdminLogin(true)} className="text-sm font-bold text-neutral-200 hover:text-neutral-900 transition-colors uppercase tracking-[0.2em]">[ Maintainer Entrance ]</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;