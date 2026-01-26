
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
  originalImage?: string; // 半公开图片的原图（未模糊版本）
  highResLink?: string;
  category: Category;
  ageGroup: AgeGroup;
  visibility: Visibility;
  basePrice: number;
  description: string;
  addons: Addon[];
  password?: string; // 半公开图片的访问密码
  assignedUsers?: string[]; // 专属定制图片分配给哪些用户（用户邮箱列表）
  blurPercentage?: number; // 模糊百分比 (0-100)
  viewCount?: number; // 访问次数统计
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
