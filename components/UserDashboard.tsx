import React, { useState, useEffect } from 'react';
import { PortfolioItem, Visibility, User } from '../types';
import WatermarkedImage from './WatermarkedImage';

interface UserDashboardProps {
  user: User;
  lang: 'zh' | 'en';
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, lang, onLogout }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const content = {
    zh: {
      title: '我的专属设计',
      welcome: '欢迎回来',
      myItems: '我的作品',
      noItems: '暂无分配的专属作品',
      viewDetail: '查看详情',
      download: '购买版权获得高清图',
      close: '关闭',
      logout: '退出登录',
      description: '作品描述',
      price: '价格'
    },
    en: {
      title: 'My Exclusive Designs',
      welcome: 'Welcome Back',
      myItems: 'My Portfolio',
      noItems: 'No exclusive items assigned',
      viewDetail: 'View Details',
      download: 'Download Hi-Res',
      close: 'Close',
      logout: 'Logout',
      description: 'Description',
      price: 'Price'
    }
  };

  const t = content[lang];

  // 加载用户的专属作品
  useEffect(() => {
    const allItems = JSON.parse(localStorage.getItem('portfolioItems') || '[]');
    const userItems = allItems.filter((item: PortfolioItem) => 
      item.visibility === Visibility.EXCLUSIVE && 
      item.assignedUsers?.includes(user.email)
    );
    setItems(userItems);
  }, [user.email]);

  const handleDownload = (item: PortfolioItem) => {
    // 触发图片下载
    const link = document.createElement('a');
    link.href = item.coverImage;
    link.download = `${item.title}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(lang === 'zh' ? '开始下载高清图片...' : 'Downloading high-resolution image...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold serif-font mb-2">{t.title}</h1>
              <p className="text-sm text-neutral-500">
                {t.welcome}, <span className="font-medium text-neutral-900">{user.name || user.email}</span>
              </p>
            </div>
            <button
              onClick={onLogout}
              className="px-6 py-3 bg-neutral-900 text-white hover:bg-black transition-all text-xs tracking-widest uppercase font-bold rounded"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{t.myItems}</h2>
          <p className="text-sm text-neutral-500">
            {lang === 'zh' ? `共 ${items.length} 个专属作品` : `${items.length} exclusive items`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-16 text-center">
            <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <p className="text-neutral-400">{t.noItems}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative aspect-[4/5] bg-neutral-100">
                  <WatermarkedImage
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full"
                    isSemiPublic={item.visibility === Visibility.SEMI_PUBLIC}
                    blurPercentage={item.blurPercentage}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                      Exclusive
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-neutral-500">{item.category}</span>
                    <span className="text-lg font-bold text-purple-600">¥{((item.copyrightFee||0) + (item.usageFee||item.basePrice||0)).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs uppercase tracking-widest font-bold rounded transition-all"
                    >
                      {t.viewDetail}
                    </button>
                    <button
                      onClick={() => handleDownload(item)}
                      className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs uppercase tracking-widest font-bold rounded transition-all"
                    >
                      {t.download}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 overflow-y-auto">
          <div className="relative bg-white w-full max-w-5xl rounded-lg shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <div className="w-full md:w-1/2 bg-neutral-100">
              <WatermarkedImage
                src={selectedItem.coverImage}
                alt={selectedItem.title}
                className="w-full h-full"
                isSemiPublic={selectedItem.visibility === Visibility.SEMI_PUBLIC}
                blurPercentage={selectedItem.blurPercentage}
              />
            </div>

            <div className="w-full md:w-1/2 p-8 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                    {selectedItem.category}
                  </span>
                  <h2 className="text-3xl font-bold serif-font mb-4">{selectedItem.title}</h2>
                  {(
                    selectedItem.designInspiration ||
                    selectedItem.designHighlights ||
                    selectedItem.applicableScenarios ||
                    selectedItem.sizeRange ||
                    selectedItem.fabricSuggestions
                  ) ? (
                    <div className="space-y-3 text-neutral-600 leading-relaxed">
                      {selectedItem.designInspiration && (
                        <div>
                          <h4 className="font-semibold">{lang === 'zh' ? '设计灵感' : 'Design Inspiration'}</h4>
                          <p>{selectedItem.designInspiration}</p>
                        </div>
                      )}
                      {selectedItem.designHighlights && (
                        <div>
                          <h4 className="font-semibold">{lang === 'zh' ? '设计亮点' : 'Highlights'}</h4>
                          <p>{selectedItem.designHighlights}</p>
                        </div>
                      )}
                      {selectedItem.applicableScenarios && (
                        <div>
                          <h4 className="font-semibold">{lang === 'zh' ? '适用场景' : 'Applicable Scenarios'}</h4>
                          <p>{selectedItem.applicableScenarios}</p>
                        </div>
                      )}
                      {selectedItem.sizeRange && (
                        <div>
                          <h4 className="font-semibold">{lang === 'zh' ? '尺码范围' : 'Size Range'}</h4>
                          <p>{selectedItem.sizeRange}</p>
                        </div>
                      )}
                      {selectedItem.fabricSuggestions && (
                        <div>
                          <h4 className="font-semibold">{lang === 'zh' ? '面料建议' : 'Fabric Suggestions'}</h4>
                          <p>{selectedItem.fabricSuggestions}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-neutral-600 leading-relaxed">{selectedItem.description}</p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-neutral-500 uppercase tracking-widest">{t.price}</span>
                    <span className="text-3xl font-bold text-purple-600">¥{(((selectedItem.copyrightFee||0) + (selectedItem.usageFee||selectedItem.basePrice||0))).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedItem)}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white text-xs uppercase tracking-widest font-bold rounded transition-all flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    <span>{t.download}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
