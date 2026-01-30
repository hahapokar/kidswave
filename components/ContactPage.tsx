import React from 'react';

interface ContactPageProps {
  onClose: () => void;
  lang: 'zh' | 'en';
}

const ContactPage: React.FC<ContactPageProps> = ({ onClose, lang }) => {
  const content = {
    zh: {
      title: '联系我们',
      subtitle: '期待与您合作',
      phone: '手机',
      email: '邮箱',
      wechat: '微信',
      social: 'WhatsApp',
      close: '关闭'
    },
    en: {
      title: 'Contact Us',
      subtitle: 'Looking forward to working with you',
      phone: 'Phone',
      email: 'Email',
      wechat: 'WeChat',
      social: 'WhatsApp',
      close: 'Close'
    }
  };

  const t = content[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-2xl p-12">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold serif-font">{t.title}</h2>
            <p className="text-sm text-neutral-400 uppercase tracking-widest">{t.subtitle}</p>
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-center space-x-4 mb-2">
                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">{t.phone}</span>
              </div>
              <p className="text-lg font-medium text-neutral-800 ml-9">+86 138 0000 0000</p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-center space-x-4 mb-2">
                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">{t.email}</span>
              </div>
              <p className="text-lg font-medium text-neutral-800 ml-9">design@kidswave.studio</p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-center space-x-4 mb-2">
                <svg className="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.691 2.188C7.82 2.073 6.94 2 6.06 2c-2.155 0-4.023.672-5.06 1.707v.001C0 4.74 0 5.84 0 7.075c0 1.237 0 2.336.998 3.37.583.602 1.373 1.041 2.304 1.293-.003.065-.006.13-.006.195 0 1.235 0 2.336 1 3.37.582.602 1.373 1.041 2.304 1.293-.002.065-.005.13-.005.195 0 1.235 0 2.336 1 3.37.582.602 1.372 1.041 2.303 1.293-.002.065-.005.13-.005.195 0 1.235 0 2.336.998 3.37C11.977 27.328 13.845 28 16 28s4.023-.672 5.06-1.707c1-1.034 1-2.135 1-3.37 0-.065-.003-.13-.005-.195.93-.252 1.721-.691 2.303-1.293.998-1.034.998-2.135.998-3.37 0-.065-.003-.13-.005-.195.93-.252 1.721-.691 2.303-1.293.998-1.034.998-2.135.998-3.37 0-1.235 0-2.336-.998-3.37C26.623 10.672 24.755 10 22.6 10c-.88 0-1.76.073-2.63.188.003-.065.006-.13.006-.195 0-1.235 0-2.336-.998-3.37C17.915 5.672 16.045 5 13.89 5c-.88 0-1.76.073-2.63.188.003-.065.006-.13.006-.195 0-1.235 0-2.336-.998-3.37C9.2 0.672 7.33 0 5.175 0c-.88 0-1.76.073-2.63.188z"/>
                </svg>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">{t.wechat}</span>
              </div>
              <p className="text-lg font-medium text-neutral-800 ml-9">CY_hi2000</p>
              <div className="ml-9 mt-3">
                <div className="w-32 h-32 bg-neutral-100 border-2 border-dashed border-neutral-300 rounded flex items-center justify-center text-xs text-neutral-400">
                  {lang === 'zh' ? '微信二维码' : 'WeChat QR'}
                </div>
                <p className="text-xs text-neutral-400 mt-2">{lang === 'zh' ? '扫码添加微信' : 'Scan to add WeChat'}</p>
              </div>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-center space-x-4 mb-2">
                <svg className="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                </svg>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">{lang === 'zh' ? '小红书' : 'Xiaohongshu'}</span>
              </div>
              <p className="text-lg font-medium text-neutral-800 ml-9">94117357179</p>
            </div>

            <div className="pt-2">
              <div className="flex items-center space-x-4 mb-4">
                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                </svg>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">{t.social}</span>
              </div>
              <div className="flex space-x-4 ml-9">
                <a href="#" className="w-10 h-10 flex items-center justify-center bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-full transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-full transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                    <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-full transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-neutral-900 text-white hover:bg-black transition-all text-xs tracking-widest uppercase font-bold"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
