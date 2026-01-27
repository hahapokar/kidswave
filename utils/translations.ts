import { Category, AgeGroup } from '../types';

// Translation utilities for all content
export const TRANSLATIONS = {
  category: {
    [Category.OUTERWEAR]: { zh: '外服', en: 'Outerwear' },
    [Category.LOUNGEWEAR]: { zh: '家居服', en: 'Loungewear' },
    [Category.ACCESSORIES]: { zh: '服饰', en: 'Accessories' },
    [Category.PATTERNS]: { zh: '花稿', en: 'Patterns' }
  },
  ageGroup: {
    [AgeGroup.INFANT]: { zh: '婴童', en: 'Infant' },
    [AgeGroup.KIDS]: { zh: '小中童', en: 'Kids' }
  }
};

export function translateCategory(cat: Category, lang: 'zh' | 'en'): string {
  return TRANSLATIONS.category[cat]?.[lang] || cat;
}

export function translateAgeGroup(age: AgeGroup, lang: 'zh' | 'en'): string {
  return TRANSLATIONS.ageGroup[age]?.[lang] || age;
}
