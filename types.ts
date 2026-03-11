
export enum Category {
  APPAREL = '服装类',
  PATTERNS = '花稿类',
  TEXTILES = '纺织品类',
  OTHER = '更多类别'
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
  title_en?: string; // 英文标题
  coverImage: string;
  originalImage?: string;
  highResLink?: string;
  category: Category;
  ageGroup: AgeGroup;
  visibility: Visibility;
  copyrightFee?: number;
  usageFee?: number;
  basePrice?: number;
  description: string;
  description_en?: string; // 英文描述
  designInspiration?: string;
  designInspiration_en?: string; // 英文设计灵感
  designHighlights?: string;
  applicableScenarios?: string;
  sizeRange?: string;
  sizeRange_en?: string; // 英文尺码范围
  fabricSuggestions?: string;
  fabricSuggestions_en?: string; // 英文面料建议
  addons: Addon[];
  password?: string;
  assignedUsers?: string[];
  blurPercentage?: number;
  viewCount?: number;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  wechat: string;
  name: string;
  password: string;
  createdAt: string;
  assignedItems: string[]; // 分配给该用户的专属作品ID列表
}
