import React, { useState, useEffect } from 'react';
import WatermarkedImage from './WatermarkedImage'; 
import { Visibility, AgeGroup, PortfolioItem, Addon } from '../types';
import { supabase } from '../supabaseClient';

// 修改类别定义以匹配新需求
enum Category {
  APPAREL = "服装类",
  PATTERN = "花稿类",
  TEXTILE = "纺织品类",
  MORE = "更多类别"
}

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

  // 图片缩放状态
  const [imageZoom, setImageZoom] = useState<number>(1);
  const [designerImageZoom, setDesignerImageZoom] = useState<number>(1);

  // 作品表单
  const [portfolioForm, setPortfolioForm] = useState({
    title: '', category: Category.APPAREL, ageGroup: AgeGroup.KIDS, visibility: Visibility.PUBLIC,
    fixedPrice: 0, description: '', designInspiration: '',
    sizeRange: '', fabricSuggestions: '',
    blurLevel: 0, password: '', imageFile: null as File | null, imagePreview: '',
    originalImageFile: null as File | null, originalImagePreview: ''
  });

  // 当编辑项目改变时，自动填充表单
  useEffect(() => {
    if (editingItem) {
      setPortfolioForm({
        title: editingItem.title || '',
        category: editingItem.category as Category || Category.APPAREL,
        ageGroup: editingItem.ageGroup as AgeGroup || AgeGroup.KIDS,
        visibility: editingItem.visibility as Visibility || Visibility.PUBLIC,
        fixedPrice: editingItem.basePrice || 0,
        description: editingItem.description || '',
        designInspiration: editingItem.designInspiration || '',
        sizeRange: editingItem.sizeRange || '',
        fabricSuggestions: editingItem.fabricSuggestions || '',
        blurLevel: editingItem.blurPercentage || 0,
        password: editingItem.password || '',
        imageFile: null,
        imagePreview: editingItem.coverImage || '',
        originalImageFile: null,
        originalImagePreview: editingItem.originalImage || ''
      });
    }
  }, [editingItem]);

  // 设计师表单
  const [designerForm, setDesignerForm] = useState({ name: '', bio: '', imageFile: null as File | null, imagePreview: '' });

  // --- 2. 云端数据抓取 ---
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

  // --- 3. 上传助手 ---
  const uploadFile = async (file: File, folder: string) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // --- 4. 保存：作品 ---
  const handlePortfolioSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = portfolioForm.imagePreview;
      let originalUrl = portfolioForm.originalImagePreview;

      if (portfolioForm.imageFile) {
        imageUrl = await uploadFile(portfolioForm.imageFile, 'portfolio');
      }
      if (portfolioForm.originalImageFile) {
        originalUrl = await uploadFile(portfolioForm.originalImageFile, 'portfolio-highres');
      }

      const payload = {
        title: portfolioForm.title,
        coverImage: imageUrl,
        category: portfolioForm.category,
        ageGroup: portfolioForm.ageGroup,
        visibility: portfolioForm.visibility,
        basePrice: portfolioForm.fixedPrice, // 一口价
        description: portfolioForm.description,
        designInspiration: portfolioForm.designInspiration,
        sizeRange: portfolioForm.sizeRange,
        fabricSuggestions: portfolioForm.fabricSuggestions,
        blurPercentage: portfolioForm.visibility === Visibility.SEMI_PUBLIC ? portfolioForm.blurLevel : 0,
        password: portfolioForm.visibility === Visibility.SEMI_PUBLIC ? portfolioForm.password : null,
        originalImage: originalUrl, // 高清图存储
        copyrightDisclaimer: "版权归设计师所有"
      };

      const { error } = await supabase
        .from('portfolio_items')
        .upsert(editingItem ? { ...payload, id: editingItem.id } : payload);

      if (error) throw error;
      alert("作品已成功同步至云端");
      resetPortfolioForm();
      fetchData();
      setActiveTab('list');
    } catch (err: any) { alert("保存失败: " + err.message); } finally { setLoading(false); }
  };

  // --- 5. 保存：设计师 ---
  const handleDesignerSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = designerForm.imagePreview;
      if (designerForm.imageFile) {
        imageUrl = await uploadFile(designerForm.imageFile, 'designers');
      }

      const { error } = await supabase
        .from('designers')
        .upsert(editingDesigner ? 
          { id: editingDesigner.id, name: designerForm.name, bio: designerForm.bio, image: imageUrl } : 
          { name: designerForm.name, bio: designerForm.bio, image: imageUrl }
        );

      if (error) throw error;
      alert("设计师信息已同步");
      setDesignerForm({ name: '', bio: '', imageFile: null, imagePreview: '' });
      setEditingDesigner(null);
      fetchData();
    } catch (err: any) { alert("设计师保存失败: " + err.message); } finally { setLoading(false); }
  };

  // --- 辅助函数 ---
  const resetPortfolioForm = () => {
    setPortfolioForm({
      title: '', category: Category.APPAREL, ageGroup: AgeGroup.KIDS, visibility: Visibility.PUBLIC,
      fixedPrice: 0, description: '', designInspiration: '',
      sizeRange: '', fabricSuggestions: '',
      blurLevel: 0, password: '', imageFile: null, imagePreview: '',
      originalImageFile: null, originalImagePreview: ''
    });
    setEditingItem(null);
    setImageZoom(1);
  };
// --- 保存：联系方式 (Settings) ---
  const handleSettingsSave = async () => {
    setLoading(true);
    try {
      // 确保我们是针对 id 为 'contact_info' 的这一行进行更新
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          ...contactInfo, 
          id: 'contact_info' 
        });

      if (error) throw error;
      
      alert(lang === 'zh' ? "系统设置已成功同步至云端！" : "Settings synced to cloud!");
      fetchData(); // 重新拉取一次，确保数据同步
    } catch (err: any) { 
      alert("保存失败: " + err.message); 
    } finally { 
      setLoading(false); 
    }
  };
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tab 导航 */}
        <div className="flex bg-white rounded-xl shadow-sm mb-8 overflow-hidden border">
          {['list', 'add', 'designers', 'settings'].map((tab: any) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-50'}`}>
              {tab === 'list' ? '作品一览' : tab === 'add' ? '发布作品' : tab === 'designers' ? '设计师管理' : '联系设置'}
            </button>
          ))}
        </div>

        {/* 1. 作品列表 */}
        {activeTab === 'list' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border group">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <WatermarkedImage src={item.coverImage} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm font-bold truncate">{item.title}</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(item); /* 加载逻辑 */ setActiveTab('add'); }} className="p-1 hover:text-blue-600">编辑</button>
                    <button onClick={async () => { if(confirm("删除吗？")) { await supabase.from('portfolio_items').delete().eq('id', item.id); fetchData(); } }} className="p-1 hover:text-red-600">删除</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. 发布作品 */}
        {activeTab === 'add' && (
          <form onSubmit={handlePortfolioSave} className="bg-white p-8 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <label className="block text-xs font-bold text-gray-400 uppercase">1. 图片缩放预览</label>
              <div className="aspect-[3/4] bg-neutral-100 rounded-2xl overflow-hidden relative border-2 border-dashed flex items-center justify-center">
                {portfolioForm.imagePreview ? (
                  <img src={portfolioForm.imagePreview} style={{ transform: `scale(${imageZoom})` }} className="w-full h-full object-cover transition-transform" />
                ) : <span className="text-gray-400">请选择展示图</span>}
              </div>
              <input type="range" min="1" max="2" step="0.01" value={imageZoom} onChange={e => setImageZoom(parseFloat(e.target.value))} className="w-full" />
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if(file) setPortfolioForm({...portfolioForm, imageFile: file, imagePreview: URL.createObjectURL(file)});
              }} className="w-full text-xs" />
              
              <div className="pt-4 border-t">
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">2. 原图/高清图 (仅限半公开解锁可见)</label>
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if(file) setPortfolioForm({...portfolioForm, originalImageFile: file, originalImagePreview: URL.createObjectURL(file)});
                }} className="w-full text-xs" />
              </div>
            </div>

            <div className="space-y-4">
              <input type="text" placeholder="作品标题" value={portfolioForm.title} onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl" required />
              
              <div className="grid grid-cols-2 gap-4">
                <select value={portfolioForm.category} onChange={e => setPortfolioForm({...portfolioForm, category: e.target.value as Category})} className="p-4 bg-neutral-50 rounded-xl">
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={portfolioForm.ageGroup} onChange={e => setPortfolioForm({...portfolioForm, ageGroup: e.target.value as AgeGroup})} className="p-4 bg-neutral-50 rounded-xl">
                  {Object.values(AgeGroup).map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <label className="text-xs font-bold text-amber-800">价格设置（一口价）</label>
                <input type="number" placeholder="￥ 0.00" value={portfolioForm.fixedPrice} onChange={e => setPortfolioForm({...portfolioForm, fixedPrice: Number(e.target.value)})} className="w-full mt-2 p-3 bg-white border-none rounded-lg text-lg font-bold" />
                <p className="text-[10px] text-amber-600 mt-2">※ 发布即视为同意：作品版权归设计师所有。</p>
              </div>

              <select value={portfolioForm.visibility} onChange={e => setPortfolioForm({...portfolioForm, visibility: e.target.value as Visibility})} className="w-full p-4 bg-neutral-50 rounded-xl font-bold">
                {Object.values(Visibility).map(v => <option key={v} value={v}>{v}</option>)}
              </select>

              {portfolioForm.visibility === Visibility.SEMI_PUBLIC && (
                <>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <p className="text-sm font-bold text-blue-900">💡 半公开作品说明</p>
                    <ul className="text-xs text-blue-800 mt-2 space-y-1 list-disc list-inside">
                      <li>图片将被模糊处理显示在前台</li>
                      <li>访客需要输入密码才能看到原图</li>
                      <li>必须上传原图/高清图供解锁查看</li>
                      <li>所有半公开图片都将显示"kidswave studio"水印</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <input type="number" placeholder="模糊度 %" value={portfolioForm.blurLevel} onChange={e => setPortfolioForm({...portfolioForm, blurLevel: Number(e.target.value)})} className="w-1/3 p-4 bg-neutral-50 rounded-xl" />
                    <input type="password" placeholder="设置访问密码" value={portfolioForm.password} onChange={e => setPortfolioForm({...portfolioForm, password: e.target.value})} className="flex-1 p-4 bg-neutral-50 rounded-xl" />
                  </div>
                </>
              )}

              <textarea placeholder="设计灵感与说明" value={portfolioForm.designInspiration} onChange={e => setPortfolioForm({...portfolioForm, designInspiration: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl h-32" />
              
              <button type="submit" disabled={loading} className="w-full py-5 bg-black text-white rounded-xl font-bold shadow-xl hover:bg-neutral-800 disabled:bg-gray-400">
                {loading ? "正在同步云端..." : (editingItem ? "更新作品" : "确认发布作品")}
              </button>
            </div>
          </form>
        )}

        {/* 3. 设计师管理 */}
        {activeTab === 'designers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="font-bold mb-6 text-lg">编辑设计师名片</h2>
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-black flex items-center justify-center bg-gray-50">
                   {designerForm.imagePreview ? <img src={designerForm.imagePreview} style={{ transform: `scale(${designerImageZoom})` }} className="w-full h-full object-cover" /> : "头像"}
                </div>
                <input type="range" min="1" max="2" step="0.01" value={designerImageZoom} onChange={e => setDesignerImageZoom(parseFloat(e.target.value))} className="w-full" />
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if(file) setDesignerForm({...designerForm, imageFile: file, imagePreview: URL.createObjectURL(file)});
                }} className="text-xs w-full" />
                <input type="text" placeholder="设计师姓名" value={designerForm.name} onChange={e => setDesignerForm({...designerForm, name: e.target.value})} className="w-full p-3 bg-neutral-50 rounded-lg" />
                <textarea placeholder="个人简介/设计理念" value={designerForm.bio} onChange={e => setDesignerForm({...designerForm, bio: e.target.value})} className="w-full p-3 bg-neutral-50 rounded-lg h-32" />
                <button onClick={handleDesignerSave} className="w-full py-4 bg-black text-white rounded-xl font-bold">更新云端信息</button>
              </div>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {designers.map(d => (
                <div key={d.id} className="bg-white p-4 rounded-xl border flex items-center gap-4">
                  <img src={d.image} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold">{d.name}</h4>
                    <button onClick={() => setEditingDesigner(d)} className="text-xs text-blue-600 mt-1">修改资料</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 系统设置 (联系方式) */}
{activeTab === 'settings' && (
  <div className="bg-white p-10 rounded-2xl shadow-lg border max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center mb-10">
      <h2 className="text-2xl font-bold serif-font">全局联系信息管理</h2>
      <p className="text-xs text-neutral-400 mt-2 uppercase tracking-widest">这些信息将实时同步到首页的 Contact 页面</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 基础文字信息 */}
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">微信号 (WeChat ID)</label>
          <input type="text" value={contactInfo.wechat || ''} 
            onChange={e => setContactInfo({...contactInfo, wechat: e.target.value})} 
            className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black transition-all" placeholder="例如: MyStudio_01" />
        </div>
        
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">业务邮箱 (Email)</label>
          <input type="email" value={contactInfo.email || ''} 
            onChange={e => setContactInfo({...contactInfo, email: e.target.value})} 
            className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black transition-all" placeholder="例如: design@studio.com" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">小红书号 (Xiaohongshu)</label>
          <input type="text" value={contactInfo.xiaohongshu || ''} 
            onChange={e => setContactInfo({...contactInfo, xiaohongshu: e.target.value})} 
            className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black transition-all" placeholder="输入你的小红书ID" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">联系电话 (Phone)</label>
          <input type="text" value={contactInfo.phone || ''} 
            onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} 
            className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black transition-all" placeholder="+86 138..." />
        </div>
      </div>

      {/* 微信二维码上传 */}
      <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">微信收款/联系二维码</label>
        <div className="w-48 h-48 bg-white rounded-lg shadow-inner mb-4 flex items-center justify-center overflow-hidden border">
          {contactInfo.wechatQR ? (
            <img src={contactInfo.wechatQR} className="w-full h-full object-contain" alt="QR Code" />
          ) : (
            <div className="text-[10px] text-neutral-300">暂无二维码图片</div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={async (e) => {
          const file = e.target.files?.[0];
          if(file) {
            setLoading(true);
            try {
              const url = await uploadFile(file, 'settings');
              setContactInfo({...contactInfo, wechatQR: url});
              alert("二维码已上传预览，请点击下方保存生效");
            } catch (err) { alert("上传失败"); }
            setLoading(false);
          }
        }} className="text-[10px] w-full" />
      </div>
    </div>

    <button 
      onClick={handleSettingsSave} 
      disabled={loading}
      className="w-full mt-10 py-5 bg-black text-white rounded-xl font-bold shadow-xl hover:bg-neutral-800 transition-all disabled:bg-gray-400"
    >
      {loading ? "正在同步至云端..." : "保存并发布所有设置"}
    </button>
  </div>
)}
      </div>
    </div>
  );
};

export default AdminPanel;