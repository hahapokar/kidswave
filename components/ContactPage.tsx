import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface ContactPageProps {
  onClose: () => void;
  lang: 'zh' | 'en';
  initialMessage?: string; // 新增：接收来自作品详情页的自动填表内容
}

const ContactPage: React.FC<ContactPageProps> = ({ onClose, lang, initialMessage = '' }) => {
  const [contactData, setContactData] = useState<any>(null);
  
  // 初始化时，如果 initialMessage 有值，直接填入 content
  const [formData, setFormData] = useState({ 
    name: '', 
    contact: '', 
    content: initialMessage 
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. 抓取设置，包含中英文逻辑
  useEffect(() => {
    const getSettings = async () => {
      const { data } = await supabase.from('settings').select('*').eq('id', 'contact_info').single();
      if (data) setContactData(data);
    };
    getSettings();
  }, []);

  // 2. 监听 initialMessage 的变化（当用户关闭弹窗又点击另一个作品时生效）
  useEffect(() => {
    if (initialMessage) {
      setFormData(prev => ({ ...prev, content: initialMessage }));
    }
  }, [initialMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('messages')
      .insert([{ 
        name: formData.name, 
        contact: formData.contact, 
        content: formData.content 
      }]);

    if (!error) {
      setIsSuccess(true);
      setFormData({ name: '', contact: '', content: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } else {
      alert(lang === 'zh' ? '发送失败，请检查网络' : 'Failed to send, please check connection');
    }
    setIsSubmitting(false);
  };

  // 根据当前语言自动选择展示的字段
  const displayWechat = lang === 'zh' ? contactData?.wechat : (contactData?.wechat_en || contactData?.wechat);
  const displayEmail = lang === 'zh' ? contactData?.email : (contactData?.email_en || contactData?.email);
  const displayPhone = lang === 'zh' ? contactData?.phone : (contactData?.phone_en || contactData?.phone);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 md:p-6 overflow-y-auto">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* 左侧：你的联系信息 (自动适配中英文字段) */}
        <div className="md:w-5/12 bg-neutral-900 text-white p-10 md:p-14 space-y-12">
          <div>
            <h2 className="text-3xl font-bold serif-font mb-4">{lang === 'zh' ? '联系我们' : 'Contact Us'}</h2>
            <p className="text-xs text-neutral-400 leading-relaxed uppercase tracking-widest font-light">
              {lang === 'zh' ? '期待与您的合作，共同探索儿童设计的无限可能。' : 'Looking forward to collaborating with you.'}
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-lg">💬</div>
              <div>
                <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest">WeChat</p>
                <p className="font-mono text-sm tracking-tight">{displayWechat || '---'}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-lg">✉️</div>
              <div>
                <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest">Email</p>
                <p className="font-mono text-sm tracking-tight">{displayEmail || '---'}</p>
              </div>
            </div>
            {displayPhone && (
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-lg">📞</div>
                <div>
                  <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest">Phone</p>
                  <p className="font-mono text-sm tracking-tight">{displayPhone}</p>
                </div>
              </div>
            )}
          </div>

          {contactData?.wechatQR && (
            <div className="pt-8 border-t border-white/10">
              <img src={contactData.wechatQR} className="w-28 h-28 rounded-xl border-4 border-white/5 opacity-80 hover:opacity-100 transition-opacity" alt="QR" />
              <p className="text-[9px] mt-4 text-neutral-500 uppercase tracking-widest italic">Scan to connect</p>
            </div>
          )}
        </div>

        {/* 右侧：留言表单 */}
        <div className="md:w-7/12 p-10 md:p-16 relative bg-white">
          <button onClick={onClose} className="absolute top-8 right-8 text-neutral-300 hover:text-black transition-colors text-xl">✕</button>
          
          <h3 className="text-xl font-bold mb-10 tracking-tight text-black">{lang === 'zh' ? '在线留言' : 'Leave a Message'}</h3>
          
          {isSuccess ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in slide-in-from-top-4">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl">✓</div>
              <p className="font-bold text-black">{lang === 'zh' ? '留言已成功发送！' : 'Message Sent Successfully!'}</p>
              <p className="text-xs text-neutral-400">{lang === 'zh' ? '我会尽快通过您的联系方式给予回复。' : 'I will get back to you soon via your contact info.'}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{lang === 'zh' ? '您的称呼' : 'Your Name'}</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-neutral-50 rounded-xl outline-none focus:ring-1 focus:ring-black transition-all text-sm" 
                    placeholder={lang === 'zh' ? '王先生' : 'e.g. Patrick'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{lang === 'zh' ? '联系方式' : 'Contact Info'}</label>
                  <input 
                    type="text" 
                    required
                    value={formData.contact}
                    onChange={e => setFormData({...formData, contact: e.target.value})}
                    className="w-full p-4 bg-neutral-50 rounded-xl outline-none focus:ring-1 focus:ring-black transition-all text-sm" 
                    placeholder={lang === 'zh' ? '微信号或邮箱' : 'WeChat or Email'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{lang === 'zh' ? '需求详情' : 'Message'}</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full p-4 bg-neutral-50 rounded-xl outline-none focus:ring-1 focus:ring-black transition-all resize-none text-sm leading-relaxed" 
                  placeholder={lang === 'zh' ? '请描述您的合作意向...' : 'Tell me about your project...'}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-black text-white rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-neutral-800 transition-all shadow-xl disabled:bg-neutral-200"
              >
                {isSubmitting ? (lang === 'zh' ? '正在发送...' : 'Sending...') : (lang === 'zh' ? '发送留言' : 'Send Message')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;