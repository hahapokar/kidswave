
export enum Category {
  OUTERWEAR = '外服',
  LOUNGEWEAR = '家居服',
  ACCESSORIES = '服饰',
  PATTERNS = '花稿'
}

export enum Visibility {
  PUBLIC = '公开',
  SEMI_PUBLIC = '半公开',
  EXCLUSIVE = '专属定制'
}

export enum AgeGroup {
  INFANT = '婴童',
  KIDS = '小中童'
}

export interface Addon {
  label: string;
  price: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  coverImage: string;
  highResLink?: string;
  category: Category;
  ageGroup: AgeGroup;
  visibility: Visibility;
  basePrice: number;
  description: string;
  addons: Addon[];
}
