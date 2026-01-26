
import React, { useState, useMemo } from 'react';
import { MOCK_PORTFOLIO } from './services/mockData';
import { Category, Visibility, PortfolioItem } from './types';
import PortfolioCard from './components/PortfolioCard';
import PriceCalculator from './components/PriceCalculator';
import WatermarkedImage from './components/WatermarkedImage';
import ContactPage from './components/ContactPage';
import CustomizationForm from './components/CustomizationForm';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [selectedVisibility, setSelectedVisibility] = useState<Visibility | 'ALL'>('PUBLIC');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  
  // 普通作品查看密码状态
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [viewerPassword, setViewerPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 管理员后台进入状态
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // 联系页面状态
  const [showContactPage, setShowContactPage] = useState(false);
  
  // 移动端菜单状态
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // 过滤逻辑
  const filteredItems = useMemo(() => {
    return MOCK_PORTFOLIO.filter(item => {
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchVis = selectedVisibility === 'ALL' || item.visibility === selectedVisibility;
      return matchCat && matchVis;
    });
  }, [selectedCategory, selectedVisibility]);

  const handleCardClick = (item: PortfolioItem) => {
    if (item.visibility === Visibility.SEMI_PUBLIC && !isUnlocked) {
      setSelectedItem(item);
      setShowPasswordPrompt(true);
    } else {
      setSelectedItem(item);
    }
  };

  const handleViewerPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewerPassword === '8888') {
      setIsUnlocked(true);
      setShowPasswordPrompt(false);
      setViewerPassword('');
    } else {
      alert('密码错误，请联系设计师获取授权');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 管理员密码预设为 admin666
    if (adminPassword === 'wlj666') {
      // 使用正确的 GitHub Pages 路径跳转
      window.location.href = '/kidswave/admin/';
    } else {
      alert('管理权限验证失败');
    }
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#fafafa]/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex flex-col cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <h1 className="text-2xl font-bold tracking-tighter serif-font uppercase">KIDSWAVE</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400">Junior Fashion Portfolio</p>
          </div>
          
          <nav className="hidden md:flex items-center space-x-12 text-xs font-medium tracking-widest uppercase text-neutral-500">
            <button 
              onClick={() => setShowContactPage(true)}
              className="hover:text-black transition-colors"
            >
              Contact
            </button>
            <button 
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="px-4 py-2 border border-neutral-200 hover:border-neutral-400 transition-all"
            >
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="px-5 py-2.5 bg-neutral-900 text-white hover:bg-black transition-all flex items-center space-x-2"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>{lang === 'zh' ? '用户登录' : 'Login'}</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-neutral-100 rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100 py-6 px-6 space-y-4">
            <button 
              onClick={() => {
                setShowContactPage(true);
                setShowMobileMenu(false);
              }}
              className="w-full text-left py-3 text-sm uppercase tracking-widest hover:text-black transition-colors"
            >
              Contact
            </button>
            <button 
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="w-full text-left py-3 px-4 border border-neutral-200 text-sm uppercase tracking-widest"
            >
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
            <button 
              onClick={() => {
                setShowAdminLogin(true);
                setShowMobileMenu(false);
              }}
              className="w-full py-3 bg-neutral-900 text-white text-sm uppercase tracking-widest flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{lang === 'zh' ? '用户登录' : 'Login'}</span>
            </button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <section className="mb-16 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                {lang === 'zh' ? 'Categories (品类筛选)' : 'Product Categories'}
              </p>
              <div className="flex flex-wrap gap-4">
                {['ALL', ...Object.values(Category)].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as any)}
                    className={`px-6 py-2 text-xs tracking-widest uppercase transition-all border ${
                      selectedCategory === cat ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-transparent text-neutral-500 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {cat === 'ALL' ? (lang === 'zh' ? '全部' : 'All') : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                {lang === 'zh' ? 'Visibility (授权级别)' : 'Visibility Level'}
              </p>
              <div className="flex flex-wrap gap-4">
                {[Visibility.PUBLIC, Visibility.SEMI_PUBLIC].map(vis => (
                  <button
                    key={vis}
                    onClick={() => setSelectedVisibility(vis as any)}
                    className={`px-6 py-2 text-xs tracking-widest uppercase transition-all border ${
                      selectedVisibility === vis ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-transparent text-neutral-500 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {vis}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredItems.map(item => (
            <PortfolioCard key={item.id} item={item} onClick={handleCardClick} />
          ))}
        </section>
      </main>

      {/* Detail Overlay */}
      {selectedItem && !showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-6 overflow-y-auto">
          <div className="relative bg-white w-full max-w-6xl md:rounded-lg shadow-2xl flex flex-col md:flex-row min-h-[80vh] md:min-h-0">
            <button 
              onClick={closeDetail}
              className="absolute top-6 right-6 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div className="w-full md:w-1/2 h-[50vh] md:h-auto bg-neutral-100">
              <WatermarkedImage 
                src={selectedItem.coverImage} 
                alt={selectedItem.title} 
                className="h-full w-full" 
                isSemiPublic={selectedItem.visibility === Visibility.SEMI_PUBLIC}
              />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[100vh]">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">{selectedItem.category}</span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                    <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">{selectedItem.ageGroup}</span>
                  </div>
                  <h2 className="text-3xl font-bold serif-font text-neutral-900 mb-4">{selectedItem.title}</h2>
                  <p className="text-neutral-500 leading-relaxed">{selectedItem.description}</p>
                </div>

                <PriceCalculator basePrice={selectedItem.basePrice} addons={selectedItem.addons} lang={lang} />

                {/* 增值服务报价 */}
                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-lg">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-amber-900 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {lang === 'zh' ? '增值服务报价' : 'Value-Added Services'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-700">{lang === 'zh' ? '工艺版单' : 'Tech Pack'}</span>
                      <span className="font-bold text-amber-900">+¥100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-700">{lang === 'zh' ? '齐色建议' : 'Color Palette'}</span>
                      <span className="font-bold text-amber-900">+¥50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-700">{lang === 'zh' ? '面辅料建议与供应商信息' : 'Fabric & Supplier Info'}</span>
                      <span className="font-bold text-amber-900">+¥100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-700">{lang === 'zh' ? '小幅度改图' : 'Minor Revisions'}</span>
                      <span className="font-bold text-amber-900">¥50/{lang === 'zh' ? '次' : 'time'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-700">{lang === 'zh' ? '协助批复样板' : 'Sample Approval Support'}</span>
                      <span className="font-bold text-amber-900">¥50/{lang === 'zh' ? '次' : 'time'}</span>
                    </div>
                  </div>
                </div>

                {selectedItem.visibility === Visibility.EXCLUSIVE ? (
                  <>
                    <div className="p-8 bg-neutral-900 text-white rounded-lg text-center space-y-4">
                      <p className="text-lg font-medium serif-font">
                        {lang === 'zh' ? '该作品为品牌专属定制系列' : 'Exclusive Customization Series'}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {lang === 'zh' 
                          ? '目前无法直接购买或下载高清源文件。如有定制需求或相似意向，请联系设计师进行解锁与合作。' 
                          : 'Not available for direct purchase. Please contact the designer for customization inquiries.'}
                      </p>
                      <button 
                        onClick={() => setShowContactPage(true)}
                        className="w-full py-4 border border-white/20 hover:bg-white hover:text-black transition-all text-xs tracking-widest uppercase font-bold"
                      >
                        {lang === 'zh' ? '联系设计师解锁 (CONTACT)' : 'Contact Designer'}
                      </button>
                    </div>
                    
                    {/* 专属定制问卷 */}
                    <CustomizationForm lang={lang} />
                  </>
                ) : (
                  <div className="space-y-4">
                    <button className="w-full py-4 bg-neutral-900 text-white hover:bg-black transition-all text-xs tracking-widest uppercase font-bold flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span>{lang === 'zh' ? '下载高清方案 (DOWNLOAD HI-RES)' : 'Download Hi-Res'}</span>
                    </button>
                    <p className="text-[10px] text-center text-neutral-400 uppercase tracking-widest">
                      STORAGE SOURCE: SECURE R2 BUCKET
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Viewer Password Modal (Member Content) */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
          <div className="bg-white p-10 rounded-lg shadow-2xl max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="space-y-2">
              <h3 className="text-xl font-bold serif-font">半公开作品库鉴权</h3>
              <p className="text-sm text-neutral-500">输入会员专属密码以查看高清大图及完整版单</p>
            </div>
            <form onSubmit={handleViewerPasswordSubmit} className="space-y-4">
              <input 
                type="password" 
                value={viewerPassword}
                onChange={(e) => setViewerPassword(e.target.value)}
                placeholder="请输入四位查看密码"
                className="w-full px-4 py-4 border-b-2 border-neutral-100 focus:border-neutral-900 outline-none text-center text-lg tracking-widest"
                autoFocus
              />
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowPasswordPrompt(false)}
                  className="flex-1 py-4 text-xs tracking-widest uppercase font-bold text-neutral-400 hover:text-neutral-900"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-neutral-900 text-white text-xs tracking-widest uppercase font-bold hover:bg-black"
                >
                  解锁查看
                </button>
              </div>
            </form>
            <p className="text-[10px] text-neutral-400">TIPS: 初始查看密码为 8888</p>
          </div>
        </div>
      )}

      {/* Admin Login Modal (Maintainer Entrance) */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-900/90 backdrop-blur-xl p-6">
          <div className="bg-white p-12 rounded-lg shadow-2xl max-w-sm w-full text-center space-y-10 border border-white/20">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="text-xl font-bold serif-font uppercase tracking-tighter">Studio Maintainer</h3>
              <p className="text-xs text-neutral-400 tracking-widest uppercase font-medium">管理员身份验证</p>
            </div>
            
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <div className="relative">
                <input 
                  type="password" 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="请输入后台管理密码"
                  className="w-full px-4 py-4 bg-neutral-50 rounded border border-neutral-100 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none text-center text-sm font-medium"
                  autoFocus
                />
              </div>
              <div className="flex flex-col space-y-3">
                <button 
                  type="submit"
                  className="w-full py-4 bg-neutral-900 text-white text-xs tracking-widest uppercase font-bold hover:bg-black transition-all shadow-lg"
                >
                  验证并进入后台
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="w-full py-3 text-[10px] tracking-widest uppercase font-bold text-neutral-400 hover:text-neutral-900"
                >
                  返回主页 (EXIT)
                </button>
              </div>
            </form>
            <p className="text-[9px] text-neutral-300 uppercase tracking-widest">
              Security Notice: Unauthorized access is recorded.
            </p>
          </div>
        </div>
      )}

      {/* Contact Page Modal */}
      {showContactPage && (
        <ContactPage onClose={() => setShowContactPage(false)} lang={lang} />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-24 mt-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h2 className="text-xl font-bold serif-font uppercase tracking-tighter">KIDSWAVE Studio</h2>
            <p className="text-sm text-neutral-500 leading-relaxed">
              致力于重塑儿童审美边界，通过极简主义设计语言为成长注入高级质感。我们相信每一个细节都值得被精研。
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Collaboration</p>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>Business: design@kidswave.studio</p>
              <p>Studio: 广州市</p>
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="text-neutral-300 hover:text-neutral-900 transition-colors text-[10px] uppercase font-bold tracking-widest"
              >
                [ 维护者登录入口 ]
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Copyright</p>
            <div className="space-y-2 text-sm text-neutral-500">
              <p>© 2026 KIDSWAVE. All Rights Reserved.</p>
              <p className="text-xs">网站受内容完整性保护，未经授权禁止克隆。所有作品源文件托管于加密 R2 服务器。</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
