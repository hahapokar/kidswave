import React, { useState, useEffect } from 'react';
import WatermarkedImage from './WatermarkedImage'; 
import { Category, Visibility, AgeGroup, PortfolioItem, Addon } from '../types';
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

  // 图片编辑状态
  const [imageZoom, setImageZoom] = useState<number>(1);
  const [designerImageZoom, setDesignerImageZoom] = useState<number>(1);

  // 表单草稿状态
  const [portfolioForm, setPortfolioForm] = useState({
    title: '', category: Category.APPAREL, ageGroup: AgeGroup.KIDS, visibility: Visibility.PUBLIC,
    copyrightFee: 0, usageFee: 0, description: '', designInspiration: '',
    applicableScenarios: '', sizeRange: '', fabricSuggestions: '',
    addons: [] as Addon[], blurLevel: 0, password: '', imageFile: null as File | null, imagePreview: '',
    highResLink: '', originalImageFile: null as File | null, originalImagePreview: '',
    assignedUsers: [] as string[]
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
        ageGroup: portfolioForm.ageGroup,
        visibility: portfolioForm.visibility,
        copyrightFee: portfolioForm.copyrightFee,
        usageFee: portfolioForm.usageFee,
        basePrice: portfolioForm.copyrightFee + portfolioForm.usageFee,
        description: portfolioForm.description,
        designInspiration: portfolioForm.designInspiration,
        applicableScenarios: portfolioForm.applicableScenarios,
        sizeRange: portfolioForm.sizeRange,
        fabricSuggestions: portfolioForm.fabricSuggestions,
        addons: portfolioForm.addons,
        blurPercentage: portfolioForm.visibility === Visibility.SEMI_PUBLIC ? portfolioForm.blurLevel : 0,
        password: portfolioForm.visibility === Visibility.SEMI_PUBLIC ? portfolioForm.password : null,
        highResLink: portfolioForm.highResLink,
        originalImage: portfolioForm.originalImagePreview ? await uploadFile(portfolioForm.originalImageFile!, 'portfolio') : null,
        assignedUsers: portfolioForm.visibility === Visibility.EXCLUSIVE ? portfolioForm.assignedUsers : null,
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
      title: '', category: Category.APPAREL, ageGroup: AgeGroup.KIDS, visibility: Visibility.PUBLIC,
      copyrightFee: 0, usageFee: 0, description: '', designInspiration: '',
      applicableScenarios: '', sizeRange: '', fabricSuggestions: '',
      addons: [], blurLevel: 0, password: '', imageFile: null, imagePreview: '',
      highResLink: '', originalImageFile: null, originalImagePreview: '',
      assignedUsers: []
    });
    setEditingItem(null);
    setImageZoom(1);
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
                    <button onClick={() => { 
                      setEditingItem(item); 
                      setPortfolioForm({
                        title: item.title || '',
                        category: item.category || Category.APPAREL,
                        ageGroup: item.ageGroup || AgeGroup.KIDS,
                        visibility: item.visibility || Visibility.PUBLIC,
                        copyrightFee: item.copyrightFee || 0,
                        usageFee: item.usageFee || 0,
                        description: item.description || '',
                        designInspiration: item.designInspiration || '',
                        applicableScenarios: item.applicableScenarios || '',
                        sizeRange: item.sizeRange || '',
                        fabricSuggestions: item.fabricSuggestions || '',
                        addons: item.addons || [],
                        blurLevel: item.blurPercentage || 0,
                        password: item.password || '',
                        imageFile: null,
                        imagePreview: item.coverImage || '',
                        highResLink: item.highResLink || '',
                        originalImageFile: null,
                        originalImagePreview: item.originalImage || '',
                        assignedUsers: item.assignedUsers || []
                      }); 
                      setActiveTab('add'); 
                    }} className="text-xs bg-gray-100 px-3 py-1 rounded">编辑</button>
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
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">作品封面图</label>
                <div className="aspect-[3/4] bg-neutral-50 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden relative">
                  {portfolioForm.imagePreview ? (
                    <div style={{ transform: `scale(${imageZoom})`, transformOrigin: 'center', transition: 'transform 0.2s' }}>
                      <img src={portfolioForm.imagePreview} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">点击选择图片</div>
                  )}
                </div>
                {portfolioForm.imagePreview && (
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">缩放预览：</label>
                    <input type="range" min="0.5" max="2" step="0.1" value={imageZoom} onChange={e => setImageZoom(Number(e.target.value))} className="w-full" />
                    <span className="text-xs text-gray-500">{(imageZoom * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400">选择或上传图片</label>
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if(file) {
                    setPortfolioForm({...portfolioForm, imageFile: file, imagePreview: URL.createObjectURL(file)});
                    setImageZoom(1);
                  }
                }} className="w-full p-3 bg-neutral-50 rounded-xl border border-dashed" />
              </div>
            </div>
            <div className="space-y-6">
              <input type="text" placeholder="作品名称" value={portfolioForm.title} onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl" required />
              <div className="grid grid-cols-2 gap-4">
                <select value={portfolioForm.category} onChange={e => setPortfolioForm({...portfolioForm, category: e.target.value as Category})} className="p-4 bg-neutral-50 rounded-xl">
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={portfolioForm.ageGroup} onChange={e => setPortfolioForm({...portfolioForm, ageGroup: e.target.value as AgeGroup})} className="p-4 bg-neutral-50 rounded-xl">
                  {Object.values(AgeGroup).map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="版权费" value={portfolioForm.copyrightFee} onChange={e => setPortfolioForm({...portfolioForm, copyrightFee: Number(e.target.value)})} className="p-4 bg-neutral-50 rounded-xl" />
                <input type="number" placeholder="使用权费" value={portfolioForm.usageFee} onChange={e => setPortfolioForm({...portfolioForm, usageFee: Number(e.target.value)})} className="p-4 bg-neutral-50 rounded-xl" />
              </div>
              <select value={portfolioForm.visibility} onChange={e => setPortfolioForm({...portfolioForm, visibility: e.target.value as Visibility})} className="w-full p-4 bg-neutral-50 rounded-xl">
                {Object.values(Visibility).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              {portfolioForm.visibility === Visibility.SEMI_PUBLIC && (
                <>
                  <input type="number" placeholder="模糊程度 (0-100)" value={portfolioForm.blurLevel} onChange={e => setPortfolioForm({...portfolioForm, blurLevel: Number(e.target.value)})} className="w-full p-4 bg-neutral-50 rounded-xl" min="0" max="100" />
                  <input type="password" placeholder="访问密码" value={portfolioForm.password} onChange={e => setPortfolioForm({...portfolioForm, password: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl" />
                </>
              )}
              {portfolioForm.visibility === Visibility.EXCLUSIVE && (
                <textarea placeholder="分配用户邮箱 (用逗号分隔)" value={portfolioForm.assignedUsers.join(', ')} onChange={e => setPortfolioForm({...portfolioForm, assignedUsers: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} className="w-full p-4 bg-neutral-50 rounded-xl h-20" />
              )}
              <textarea placeholder="作品描述" value={portfolioForm.description} onChange={e => setPortfolioForm({...portfolioForm, description: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl h-24" />
              <textarea placeholder="设计灵感" value={portfolioForm.designInspiration} onChange={e => setPortfolioForm({...portfolioForm, designInspiration: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl h-24" />
              <textarea placeholder="适用场景" value={portfolioForm.applicableScenarios} onChange={e => setPortfolioForm({...portfolioForm, applicableScenarios: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl h-24" />
              <input type="text" placeholder="尺寸范围" value={portfolioForm.sizeRange} onChange={e => setPortfolioForm({...portfolioForm, sizeRange: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl" />
              <textarea placeholder="面料建议" value={portfolioForm.fabricSuggestions} onChange={e => setPortfolioForm({...portfolioForm, fabricSuggestions: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl h-24" />
              <input type="url" placeholder="高清链接" value={portfolioForm.highResLink} onChange={e => setPortfolioForm({...portfolioForm, highResLink: e.target.value})} className="w-full p-4 bg-neutral-50 rounded-xl" />
              <div>
                <label className="text-xs font-bold text-gray-400">原图 (半公开用)</label>
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if(file) setPortfolioForm({...portfolioForm, originalImageFile: file, originalImagePreview: URL.createObjectURL(file)});
                }} className="w-full p-4 bg-neutral-50 rounded-xl" />
              </div>
              {/* Addons section */}
              <div>
                <label className="text-xs font-bold text-gray-400">附加选项</label>
                {portfolioForm.addons.map((addon, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input type="text" placeholder="标签" value={addon.label} onChange={e => {
                      const newAddons = [...portfolioForm.addons];
                      newAddons[index].label = e.target.value;
                      setPortfolioForm({...portfolioForm, addons: newAddons});
                    }} className="flex-1 p-2 bg-neutral-50 rounded" />
                    <input type="number" placeholder="价格" value={addon.price} onChange={e => {
                      const newAddons = [...portfolioForm.addons];
                      newAddons[index].price = Number(e.target.value);
                      setPortfolioForm({...portfolioForm, addons: newAddons});
                    }} className="w-20 p-2 bg-neutral-50 rounded" />
                    <button type="button" onClick={() => {
                      const newAddons = portfolioForm.addons.filter((_, i) => i !== index);
                      setPortfolioForm({...portfolioForm, addons: newAddons});
                    }} className="px-2 py-1 bg-red-100 text-red-600 rounded">删</button>
                  </div>
                ))}
                <button type="button" onClick={() => setPortfolioForm({...portfolioForm, addons: [...portfolioForm.addons, { label: '', price: 0 }]})} className="mt-2 px-4 py-2 bg-gray-100 rounded">添加附加选项</button>
              </div>
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
              <h2 className="text-xl font-bold mb-6">{editingDesigner ? '编辑设计师' : '添加设计师'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  {designerForm.imagePreview && (
                    <div>
                      <label className="text-xs text-gray-400">缩放预览：</label>
                      <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-2">
                        <img src={designerForm.imagePreview} style={{ transform: `scale(${designerImageZoom})`, transformOrigin: 'center' }} className="w-32 h-32 object-cover rounded-lg" alt="预览" />
                      </div>
                      <input type="range" min="0.5" max="2" step="0.1" value={designerImageZoom} onChange={e => setDesignerImageZoom(Number(e.target.value))} className="w-full mb-1" />
                      <span className="text-xs text-gray-500">{(designerImageZoom * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
                <input type="text" placeholder="姓名" value={designerForm.name} onChange={e => setDesignerForm({...designerForm, name: e.target.value})} className="p-4 bg-neutral-50 rounded-xl" required />
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">头像图片</label>
                  <input type="file" accept="image/*" onChange={e => {
                     const file = e.target.files?.[0];
                     if(file) {
                       setDesignerForm({...designerForm, imageFile: file, imagePreview: URL.createObjectURL(file)});
                       setDesignerImageZoom(1);
                     }
                  }} className="p-4 bg-neutral-50 rounded-xl w-full" />
                </div>
                <textarea placeholder="简介" value={designerForm.bio} onChange={e => setDesignerForm({...designerForm, bio: e.target.value})} className="md:col-span-2 p-4 bg-neutral-50 rounded-xl h-32" />
                <button onClick={handleDesignerSave} disabled={loading} className="md:col-span-2 py-4 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 disabled:opacity-50">
                  {loading ? '保存中...' : (editingDesigner ? '更新设计师' : '保存设计师信息')}
                </button>
                {editingDesigner && (
                  <button onClick={() => {
                    setDesignerForm({ name: '', bio: '', imageFile: null, imagePreview: '' });
                    setEditingDesigner(null);
                    setDesignerImageZoom(1);
                  }} className="md:col-span-2 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300">
                    取消编辑
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {designers.map(d => (
                <div key={d.id} className="bg-white p-4 rounded-xl border">
                  {d.image && <img src={d.image} className="w-full h-40 rounded-lg object-cover mb-3" />}
                  <p className="font-bold mb-2">{d.name}</p>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{d.bio}</p>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingDesigner(d);
                      setDesignerForm({
                        name: d.name || '',
                        bio: d.bio || '',
                        imageFile: null,
                        imagePreview: d.image || ''
                      });
                      setDesignerImageZoom(1);
                    }} className="flex-1 text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">编辑</button>
                    <button onClick={async () => { if(confirm("删除设计师？")) { await supabase.from('designers').delete().eq('id', d.id); fetchData(); } }} className="flex-1 text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100">删除</button>
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