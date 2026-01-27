export const CATEGORY_MAP: Record<string, { zh: string; en: string }> = {
  '外服': { zh: '外服', en: 'Outerwear' },
  '家居服': { zh: '家居服', en: 'Loungewear' },
  '服饰': { zh: '服饰', en: 'Accessories' },
  '花稿': { zh: '花稿', en: 'Patterns' }
};

export const VISIBILITY_MAP: Record<string, { zh: string; en: string }> = {
  '公开': { zh: '公开', en: 'Public' },
  '半公开': { zh: '半公开', en: 'Semi-Public' },
  '专属定制': { zh: '专属定制', en: 'Exclusive' }
};

export function getCategoryLabel(key: string, lang: 'zh' | 'en') {
  return CATEGORY_MAP[key] ? (lang === 'zh' ? CATEGORY_MAP[key].zh : CATEGORY_MAP[key].en) : key;
}

export function getVisibilityLabel(key: string, lang: 'zh' | 'en') {
  return VISIBILITY_MAP[key] ? (lang === 'zh' ? VISIBILITY_MAP[key].zh : VISIBILITY_MAP[key].en) : key;
}
