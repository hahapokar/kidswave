import React, { useState } from 'react';

interface UserAuthProps {
  onClose: () => void;
  lang: 'zh' | 'en';
}

const UserAuth: React.FC<UserAuthProps> = ({ onClose, lang }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    wechat: '',
    password: ''
  });

  const content = {
    zh: {
      login: '用户登录',
      register: '用户注册',
      phone: '联系电话',
      email: '邮箱地址',
      wechat: '微信号',
      password: '密码',
      loginBtn: '登录',
      registerBtn: '注册',
      switchToRegister: '还没有账号？立即注册',
      switchToLogin: '已有账号？立即登录',
      close: '关闭'
    },
    en: {
      login: 'User Login',
      register: 'User Registration',
      phone: 'Phone Number',
      email: 'Email Address',
      wechat: 'WeChat ID',
      password: 'Password',
      loginBtn: 'Login',
      registerBtn: 'Register',
      switchToRegister: "Don't have an account? Register now",
      switchToLogin: 'Already have an account? Login now',
      close: 'Close'
    }
  };

  const t = content[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      alert(lang === 'zh' ? '登录成功！' : 'Login successful!');
    } else {
      alert(lang === 'zh' ? '注册成功！' : 'Registration successful!');
      setMode('login');
    }
    console.log('User auth data:', { mode, formData });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
      <div className="bg-white p-10 rounded-lg shadow-2xl max-w-md w-full">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold serif-font">{mode === 'login' ? t.login : t.register}</h2>
            <p className="text-xs text-neutral-400 uppercase tracking-widest">
              {mode === 'login' ? 'Member Access' : 'Create Account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    {t.phone}
                  </label>
                  <input 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+86 138 0000 0000"
                    className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    {t.email}
                  </label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    {t.wechat}
                  </label>
                  <input 
                    type="text"
                    value={formData.wechat}
                    onChange={(e) => setFormData({...formData, wechat: e.target.value})}
                    placeholder="WeChat_ID"
                    className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
                    required
                  />
                </div>
              </>
            )}

            {mode === 'login' && (
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
                  {t.email} / {t.phone}
                </label>
                <input 
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder={lang === 'zh' ? '邮箱或手机号' : 'Email or Phone'}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
                {t.password}
              </label>
              <input 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-neutral-900 text-white hover:bg-black transition-all text-xs tracking-widest uppercase font-bold"
            >
              {mode === 'login' ? t.loginBtn : t.registerBtn}
            </button>

            <button 
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="w-full text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              {mode === 'login' ? t.switchToRegister : t.switchToLogin}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
