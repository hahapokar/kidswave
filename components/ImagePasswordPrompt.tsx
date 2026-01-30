import React, { useState } from 'react';

interface ImagePasswordPromptProps {
  itemTitle: string;
  correctPassword: string;
  lang: 'zh' | 'en';
  onSuccess: () => void;
  onCancel: () => void;
}

const ImagePasswordPrompt: React.FC<ImagePasswordPromptProps> = ({
  itemTitle,
  correctPassword,
  lang,
  onSuccess,
  onCancel
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const content = {
    zh: {
      title: '输入访问密码',
      subtitle: '此图片为半公开作品，需要密码才能查看高清版本',
      itemName: '作品名称',
      passwordLabel: '访问密码',
      placeholder: '请输入密码',
      unlock: '解锁查看',
      cancel: '取消',
      errorMsg: '密码错误，请重试',
      hint: '提示：如果您已支付费用，密码会通过微信发送给您'
    },
    en: {
      title: 'Enter Access Password',
      subtitle: 'This is a semi-public item. Password required to view high-resolution version.',
      itemName: 'Item Name',
      passwordLabel: 'Access Password',
      placeholder: 'Enter password',
      unlock: 'Unlock',
      cancel: 'Cancel',
      errorMsg: 'Incorrect password. Please try again.',
      hint: 'Hint: If you have paid, the password has been sent to you via email/WeChat'
    }
  };

  const t = content[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputTrimmed = password.trim();
    const correctTrimmed = (correctPassword || '').trim();
    console.log('Password check:', { input: inputTrimmed, correct: correctTrimmed, match: inputTrimmed === correctTrimmed });
    if (inputTrimmed === correctTrimmed) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-md p-6">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold serif-font mb-2">{t.title}</h3>
          <p className="text-sm text-neutral-500">{t.subtitle}</p>
        </div>

        <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">{t.itemName}</p>
          <p className="font-medium text-neutral-900">{itemTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {t.passwordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder={t.placeholder}
              className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors ${
                error 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-200 focus:border-amber-500'
              }`}
              autoFocus
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {t.errorMsg}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800 flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {t.hint}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 border-2 border-gray-300 hover:bg-gray-50 text-neutral-700 text-sm uppercase tracking-widest font-bold rounded-lg transition-all"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm uppercase tracking-widest font-bold rounded-lg transition-all shadow-lg"
            >
              {t.unlock}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImagePasswordPrompt;
