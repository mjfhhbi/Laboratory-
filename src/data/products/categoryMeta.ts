import { FoodCategoryMeta, FoodCatalogCategory } from '../../types/foodProductsCatalog';

export const FOOD_CATALOG_CATEGORIES: FoodCategoryMeta[] = [
  {
    id: 'dairy',
    nameFa: 'لبنیات',
    nameEn: 'Dairy',
    iconName: 'Milk',
    color: 'text-sky-600',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    description: 'انواع شیر پاستوریزه و استریل، ماست، پنیر، دوغ، خامه و کره'
  },
  {
    id: 'meat',
    nameFa: 'گوشت',
    nameEn: 'Meat & Poultry',
    iconName: 'Beef',
    color: 'text-rose-600',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'فرآورده‌های گوشتی، سوسیس، کالباس، همبرگر، ناگت و گوشت فرآوری‌شده'
  },
  {
    id: 'cereals',
    nameFa: 'غلات',
    nameEn: 'Cereals & Grains',
    iconName: 'Wheat',
    color: 'text-amber-600',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'انواع آرد گندم، جو، ماکارونی و پاستا، بلغور و غلات صبحانه'
  },
  {
    id: 'bread',
    nameFa: 'نان',
    nameEn: 'Bread & Bakery',
    iconName: 'Croissant',
    color: 'text-amber-700',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
    description: 'نان‌های سنتی (سنگک، بربری، تافتون، لواش) و نان‌های صنعتی و حجیم'
  },
  {
    id: 'biscuits',
    nameFa: 'بیسکویت',
    nameEn: 'Biscuits & Cookies',
    iconName: 'Cookie',
    color: 'text-orange-600',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'انواع بیسکویت سخت، ترد، کرم‌دار، ویفر و کوکی‌های مغزدار'
  },
  {
    id: 'beverages',
    nameFa: 'نوشیدنی',
    nameEn: 'Beverages & Juices',
    iconName: 'CupSoda',
    color: 'text-teal-600',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'آبمیوه‌های طبیعی، نکتار، شربت، نوشابه‌های گازدار و ماءالشعیر'
  },
  {
    id: 'oils_fats',
    nameFa: 'روغن و چربی',
    nameEn: 'Oils & Fats',
    iconName: 'Droplets',
    color: 'text-yellow-600',
    badgeBg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    description: 'روغن‌های مایع خوراکی، سرخ‌کردنی، زیتون، کنجد و مارگارین'
  },
  {
    id: 'canned_foods',
    nameFa: 'کنسرو',
    nameEn: 'Canned Foods',
    iconName: 'PackageOpen',
    color: 'text-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'کنسرو ماهی تن، لوبیا چیتی، نخودفرنگی، ذرت و خوراک‌های آماده'
  },
  {
    id: 'jams',
    nameFa: 'مربا',
    nameEn: 'Jams & Preserves',
    iconName: 'Cherry',
    color: 'text-pink-600',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
    description: 'انواع مرباجات میوه‌ای، مارمالاد، ژله و پوره تغلیظ‌شده میوه'
  },
  {
    id: 'honey',
    nameFa: 'عسل',
    nameEn: 'Honey & Apiary',
    iconName: 'Hexagon',
    color: 'text-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-300',
    description: 'عسل طبیعی چندگیاه، تک‌گل، ژل رویال و فرآورده‌های کندو'
  },
  {
    id: 'chocolate',
    nameFa: 'شکلات',
    nameEn: 'Chocolate & Cocoa',
    iconName: 'Sparkles',
    color: 'text-stone-700',
    badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
    description: 'شکلات تلخ، شیری، سفید، پودر کاکائو، تافل و فرآورده‌های کاکائویی'
  },
  {
    id: 'ice_cream',
    nameFa: 'بستنی',
    nameEn: 'Ice Cream',
    iconName: 'IceCream',
    color: 'text-fuchsia-600',
    badgeBg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    description: 'بستنی شیری، خامه‌ای، چوبی، قیفی، فالوده و سوربه میوه‌ای'
  },
  {
    id: 'fruits_vegetables',
    nameFa: 'میوه و سبزی',
    nameEn: 'Fruits & Veggies',
    iconName: 'Apple',
    color: 'text-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'رب گوجه‌فرنگی، سبزیجات منجمد (IQF)، ترشیجات، شوری و چیپس میوه'
  },
  {
    id: 'pulses_legumes',
    nameFa: 'حبوبات',
    nameEn: 'Pulses & Legumes',
    iconName: 'Layers',
    color: 'text-lime-700',
    badgeBg: 'bg-lime-50 text-lime-800 border-lime-200',
    description: 'نخود، عدس، لوبیا قرمز، لپه، لوبیا سفید و ماش بوجاری‌شده بسته‌بندی'
  },
  {
    id: 'spices',
    nameFa: 'ادویه',
    nameEn: 'Spices & Seasonings',
    iconName: 'Flame',
    color: 'text-red-600',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    description: 'زردچوبه، فلفل سیاه و قرمز، دارچین، زعفران، نمک تصفیه و چاشنی‌ها'
  },
  {
    id: 'water',
    nameFa: 'آب',
    nameEn: 'Water & Mineral Water',
    iconName: 'GlassWater',
    color: 'text-cyan-600',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    description: 'آب معدنی طبیعی بسته‌بندی، آب آشامیدنی بسته‌بندی‌شده و آب طعم‌دار'
  },
  {
    id: 'other_products',
    nameFa: 'سایر محصولات',
    nameEn: 'Other Products',
    iconName: 'Package',
    color: 'text-violet-600',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    description: 'سس مایونز، کچاپ، سرکه تخمیری، مخمر نانوایی و افزودنی‌های خاص'
  }
];

export const EMOJI_MAP: Record<FoodCatalogCategory, string> = {
  dairy: '🥛',
  meat: '🥩',
  cereals: '🌾',
  bread: '🥖',
  biscuits: '🍪',
  beverages: '🧃',
  oils_fats: '🫒',
  canned_foods: '🥫',
  jams: '🍓',
  honey: '🍯',
  chocolate: '🍫',
  ice_cream: '🍦',
  fruits_vegetables: '🥗',
  pulses_legumes: '🫘',
  spices: '🧂',
  water: '💧',
  other_products: '📦'
};

export const PRODUCT_CATEGORY_KEYS: FoodCatalogCategory[] = [
  'dairy',
  'meat',
  'cereals',
  'bread',
  'biscuits',
  'beverages',
  'oils_fats',
  'canned_foods',
  'jams',
  'honey',
  'chocolate',
  'ice_cream',
  'fruits_vegetables',
  'pulses_legumes',
  'spices',
  'water',
  'other_products'
];

export const PRODUCT_CATEGORIES: Record<FoodCatalogCategory, FoodCategoryMeta & { icon: string }> = 
  FOOD_CATALOG_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = {
      ...cat,
      icon: EMOJI_MAP[cat.id] || '📦'
    };
    return acc;
  }, {} as Record<FoodCatalogCategory, FoodCategoryMeta & { icon: string }>);

