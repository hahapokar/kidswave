import React, { useState, useEffect } from 'react';
import WatermarkedImage from './WatermarkedImage'; 
import { Category, Visibility, AgeGroup, PortfolioItem } from '../types';
import { supabase } from '../supabaseClient';

interface AdminPanelProps {
  lang: 'zh' | 'en';
}

const AdminPanel: React.FC<AdminPanelProps> = ({ lang }) => {
  // --- 1. 状态管理 ---
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<any>({
    id: 'contact_info', phone: '', email: '', wechat: '', wechatQR: '', xiaohongshu: ''
  });
  
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'designers' | 'settings'>('list');
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editingDesigner, setEditingDesigner] = useState<any>(null);

  // 表单草稿状态
  const [portfolioForm, setPortfolioForm] = useState({
    title: '', category: Category.OUTERWEAR, ageGroup: AgeGroup.KIDS, visibility: Visibility.PUBLIC,
    copyrightFee: 0, usageFee: 0, description: '', designInspiration: '',
    blurLevel: 0, password: '', imageFile: null as File | null, imagePreview: ''
  });

  const [designerForm, setDesignerForm] = useState({ name: '', bio: '', imageFile: null as File | null, imagePreview: '' });

  // --- 2. 云端数据抓取 (Fetch) ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, dRes, sRes] = await Promise.all([
        supabase.from('portfolio_items').select('*').order('id', { ascending: false }),
        supabase.from('designers').select('*').order('id', { ascending: true }),
        supabase.from('settings').select('*').eq('id', 'contact_info').single()
      ]);

      if (pRes.data) setItems(pRes.data);
      if (dRes.data) setDesigners(dRes.data);
      if (sRes.data) setContactInfo(sRes.data);
    } catch (err) {
      console.error("数据加载失败", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 3. 通用文件上传助手 ---
  const uploadFile = async (file: File, folder: string) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // --- 4. 保存：作品 (Portfolio) ---
  const handlePortfolioSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = portfolioForm.imagePreview;
      if (portfolioForm.imageFile) {
        imageUrl = await uploadFile(portfolioForm.imageFile, 'portfolio');
      }

      const payload = {
        title: portfolioForm.title,
        coverImage: imageUrl,
        category: portfolioForm.category,
        visibility: portfolioForm.visibility,
        copyrightFee: portfolioForm.copyrightFee,
        usageFee: portfolioForm.usageFee,
        basePrice: portfolioForm.copyrightFee + portfolioForm.usageFee,
        description: portfolioForm.description,
        designInspiration: portfolioForm.designInspiration,
        blurPercentage: portfolioForm.visibility === Visibility.SEMI_PUBLIC ? portfolioForm.blurLevel : 0,
        password: portfolioForm.visibility === Visibility.SEMI_PUBLIC ? portfolioForm.password : null,
      };

      const { error } = await supabase
        .from('portfolio_items')
        .upsert(editingItem ? { ...payload, id: editingItem.id } : payload);

      if (error) throw error;
      alert("作品已同步至云端");
      resetPortfolioForm();
      fetchData();
      setActiveTab('list');
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  // --- 5. 保存：设计师 (Designer) ---
  const handleDesignerSave = async () => {
    setLoading(true);
    try {
      let imageUrl = designerForm.imagePreview;
      if (designerForm.imageFile) {
        imageUrl = await uploadFile(designerForm.imageFile, 'designers');
      }

      const { error } = await supabase
        .from('designers')
        .upsert(editingDesigner ? { id: editingDesigner.id, name: designerForm.name, bio: designerForm.bio, image: imageUrl } 
                                : { name: designerForm.name, bio: designerForm.bio, image: imageUrl });

      if (error) throw error;
      alert("设计师信息已更新");
      setDesignerForm({ name: '', bio: '', imageFile: null, imagePreview: '' });
      setEditingDesigner(null);
      fetchData();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  // --- 6. 保存：联系方式 (Settings) ---
  const handleSettingsSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('settings').upsert(contactInfo);
      if (error) throw error;
      alert("系统设置已保存");
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  // --- 辅助函数 ---
  const resetPortfolioForm = () => {
    setPortfolioForm({
      title: '', category: Category.OUTERWEAR, ageGroup: AgeGroup.KIDS, visibility: Visibility.PUBLIC,
      copyrightFee: 0, usageFee: 0, description: '', designInspiration: '',
      blurLevel: 0, password: '', imageFile: null, imagePreview: ''
    });
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          {['list', 'add', 'designers', 'settings'].map((tab: any) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
            >
              {tab === 'list' ? '作品列表' : tab === 'add' ? '发布作品' : tab === 'designers' ? '设计师管理' : '联系方式'}
            </button>
          ))}
        </div>

        {/* 1. 作品列表 */}
        {activeTab === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border group relative">
                <img src={item.coverImage} className="aspect-[3/4] w-full object-cover" alt="" />
                <div className="p-4">
                  <h3 className="font-bold truncate">{item.title}</h3>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => { setEditingItem(item); setPortfolioForm({...portfolioForm, title: item.title, imagePreview: item.coverImage}); setActiveTab('add'); }} className="text-xs bg-gray-100 px-3 py-1 rounded">编辑</button>
                    <button onClick={async () => { if(confirm("确定删除？")) { await supabase.from('portfolio_items').delete().eq('id', item.id); fetchData(); } }} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded">删除</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. 发布/编辑作品表单 */}
        {activeTab === 'add' && (
          <form onSubmit={handlePortfolioSave} className="bg-white p-8 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-neutral-50 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden">
                {portfolioForm.imagePreview ? <img src={portfolioForm.imagePreview} className="w-full h-full object-cover" /> : "点击选择图片"}
              </div>
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if(file) setPortfolioForm({...portfolioForm, imageFile: file, imagePreview: URL.createObjectURL(file)});
              }} />
            </div>
            <div className="space-y-6">
              <input type="text" placeholder="作品名称" value={portfolioForm.title} onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="版权费" value={portfolioForm.copyrightFee} onChange={e => setPortfolioForm({...portfolioForm, copyrightFee: Number(e.target.value)})} className="p-4 bg-neutral-50 rounded-xl" />
                <input type="number" placeholder="使用权费" value={portfolioForm.usageFee} onChange={e => setPortfolioForm({...portfolioForm, usageFee: Number(e.target.value)})} className="p-4 bg-neutral-50 rounded-xl" />
              </div>
              <select value={portfolioForm.visibility} onChange={e => setPortfolioForm({...portfolioForm, visibility: e.target.value as Visibility})} className="w-full p-4 bg-neutral-50 rounded-xl">
                {Object.values(Visibility).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <button type="submit" disabled={loading} className="w-full py-5 bg-black text-white rounded-xl font-bold">
                {loading ? "正在同步..." : "保存作品至云端"}
              </button>
            </div>
          </form>
        )}

        {/* 3. 设计师管理 */}
        {activeTab === 'designers' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
              <h2 className="text-xl font-bold mb-6">添加/编辑设计师</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="姓名" value={designerForm.name} onChange={e => setDesignerForm({...designerForm, name: e.target.value})} className="p-4 bg-neutral-50 rounded-xl" />
                <input type="file" onChange={e => {
                   const file = e.target.files?.[0];
                   if(file) setDesignerForm({...designerForm, imageFile: file, imagePreview: URL.createObjectURL(file)});
                }} />
                <textarea placeholder="简介" value={designerForm.bio} onChange={e => setDesignerForm({...designerForm, bio: e.target.value})} className="md:col-span-2 p-4 bg-neutral-50 rounded-xl h-32" />
                <button onClick={handleDesignerSave} className="md:col-span-2 py-4 bg-black text-white rounded-xl font-bold">保存设计师信息</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {designers.map(d => (
                <div key={d.id} className="bg-white p-4 rounded-xl border flex gap-4 items-center">
                  <img src={d.image} className="w-16 h-16 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-bold">{d.name}</p>
                    <button onClick={async () => { if(confirm("删除设计师？")) { await supabase.from('designers').delete().eq('id', d.id); fetchData(); } }} className="text-xs text-red-500">删除</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 系统设置 (联系方式) */}
        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-8">联系方式设置</h2>
            <div className="space-y-6">
              <div><label className="text-xs font-bold text-gray-400">微信号</label><input type="text" value={contactInfo.wechat} onChange={e => setContactInfo({...contactInfo, wechat: e.target.value})} className="w-full p-4 mt-1 bg-neutral-50 rounded-xl" /></div>
              <div><label className="text-xs font-bold text-gray-400">邮箱</label><input type="text" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full p-4 mt-1 bg-neutral-50 rounded-xl" /></div>
              <div><label className="text-xs font-bold text-gray-400">小红书号</label><input type="text" value={contactInfo.xiaohongshu} onChange={e => setContactInfo({...contactInfo, xiaohongshu: e.target.value})} className="w-full p-4 mt-1 bg-neutral-50 rounded-xl" /></div>
              <button onClick={handleSettingsSave} className="w-full py-5 bg-blue-600 text-white rounded-xl font-bold">保存全局联系信息</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;