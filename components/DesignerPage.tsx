import React from 'react';

interface DesignerPageProps {
  lang: 'zh' | 'en';
}

const DesignerPage: React.FC<DesignerPageProps> = ({ lang }) => {
  const info = (() => {
    try { return JSON.parse(localStorage.getItem('designerInfo') || '{}'); } catch { return {}; }
  })();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="md:flex gap-8 items-start">
        <div className="md:w-1/3">
          {info.image ? (
            <img src={info.image} alt="designer" className="w-full h-auto rounded-lg shadow" />
          ) : (
            <div className="w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">{lang === 'zh' ? '未设置设计师图片' : 'Designer image not set'}</div>
          )}
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold serif-font mb-4">{lang === 'zh' ? '设计师简介' : 'Designer'}</h1>
          <div className="prose max-w-none text-neutral-700">
            {info.bio ? info.bio.split('\n').map((p: string, i: number) => <p key={i}>{p}</p>) : (
              <p className="text-neutral-400">{lang === 'zh' ? '尚未填写简介' : 'No bio provided yet.'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerPage;
