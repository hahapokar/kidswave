import React, { useState, useEffect } from 'react';
import WatermarkedImage from './WatermarkedImage'; 
import { Visibility, AgeGroup, PortfolioItem } from '../types';
import { supabase } from '../supabaseClient';

enum Category {
  APPAREL = "服装类",
  PATTERN = "花稿类",
  TEXTILE = "纺织品类",
  MORE = "更多类别"
}

interface AdminPanelProps { lang: 'zh' | 'en'; }

const ADMIN_TRANSLATIONS = {
  tabList: { zh: '作品一览', en: 'Portfolio' },
  tabAdd: { zh: '发布作品', en: 'Add Work' },
  tabDesigners: { zh: '设计师管理', en: 'Designers' },
  tabSettings: { zh: '联系设置', en: 'Settings' },
  tabMessages: { zh: '客户留言', en: 'Messages' },
  editBtn: { zh: '编辑', en: 'Edit' },
  deleteBtn: { zh: '删除', en: 'Delete' },
  deleteConfirm: { zh: '确定删除此记录吗？', en: 'Delete this record?' },
  imagePreview: { zh: '1. 展示预览', en: '1. Image Preview' },
  originalImage: { zh: '2. 高清原图 (解锁可见)', en: '2. Original (Unlocked Only)' },
  workTitle: { zh: '作品标题', en: 'Work Title' },
  priceSettings: { zh: '一口价 (￥)', en: 'Price (￥)' },
  blurLevel: { zh: '水印强度 %', en: 'Watermark %' },
  password: { zh: '解锁密码', en: 'Password' },
  designInspiration: { zh: '设计灵感/说明', en: 'Inspiration' },
  savingBtn: { zh: '同步中...', en: 'Syncing...' },
  syncSuccess: { zh: '操作成功！', en: 'Success!' },
  saveFailed: { zh: '保存失败: ', en: 'Save failed: ' },
};

const AdminPanel: React.FC<AdminPanelProps> = ({ lang }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<any>({ id: 'contact_info', wechat: '', email: '', xiaohongshu: '', phone: '', wechatQR: '', wechat_en: '', email_en: '', xiaohongshu_en: '', phone_en: '' });
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'designers' | 'settings' | 'messages'>('list');
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editingDesigner, setEditingDesigner] = useState<any>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [designerImageZoom, setDesignerImageZoom] = useState(1);

  const [portfolioForm, setPortfolioForm] = useState({
    title: '', title_en: '', category: Category.APPAREL, ageGroup: AgeGroup.KIDS, visibility: Visibility.PUBLIC, fixedPrice: 0, description: '', description_en: '', designInspiration: '', designInspiration_en: '', sizeRange: '', sizeRange_en: '', fabricSuggestions: '', fabricSuggestions_en: '', blurLevel: 0, password: '', imageFile: null as File | null, imagePreview: '', originalImageFile: null as File | null, originalImagePreview: ''
  });

  const [designerForm, setDesignerForm] = useState({ name: '', name_en: '', bio: '', bio_en: '', imageFile: null as File | null, imagePreview: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, dRes, sRes, mRes] = await Promise.all([
        supabase.from('portfolio_items').select('*').order('id', { ascending: false }),
        supabase.from('designers').select('*').order('id', { ascending: true }),
        supabase.from('settings').select('*').eq('id', 'contact_info').single(),
        supabase.from('messages').select('*').order('created_at', { ascending: false })
      ]);
      if (pRes.data) setItems(pRes.data);
      if (dRes.data) setDesigners(dRes.data);
      if (sRes.data) setContactInfo(sRes.data);
      if (mRes.data) setMessages(mRes.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (editingItem) {
      setPortfolioForm({
        title: editingItem.title || '', title_en: (editingItem as any).title_en || '', category: editingItem.category as Category || Category.APPAREL, ageGroup: editingItem.ageGroup as AgeGroup || AgeGroup.KIDS, visibility: editingItem.visibility as Visibility || Visibility.PUBLIC, fixedPrice: editingItem.basePrice || 0, description: editingItem.description || '', description_en: (editingItem as any).description_en || '', designInspiration: editingItem.designInspiration || '', designInspiration_en: (editingItem as any).designInspiration_en || '', sizeRange: editingItem.sizeRange || '', sizeRange_en: (editingItem as any).sizeRange_en || '', fabricSuggestions: editingItem.fabricSuggestions || '', fabricSuggestions_en: (editingItem as any).fabricSuggestions_en || '', blurLevel: editingItem.blurPercentage || 0, password: editingItem.password || '', imageFile: null, imagePreview: editingItem.coverImage || '', originalImageFile: null, originalImagePreview: editingItem.originalImage || ''
      });
    }
  }, [editingItem]);

  const uploadFile = async (file: File, folder: string) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(filePath, file);
    if (error) throw error;
    return supabase.storage.from('portfolio-images').getPublicUrl(filePath).data.publicUrl;
  };

  const handlePortfolioSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = portfolioForm.imagePreview;
      let originalUrl = portfolioForm.originalImagePreview;
      if (portfolioForm.imageFile) imageUrl = await uploadFile(portfolioForm.imageFile, 'portfolio');
      if (portfolioForm.originalImageFile) originalUrl = await uploadFile(portfolioForm.originalImageFile, 'portfolio-highres');
      
      const payload = { title: portfolioForm.title, title_en: portfolioForm.title_en, coverImage: imageUrl, category: portfolioForm.category, ageGroup: portfolioForm.ageGroup, visibility: portfolioForm.visibility, basePrice: portfolioForm.fixedPrice, description: portfolioForm.description, description_en: portfolioForm.description_en, designInspiration: portfolioForm.designInspiration, designInspiration_en: portfolioForm.designInspiration_en, sizeRange: portfolioForm.sizeRange, sizeRange_en: portfolioForm.sizeRange_en, fabricSuggestions: portfolioForm.fabricSuggestions, fabricSuggestions_en: portfolioForm.fabricSuggestions_en, blurPercentage: portfolioForm.blurLevel, password: portfolioForm.password || null, originalImage: originalUrl || imageUrl, copyrightDisclaimer: "版权归设计师所有" };

      const { error } = await supabase.from('portfolio_items').upsert(editingItem ? { ...payload, id: editingItem.id } : payload);
      if (error) throw error;
      alert(ADMIN_TRANSLATIONS.syncSuccess[lang]);
      fetchData(); setActiveTab('list');
    } catch (err: any) { alert(ADMIN_TRANSLATIONS.saveFailed[lang] + err.message); } finally { setLoading(false); }
  };

  const handleDesignerSave = async () => {
    setLoading(true);
    try {
      let imageUrl = designerForm.imagePreview;
      if (designerForm.imageFile) imageUrl = await uploadFile(designerForm.imageFile, 'designers');
      const payload = { name: designerForm.name, name_en: designerForm.name_en, bio: designerForm.bio, bio_en: designerForm.bio_en, image: imageUrl };
      const { error } = await supabase.from('designers').upsert(editingDesigner ? { ...payload, id: editingDesigner.id } : payload);
      if (error) throw error;
      alert(ADMIN_TRANSLATIONS.syncSuccess[lang]);
      fetchData(); setEditingDesigner(null);
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  const handleSettingsSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('settings').upsert({ ...contactInfo, id: 'contact_info' });
      if (error) throw error;
      alert(ADMIN_TRANSLATIONS.syncSuccess[lang]);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex bg-white rounded-xl shadow-sm mb-8 overflow-hidden border">
          {['list', 'add', 'designers', 'settings', 'messages'].map((tab: any) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-xs font-bold uppercase transition-colors ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-50'}`}>
              {ADMIN_TRANSLATIONS[`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}` as keyof typeof ADMIN_TRANSLATIONS]?.[lang] || tab}
            </button>
          ))}
        </div>

        {activeTab === 'list' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border group">
                <WatermarkedImage src={item.coverImage} className="aspect-[3/4] w-full object-cover" />
                <div className="p-4 flex justify-between items-center"><span className="text-base font-bold truncate">{item.title}</span><div className="flex gap-2"><button onClick={() => { setEditingItem(item); setActiveTab('add'); }} className="text-sm font-semibold text-blue-600">编辑</button><button onClick={async () => { if(confirm("删除？")) { await supabase.from('portfolio_items').delete().eq('id', item.id); fetchData(); } }} className="text-sm font-semibold text-red-600">删除</button></div></div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'add' && (
          <form onSubmit={handlePortfolioSave} className="bg-white p-8 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <label className="text-sm font-bold text-neutral-700 uppercase">1. 图片缩放预览</label>
              <div className="aspect-[3/4] bg-neutral-100 rounded-2xl overflow-hidden relative border-2 border-dashed flex items-center justify-center">
                {portfolioForm.imagePreview ? <img src={portfolioForm.imagePreview} style={{ transform: `scale(${imageZoom})` }} className="w-full h-full object-cover" /> : <span className="text-neutral-700">选择图片</span>}
              </div>
              <input type="range" min="1" max="2" step="0.01" value={imageZoom} onChange={e => setImageZoom(parseFloat(e.target.value))} className="w-full" />
              <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if(file) setPortfolioForm({...portfolioForm, imageFile: file, imagePreview: URL.createObjectURL(file)}); }} className="w-full text-base" />
              <div className="pt-4 border-t"><label className="text-sm font-bold text-neutral-700 uppercase">2. 原图 (仅解锁可见)</label><input type="file" onChange={e => { const file = e.target.files?.[0]; if(file) setPortfolioForm({...portfolioForm, originalImageFile: file, originalImagePreview: URL.createObjectURL(file)}); }} className="w-full text-base" /></div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="中文标题" value={portfolioForm.title} onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})} className="p-4 bg-neutral-50 rounded-xl" required />
                <input type="text" placeholder="English Title" value={portfolioForm.title_en} onChange={e => setPortfolioForm({...portfolioForm, title_en: e.target.value})} className="p-4 bg-neutral-50 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4"><select value={portfolioForm.category} onChange={e => setPortfolioForm({...portfolioForm, category: e.target.value as Category})} className="p-4 bg-neutral-50 rounded-xl">{Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}</select><input type="number" placeholder="一口价" value={portfolioForm.fixedPrice} onChange={e => setPortfolioForm({...portfolioForm, fixedPrice: Number(e.target.value)})} className="p-4 bg-neutral-50 rounded-xl" /></div>
              <select value={portfolioForm.visibility} onChange={e => setPortfolioForm({...portfolioForm, visibility: e.target.value as Visibility})} className="w-full p-4 bg-neutral-50 rounded-xl font-bold">{Object.values(Visibility).map(v => <option key={v} value={v}>{v}</option>)}</select>
              {portfolioForm.visibility === Visibility.SEMI_PUBLIC && (<div className="flex gap-2"><input type="number" placeholder="水印强度" value={portfolioForm.blurLevel} onChange={e => setPortfolioForm({...portfolioForm, blurLevel: Number(e.target.value)})} className="w-1/3 p-4 bg-neutral-50 rounded-xl" /><input type="password" placeholder="解锁密码" value={portfolioForm.password} onChange={e => setPortfolioForm({...portfolioForm, password: e.target.value})} className="flex-1 p-4 bg-neutral-50 rounded-xl" /></div>)}
              <textarea placeholder="设计灵感 (中文)" value={portfolioForm.designInspiration} onChange={e => setPortfolioForm({...portfolioForm, designInspiration: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl h-24" />
              <textarea placeholder="Inspiration (English)" value={portfolioForm.designInspiration_en} onChange={e => setPortfolioForm({...portfolioForm, designInspiration_en: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl h-24" />
              <button type="submit" disabled={loading} className="w-full py-5 bg-black text-white rounded-xl font-bold">{loading ? "同步中..." : "保存作品"}</button>
            </div>
          </form>
        )}

        {activeTab === 'designers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border">
              <h2 className="font-bold mb-6">编辑设计师</h2>
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border flex items-center justify-center text-neutral-700 font-semibold">{designerForm.imagePreview ? <img src={designerForm.imagePreview} style={{ transform: `scale(${designerImageZoom})` }} className="w-full h-full object-cover" /> : "头像"}</div>
                <input type="range" min="1" max="2" step="0.01" value={designerImageZoom} onChange={e => setDesignerImageZoom(parseFloat(e.target.value))} className="w-full" />
                <input type="file" onChange={e => { const file = e.target.files?.[0]; if(file) setDesignerForm({...designerForm, imageFile: file, imagePreview: URL.createObjectURL(file)}); }} className="text-base" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="中文名" value={designerForm.name} onChange={e => setDesignerForm({...designerForm, name: e.target.value})} className="p-3 bg-neutral-50 rounded-lg" />
                  <input type="text" placeholder="English Name" value={designerForm.name_en} onChange={e => setDesignerForm({...designerForm, name_en: e.target.value})} className="p-3 bg-neutral-50 rounded-lg" />
                </div>
                <textarea placeholder="中文简介" value={designerForm.bio} onChange={e => setDesignerForm({...designerForm, bio: e.target.value})} className="w-full p-3 bg-neutral-50 rounded-lg h-24 text-sm" />
                <textarea placeholder="English Bio" value={designerForm.bio_en} onChange={e => setDesignerForm({...designerForm, bio_en: e.target.value})} className="w-full p-3 bg-neutral-50 rounded-lg h-24 text-sm" />
                <button onClick={handleDesignerSave} className="w-full py-4 bg-black text-white rounded-xl font-bold">更新设计师</button>
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {designers.map(d => (
                <div key={d.id} className="bg-white p-4 rounded-xl border flex items-center gap-4">
                  <img src={d.image} className="w-16 h-16 rounded-full object-cover" />
                  <div><h4 className="font-bold">{d.name}</h4><button onClick={() => { setEditingDesigner(d); setDesignerForm({ name: d.name || '', name_en: d.name_en || '', bio: d.bio || '', bio_en: d.bio_en || '', imageFile: null, imagePreview: d.image || '' }); }} className="text-xs text-blue-600">修改</button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-10 rounded-2xl shadow-lg border max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-10 text-center">系统设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <input type="text" placeholder="微信号" value={contactInfo.wechat} onChange={e => setContactInfo({...contactInfo, wechat: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl" />
                <input type="email" placeholder="业务邮箱" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl" />
                <input type="text" placeholder="WeChat (English)" value={contactInfo.wechat_en} onChange={e => setContactInfo({...contactInfo, wechat_en: e.target.value})} className="w-full p-4 bg-neutral-100 rounded-xl" />
              </div>
              <div className="flex flex-col items-center p-6 bg-neutral-50 rounded-2xl border-2 border-dashed">
                <div className="w-48 h-48 bg-white mb-4 flex items-center justify-center border">
                  {contactInfo.wechatQR ? <img src={contactInfo.wechatQR} className="w-full h-full object-contain" /> : <span className="text-sm text-neutral-700 font-semibold">暂无二维码</span>}
                </div>
                <input type="file" onChange={async (e) => { const file = e.target.files?.[0]; if(file) { setLoading(true); const url = await uploadFile(file, 'settings'); setContactInfo({...contactInfo, wechatQR: url}); setLoading(false); } }} className="text-base" />
              </div>
            </div>
            <button onClick={handleSettingsSave} disabled={loading} className="w-full mt-10 py-5 bg-black text-white rounded-xl font-bold">保存设置</button>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">客户留言</h2>
            {messages.length === 0 ? <p className="text-center py-20 bg-white border border-dashed text-neutral-400">暂无留言</p> : (
              <div className="grid gap-4">
                {messages.map(msg => (
                  <div key={msg.id} className="bg-white p-6 rounded-2xl border group transition-all hover:border-black">
                    <div className="flex justify-between mb-4">
                      <div><h4 className="font-bold text-lg">{msg.name}</h4><p className="text-xs text-neutral-700 uppercase tracking-widest">{new Date(msg.created_at).toLocaleString()}</p></div>
                      <button onClick={async () => { if(confirm("删除？")) { await supabase.from('messages').delete().eq('id', msg.id); fetchData(); } }} className="text-red-400 opacity-0 group-hover:opacity-100">删除</button>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl mb-4 text-base font-mono text-blue-600">联系方式: {msg.contact}</div>
                    <div className="text-neutral-800 text-base whitespace-pre-wrap font-normal">{msg.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;