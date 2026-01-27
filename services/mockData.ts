
import { Category, AgeGroup, Visibility, PortfolioItem } from '../types';

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  // 外服类 - OUTERWEAR
  {
    id: '1',
    title: '森林探险工装外套',
    coverImage: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 899,
    copyrightFee: 540,
    usageFee: 359,
    description: '防风防水面料，立体大口袋设计，适合户外活动。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 150 },
      { label: '齐色建议', price: 80 }
    ]
  },
  {
    id: '2',
    title: '极简北欧针织衫',
    coverImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.INFANT,
    visibility: Visibility.PUBLIC,
    basePrice: 450,
    copyrightFee: 270,
    usageFee: 180,
    description: '纯天然美利奴羊毛，轻盈保暖。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 100 },
      { label: '面辅料建议', price: 50 }
    ]
  },
  {
    id: '3',
    title: '甜美公主连衣裙',
    coverImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.SEMI_PUBLIC,
    basePrice: 699,
    copyrightFee: 420,
    usageFee: 279,
    password: 'demo2026',
    blurPercentage: 30,
    description: '轻盈纱质面料，精致蕾丝装饰，适合派对和特殊场合。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 120 },
      { label: '齐色建议', price: 60 }
    ]
  },
  {
    id: '4',
    title: '运动休闲外套',
    coverImage: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 759,
    copyrightFee: 456,
    usageFee: 303,
    description: '轻量化设计，防泼水面料，适合运动和日常穿着。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 130 },
      { label: '齐色建议', price: 70 }
    ]
  },
  {
    id: '5',
    title: '经典格纹衬衫',
    coverImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 429,
    copyrightFee: 257,
    usageFee: 172,
    description: '经典格纹设计，纯棉面料，适合正式场合。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 90 },
      { label: '齐色建议', price: 55 }
    ]
  },
  {
    id: '6',
    title: '冬季羽绒保暖外套',
    coverImage: 'https://images.unsplash.com/photo-1514090458221-65cd7b4d0190?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.SEMI_PUBLIC,
    password: 'demo2026',
    blurPercentage: 40,
    basePrice: 1299,
    copyrightFee: 779,
    usageFee: 520,
    description: '90%白鸭绒填充，防风防水外层，专业保暖设计。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 180 },
      { label: '面辅料建议', price: 120 }
    ]
  },
  {
    id: '7',
    title: '时尚牛仔外套',
    coverImage: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.EXCLUSIVE,
    assignedUsers: [],
    basePrice: 899,
    copyrightFee: 540,
    usageFee: 359,
    description: '经典牛仔布料，破洞设计，时尚个性。品牌定制款。',
    viewCount: 0,
    addons: []
  },
  {
    id: '8',
    title: '春季薄款风衣',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop',
    category: Category.OUTERWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 679,
    copyrightFee: 407,
    usageFee: 272,
    description: '防风透气，双排扣设计，春秋过渡季节首选。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 110 },
      { label: '齐色建议', price: 65 }
    ]
  },

  // 家居服类 - LOUNGEWEAR
  {
    id: '9',
    title: '云朵软绵家居系列',
    coverImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=1000&fit=crop',
    category: Category.LOUNGEWEAR,
    ageGroup: AgeGroup.INFANT,
    visibility: Visibility.PUBLIC,
    basePrice: 399,
    copyrightFee: 239,
    usageFee: 160,
    description: '采用新疆长绒棉，极致亲肤。专为0-3岁婴童设计。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 100 },
      { label: '面辅料建议', price: 50 }
    ]
  },
  {
    id: '10',
    title: '舒适棉质睡衣套装',
    coverImage: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&h=1000&fit=crop',
    category: Category.LOUNGEWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 359,
    copyrightFee: 215,
    usageFee: 144,
    description: '100%有机棉，透气柔软，印花图案活泼可爱。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 80 },
      { label: '面辅料建议', price: 50 }
    ]
  },
  {
    id: '11',
    title: '婴儿连体爬服',
    coverImage: 'https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800&h=1000&fit=crop',
    category: Category.LOUNGEWEAR,
    ageGroup: AgeGroup.INFANT,
    visibility: Visibility.PUBLIC,
    basePrice: 289,
    copyrightFee: 173,
    usageFee: 116,
    description: '纯棉材质，按扣设计方便换尿布，适合0-12个月。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 60 },
      { label: '面辅料建议', price: 40 }
    ]
  },
  {
    id: '12',
    title: '毛绒睡袍套装',
    coverImage: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&h=1000&fit=crop',
    category: Category.LOUNGEWEAR,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.SEMI_PUBLIC,
    password: 'demo2026',
    blurPercentage: 25,
    basePrice: 499,
    copyrightFee: 299,
    usageFee: 200,
    description: '超柔珊瑚绒面料，保暖舒适，可爱卡通刺绣。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 95 },
      { label: '面辅料建议', price: 60 }
    ]
  },

  // 服饰配件类 - ACCESSORIES
  {
    id: '13',
    title: '夏日清凉短裤套装',
    coverImage: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=1000&fit=crop',
    category: Category.ACCESSORIES,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 329,
    copyrightFee: 197,
    usageFee: 132,
    description: '轻薄透气面料，鲜艳色彩搭配，夏季必备款式。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 70 },
      { label: '齐色建议', price: 45 }
    ]
  },
  {
    id: '14',
    title: '卡通印花T恤',
    coverImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=1000&fit=crop',
    category: Category.ACCESSORIES,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 199,
    copyrightFee: 119,
    usageFee: 80,
    description: '纯棉圆领T恤，可爱卡通印花，多色可选。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 50 },
      { label: '齐色建议', price: 35 }
    ]
  },
  {
    id: '15',
    title: '条纹棉质背心',
    coverImage: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=800&h=1000&fit=crop',
    category: Category.ACCESSORIES,
    ageGroup: AgeGroup.INFANT,
    visibility: Visibility.PUBLIC,
    basePrice: 159,
    copyrightFee: 95,
    usageFee: 64,
    description: '经典条纹设计，纯棉透气，适合婴幼儿夏季穿着。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 40 }
    ]
  },
  {
    id: '16',
    title: '运动风卫衣套装',
    coverImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1000&fit=crop',
    category: Category.ACCESSORIES,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 459,
    copyrightFee: 275,
    usageFee: 184,
    description: '加厚卫衣面料，运动休闲风格，适合秋冬季节。',
    viewCount: 0,
    addons: [
      { label: '工艺版单', price: 85 },
      { label: '齐色建议', price: 50 }
    ]
  },

  // 花稿图案类 - PATTERNS
  {
    id: '17',
    title: '莫奈花园原创花稿',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop',
    category: Category.PATTERNS,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.EXCLUSIVE,
    assignedUsers: [],
    basePrice: 2000,
    copyrightFee: 1200,
    usageFee: 800,
    description: '手绘水彩风格，已申请版权保护。可用于多种服装品类。',
    viewCount: 0,
    addons: []
  },
  {
    id: '18',
    title: '可爱动物图案系列',
    coverImage: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&h=1000&fit=crop',
    category: Category.PATTERNS,
    ageGroup: AgeGroup.INFANT,
    visibility: Visibility.PUBLIC,
    basePrice: 1200,
    copyrightFee: 720,
    usageFee: 480,
    description: '原创手绘动物图案，包含熊猫、兔子、小象等设计。',
    viewCount: 0,
    addons: [
      { label: '完整图案库', price: 300 }
    ]
  },
  {
    id: '19',
    title: '几何图案艺术系列',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1000&fit=crop',
    category: Category.PATTERNS,
    ageGroup: AgeGroup.KIDS,
    visibility: Visibility.PUBLIC,
    basePrice: 1500,
    copyrightFee: 900,
    usageFee: 600,
    description: '现代几何图案设计，可用于多种童装品类。',
    viewCount: 0,
    addons: [
      { label: '完整图案库', price: 350 },
      { label: '配色方案', price: 150 }
    ]
  },
  {
    id: '20',
    title: '海洋世界主题花稿',
    coverImage: 'https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800&h=1000&fit=crop',
    category: Category.PATTERNS,
    ageGroup: AgeGroup.INFANT,
    visibility: Visibility.SEMI_PUBLIC,
    password: 'demo2026',
    blurPercentage: 50,
    basePrice: 1800,
    copyrightFee: 1080,
    usageFee: 720,
    description: '海洋生物主题，包含鲸鱼、海豚、小鱼等元素，适合婴童产品。',
    viewCount: 0,
    addons: [
      { label: '完整图案库', price: 400 }
    ]
  }
];

