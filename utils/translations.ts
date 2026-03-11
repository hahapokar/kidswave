import { Category, AgeGroup } from '../types';

// Translation utilities for all content
export const TRANSLATIONS = {
  category: {
    [Category.APPAREL]: { zh: '服装类', en: 'Apparel' },
    [Category.PATTERNS]: { zh: '花稿类', en: 'Patterns' },
    [Category.TEXTILES]: { zh: '纺织品类', en: 'Textiles' },
    [Category.OTHER]: { zh: '更多类别', en: 'Other' }
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
