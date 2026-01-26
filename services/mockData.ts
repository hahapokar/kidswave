
import { Category, AgeGroup, Visibility, PortfolioItem } from '../types';

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    title: '云朵软绵家居系列',
    coverImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1000&fit=crop',
    category: Category.LOUNGEWEAR,
    ageGroup: AgeGroup.INFANT,
    visibility: Visibility.PUBLIC,
    basePrice: 399,
    description: '采用新疆长绒棉，极致亲肤。专为0-3岁婴童设计。',
    addons: [
      { label: '工艺版单 (B)', price: 100 },
      { label: '齐色建议 (C)', price: 50 },
      { label: '面辅料建议 (D)', price: 100 }
    ]
  },
  {
    id: '2',
    title: '森林探险工装外套',
    coverImage: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.SEMI_PUBLIC,
    basePrice: 899,
    description: '防风防水面料，立体大口袋设计，适合户外活动。',
    addons: [
      { label: '工艺版单 (B)', price: 150 },
      { label: '齐色建议 (C)', price: 80 },
      { label: '高科技面料吊牌', price: 200 }
    ]
  },
  {
    id: '3',
    title: '莫奈花园原创花稿',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop',
    category: Category.PATTERNS,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.EXCLUSIVE,
    basePrice: 2000,
    description: '手绘水彩风格，已申请版权保护。',
    addons: []
  },
  {
    id: '4',
    title: '极简北欧针织衫',
    coverImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.INFANT,
    visibility: Visibility.PUBLIC,
    basePrice: 450,
    description: '纯天然美利奴羊毛，轻盈保暖。',
    addons: [
      { label: '工艺版单 (B)', price: 100 },
      { label: '面辅料建议 (D)', price: 50 }
    ]
  },
  {
    id: '5',
    title: '甜美公主连衣裙',
    coverImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 699,
    description: '轻盈纱质面料，精致蕾丝装饰，适合派对和特殊场合。',
    addons: [
      { label: '工艺版单 (B)', price: 120 },
      { label: '齐色建议 (C)', price: 60 },
      { label: '面辅料建议 (D)', price: 80 }
    ]
  },
  {
    id: '6',
    title: '舒适棉质睡衣套装',
    coverImage: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&h=1000&fit=crop',
    category: Category.LOUNGEWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 359,
    description: '100%有机棉，透气柔软，印花图案活泼可爱。',
    addons: [
      { label: '工艺版单 (B)', price: 80 },
      { label: '面辅料建议 (D)', price: 50 }
    ]
  },
  {
    id: '7',
    title: '运动休闲外套',
    coverImage: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.SEMI_PUBLIC,
    basePrice: 759,
    description: '轻量化设计，防泼水面料，适合运动和日常穿着。',
    addons: [
      { label: '工艺版单 (B)', price: 130 },
      { label: '齐色建议 (C)', price: 70 },
      { label: '高科技面料吊牌', price: 150 }
    ]
  },
  {
    id: '8',
    title: '经典格纹衬衫',
    coverImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 429,
    description: '经典格纹设计，纯棉面料，适合正式场合。',
    addons: [
      { label: '工艺版单 (B)', price: 90 },
      { label: '齐色建议 (C)', price: 55 }
    ]
  },
  {
    id: '9',
    title: '可爱动物图案系列',
    coverImage: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&h=1000&fit=crop',
    category: Category.PATTERNS,
    ageGroup: AgeGroup.INFANT,
    visibility: Visibility.PUBLIC,
    basePrice: 1200,
    description: '原创手绘动物图案，包含熊猫、兔子、小象等设计。',
    addons: [
      { label: '完整图案库', price: 300 }
    ]
  },
  {
    id: '10',
    title: '冬季羽绒保暖外套',
    coverImage: 'https://images.unsplash.com/photo-1514090458221-65cd7b4d0190?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.SEMI_PUBLIC,
    basePrice: 1299,
    description: '90%白鸭绒填充，防风防水外层，专业保暖设计。',
    addons: [
      { label: '工艺版单 (B)', price: 180 },
      { label: '齐色建议 (C)', price: 90 },
      { label: '面辅料建议 (D)', price: 120 }
    ]
  },
  {
    id: '11',
    title: '夏日清凉短裤套装',
    coverImage: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&h=1000&fit=crop',
    category: Category.ACCESSORIES,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 329,
    description: '轻薄透气面料，鲜艳色彩搭配，夏季必备款式。',
    addons: [
      { label: '工艺版单 (B)', price: 70 },
      { label: '齐色建议 (C)', price: 45 }
    ]
  },
  {
    id: '12',
    title: '婴儿连体爬服',
    coverImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=1000&fit=crop',
    category: Category.LOUNGEWEAR,
    ageGroup: AgeGroup.INFANT,
    visibility: Visibility.PUBLIC,
    basePrice: 289,
    description: '纯棉材质，按扣设计方便换尿布，适合0-12个月。',
    addons: [
      { label: '工艺版单 (B)', price: 60 },
      { label: '面辅料建议 (D)', price: 40 }
    ]
  },
  {
    id: '13',
    title: '时尚牛仔外套',
    coverImage: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.EXCLUSIVE,
    basePrice: 899,
    description: '经典牛仔布料，破洞设计，时尚个性。品牌定制款。',
    addons: []
  },
  {
    id: '14',
    title: '春季薄款风衣',
    coverImage: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.SEMI_PUBLIC,
    basePrice: 679,
    description: '防风透气，双排扣设计，春秋过渡季节首选。',
    addons: [
      { label: '工艺版单 (B)', price: 110 },
      { label: '齐色建议 (C)', price: 65 },
      { label: '面辅料建议 (D)', price: 85 }
    ]
  },
  {
    id: '15',
    title: '几何图案艺术系列',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop',
    category: Category.PATTERNS,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 1500,
    description: '现代几何图案设计，可用于多种童装品类。',
    addons: [
      { label: '完整图案库', price: 350 },
      { label: '配色方案', price: 150 }
    ]
  },
  {
    id: '16',
    title: '卡通印花T恤',
    coverImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=1000&fit=crop',
    category: Category.ACCESSORIES,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 199,
    description: '纯棉圆领T恤，可爱卡通印花，多色可选。',
    addons: [
      { label: '工艺版单 (B)', price: 50 },
      { label: '齐色建议 (C)', price: 35 }
    ]
  }
];

