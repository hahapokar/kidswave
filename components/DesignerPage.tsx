import React from 'react';

interface DesignerPageProps {
  lang: 'zh' | 'en';
}

const DesignerPage: React.FC<DesignerPageProps> = ({ lang }) => {
  const designers = (() => {
    try {
      const stored = localStorage.getItem('designers');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  })();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold serif-font mb-2">{lang === 'zh' ? '设计师团队' : 'Our Designers'}</h1>
        <p className="text-neutral-500">{lang === 'zh' ? '认识我们的设计师' : 'Meet our design team'}</p>
      </div>
      
      {designers.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          {lang === 'zh' ? '暂无设计师信息' : 'No designer information available yet'}
        </div>
      ) : (
        <div className="space-y-16">
          {designers.map((designer: any, index: number) => (
            <div key={designer.id} className={`md:flex gap-8 items-start ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-1/3">
                {designer.image ? (
                  <img src={designer.image} alt={designer.name} className="w-full h-auto rounded-lg shadow-lg" />
                ) : (
                  <div className="w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
                    {lang === 'zh' ? '未设置图片' : 'No image'}
                  </div>
                )}
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold serif-font mb-4">{designer.name}</h2>
                <div className="prose max-w-none text-neutral-700 leading-relaxed">
                  {designer.bio ? designer.bio.split('\n').map((p: string, i: number) => (
                    <p key={i} className="mb-4">{p}</p>
                  )) : (
                    <p className="text-neutral-400">{lang === 'zh' ? '尚未填写简介' : 'No bio provided.'}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesignerPage;
