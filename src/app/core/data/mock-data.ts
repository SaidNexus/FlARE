import { Product, Review } from '../models/product.model';
import { Category } from '../models/category.model';
import { Order } from '../models/order.model';
import { NotificationItem } from '../models/notification.model';

export const categoryIcon = '/assets/images/categories/hair-icon.png';
export const productImage1 = '/assets/images/products/shampoo/shampoo-dandruff.png';
export const productImage2 = '/assets/images/products/shampoo/temp.png';
export const coverImage = '/assets/images/covers/concer-banner.png';

export const categories: Category[] = [
  { id: 'cat-shampoo', slug: 'shampoo', nameEn: 'Shampoos', nameAr: 'شامبوهات', productCount: 18 },
  { id: 'cat-conditioner', slug: 'conditioner', nameEn: 'Conditioners', nameAr: 'بلسمات', productCount: 12 },
  { id: 'cat-hair-mask', slug: 'hair-mask', nameEn: 'Hair Masks', nameAr: 'أقنعة الشعر', productCount: 10 },
  { id: 'cat-hair-oil', slug: 'hair-oil', nameEn: 'Hair Oils', nameAr: 'زيوت الشعر', productCount: 15 },
  { id: 'cat-treatment', slug: 'treatment', nameEn: 'Treatments', nameAr: 'علاجات', productCount: 8 },
  { id: 'cat-scalp-care', slug: 'scalp-care', nameEn: 'Scalp Care', nameAr: 'العناية بفروة الرأس', productCount: 9 }
];

export const products: Product[] = [
  {
    id: 'prod-1',
    slug: 'anti-dandruff-shampoo',
    nameEn: 'Anti-Dandruff Deep Clean Shampoo',
    nameAr: 'شامبو مكافح للقشرة - تنظيف عميق',
    descEn: 'Advanced zinc pyrithione formula eliminates dandruff and prevents recurrence. Soothes irritated scalp while deeply cleansing hair roots. Suitable for daily use.',
    descAr: 'تركيبة بيريثيون الزنك المتقدمة تقضي على القشرة وتمنع عودتها. يهدئ فروة الرأس المتهيجة مع تنظيف عميق لجذور الشعر. مناسب للاستخدام اليومي.',
    price: 49.99,
    originalPrice: 79.99,
    category: 'shampoo',
    sizes: ['200ml', '400ml', '800ml'],
    stock: 42,
    rating: 4.8,
    reviewCount: 237,
    isBestSeller: true,
    badge: '37% OFF',
    hairType: ['dandruff', 'oily'],
    concern: 'dandruff',
    images: [productImage1, productImage2]
  },
  {
    id: 'prod-2',
    slug: 'hydrating-conditioner',
    nameEn: 'Intensive Hydrating Conditioner',
    nameAr: 'بلسم مكثف للترطيب العميق',
    descEn: 'Deep moisture infusion with argan oil and keratin. Repairs damage, reduces frizz, and leaves hair silky smooth. For dry and damaged hair.',
    descAr: 'تغذية عميقة بزيت الأرغان والكيراتين. يصلح التلف ويقلل الكشكش ويمنح الشعر نعومة حريرية. للشعر الجاف والتالف.',
    price: 64.99,
    originalPrice: 89.99,
    category: 'conditioner',
    sizes: ['250ml', '500ml'],
    stock: 28,
    rating: 4.6,
    reviewCount: 184,
    isBestSeller: true,
    hairType: ['dry', 'damaged'],
    concern: 'dry',
    images: [productImage1, productImage2]
  },
  {
    id: 'prod-3',
    slug: 'hair-growth-oil',
    nameEn: 'Hair Growth Stimulating Oil',
    nameAr: 'زيت تحفيز نمو الشعر',
    descEn: 'Biotin-enriched hair growth oil with castor oil and rosemary extract. Stimulates dormant follicles, reduces hair fall, and promotes thick healthy growth.',
    descAr: 'زيت نمو الشعر المعزز بالبيوتين مع زيت الخروع ومستخلص إكليل الجبل. يحفز البصيلات الخاملة ويقلل تساقط الشعر ويعزز النمو الكثيف الصحي.',
    price: 39.99,
    category: 'hair-oil',
    sizes: ['100ml', '200ml'],
    stock: 55,
    rating: 4.9,
    reviewCount: 312,
    isNew: true,
    badge: 'جديد',
    hairType: ['all'],
    concern: 'hair-fall',
    images: [productImage1, productImage2]
  },
  {
    id: 'prod-4',
    slug: 'protein-hair-mask',
    nameEn: 'Keratin Protein Repair Mask',
    nameAr: 'قناع إصلاح بروتين الكيراتين',
    descEn: 'Professional-grade keratin mask that reconstructs broken protein bonds. Restores elasticity, adds shine, and eliminates frizz. Results visible from first use.',
    descAr: 'قناع الكيراتين بجودة احترافية يعيد بناء روابط البروتين المكسورة. يستعيد المرونة ويضيف اللمعان ويقضي على الكشكش. النتائج مرئية من الاستخدام الأول.',
    price: 44.99,
    originalPrice: 59.99,
    category: 'hair-mask',
    sizes: ['200g', '500g'],
    stock: 33,
    rating: 4.5,
    reviewCount: 98,
    hairType: ['damaged', 'frizzy'],
    concern: 'damage',
    images: [productImage1, productImage2]
  },
  {
    id: 'prod-5',
    slug: 'scalp-treatment-serum',
    nameEn: 'Scalp Balancing Treatment Serum',
    nameAr: 'مصل علاج فروة الرأس',
    descEn: 'Salicylic acid and tea tree oil scalp serum for oily scalp and excess sebum. Balances oil production while maintaining scalp health.',
    descAr: 'مصل فروة الرأس بحمض الساليسيليك وزيت شجرة الشاي للفروة الدهنية وزيادة الإفرازات. يوازن إنتاج الزهم مع الحفاظ على صحة فروة الرأس.',
    price: 34.99,
    category: 'scalp-care',
    sizes: ['50ml', '100ml'],
    stock: 67,
    rating: 4.7,
    reviewCount: 156,
    isBestSeller: true,
    hairType: ['oily'],
    concern: 'dandruff',
    images: [productImage1, productImage2]
  },
  {
    id: 'prod-6',
    slug: 'moisturizing-shampoo',
    nameEn: 'Moisture Boost Shampoo',
    nameAr: 'شامبو تعزيز الترطيب',
    descEn: 'Sulfate-free moisturizing shampoo with hyaluronic acid and aloe vera. Gently cleanses without stripping natural oils. Perfect for dry and curly hair.',
    descAr: 'شامبو مرطب خالٍ من الكبريتات مع حمض الهيالورونيك والألوفيرا. ينظف بلطف دون إزالة الزيوت الطبيعية. مثالي للشعر الجاف والمجعد.',
    price: 24.99,
    originalPrice: 34.99,
    category: 'shampoo',
    sizes: ['250ml', '500ml', '1000ml'],
    stock: 90,
    rating: 4.3,
    reviewCount: 74,
    badge: '29% OFF',
    hairType: ['dry', 'curly'],
    concern: 'dry',
    images: [productImage1, productImage2]
  },
  {
    id: 'prod-7',
    slug: 'argan-oil-treatment',
    nameEn: 'Moroccan Argan Oil Hair Treatment',
    nameAr: 'علاج بزيت الأرغان المغربي',
    descEn: 'Pure cold-pressed argan oil treatment for all hair types. Provides deep nourishment, UV protection, and frizz control. Lightweight, non-greasy formula.',
    descAr: 'علاج بزيت الأرغان النقي المضغوط على البارد لجميع أنواع الشعر. يوفر تغذية عميقة وحماية من الأشعة فوق البنفسجية والتحكم في الكشكش. تركيبة خفيفة وغير دهنية.',
    price: 59.99,
    category: 'treatment',
    sizes: ['100ml', '200ml'],
    stock: 21,
    rating: 4.8,
    reviewCount: 203,
    isNew: true,
    hairType: ['all'],
    concern: 'dry',
    images: [productImage1, productImage2]
  },
  {
    id: 'prod-8',
    slug: 'anti-hairfall-shampoo',
    nameEn: 'Anti Hair Fall Fortifying Shampoo',
    nameAr: 'شامبو مقاوم لتساقط الشعر',
    descEn: 'Caffeine and biotin enriched formula that strengthens hair from root to tip. Clinically tested to reduce hair fall by 80% in 4 weeks.',
    descAr: 'تركيبة مدعومة بالكافيين والبيوتين تقوي الشعر من الجذر إلى الطرف. مُجرَّب سريرياً على تقليل تساقط الشعر بنسبة 80% في 4 أسابيع.',
    price: 42.99,
    originalPrice: 52.99,
    category: 'shampoo',
    sizes: ['200ml', '400ml'],
    stock: 38,
    rating: 4.6,
    reviewCount: 147,
    hairType: ['all'],
    concern: 'hair-fall',
    images: [productImage1, productImage2]
  }
];

export const reviews: Review[] = [
  { id: 'rev-1', productId: 'prod-1', customer: 'أحمد م.', rating: 5, text: 'شامبو رائع! أزال القشرة تماماً في أسبوع.', date: '2026-08-01', approved: true },
  { id: 'rev-2', productId: 'prod-2', customer: 'ليلى ك.', rating: 4, text: 'يجعل شعري ناعماً جداً، وريحته منعشة.', date: '2026-07-28', approved: true }
];

export const orders: Order[] = [
  {
    id: 'ord-1',
    customerId: 'user-1',
    customer: 'Sarah Johnson',
    customerName: 'سارة جونسون',
    items: [{ productId: 'prod-1', productName: 'شامبو مكافح للقشرة - تنظيف عميق', size: '400ml', quantity: 2, price: 49.99 }],
    orderNumber: 'FL-2025-1847',
    total: 99.98,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: '2026-08-10T14:30:00Z',
    updatedAt: '2026-08-11T10:00:00Z'
  },
  {
    id: 'ord-2',
    customerId: 'user-2',
    customer: 'Fatima Al-Hassan',
    customerName: 'فاطمة الحسن',
    items: [
      { productId: 'prod-2', productName: 'بلسم مكثف للترطيب العميق', size: '250ml', quantity: 1, price: 64.99 },
      { productId: 'prod-6', productName: 'شامبو تعزيز الترطيب', size: '500ml', quantity: 1, price: 24.99 }
    ],
    orderNumber: 'FL-2025-1846',
    total: 89.98,
    status: 'processing',
    paymentStatus: 'paid',
    createdAt: '2026-08-12T09:15:00Z',
    updatedAt: '2026-08-12T12:00:00Z'
  },
  {
    id: 'ord-3',
    customerId: 'user-3',
    customer: 'Nour Abdelmaksoud',
    customerName: 'نور عبدالمقصود',
    items: [{ productId: 'prod-3', productName: 'زيت تحفيز نمو الشعر', size: '100ml', quantity: 1, price: 39.99 }],
    orderNumber: 'FL-2025-1845',
    total: 39.99,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: '2026-08-12T16:45:00Z',
    updatedAt: '2026-08-12T16:45:00Z'
  },
  {
    id: 'ord-4',
    customerId: 'user-4',
    customer: 'Maria Santos',
    customerName: 'ماريا سانتوس',
    items: [{ productId: 'prod-7', productName: 'علاج بزيت الأرغان المغربي', size: '100ml', quantity: 1, price: 59.99 }],
    orderNumber: 'FL-2025-1844',
    total: 59.99,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2026-08-08T11:20:00Z',
    updatedAt: '2026-08-10T15:00:00Z'
  }
];

export const notifications: NotificationItem[] = [
  { id: 'notif-1', title: 'تم شحن طلبك', message: 'طلبك رقم #FL-2025-1847 في الطريق إليك!', date: '2026-08-10', read: false, orderId: 'ord-1', type: 'order' },
  { id: 'notif-2', title: 'عرض خاص — خصم 40%!', message: 'خصومات مميزة لفترة محدودة على جميع الشامبوهات. تسوق الآن!', date: '2026-08-11', read: false, type: 'offer' },
  { id: 'notif-3', title: 'تم تأكيد طلبك', message: 'طلبك رقم #FL-2025-1846 تم تأكيده وجاري تجهيزه.', date: '2026-08-12', read: false, orderId: 'ord-2', type: 'order' },
  { id: 'notif-4', title: 'رد من خدمة العملاء', message: 'قام فريق الدعم بالرد على استفسارك.', date: '2026-08-09', read: true, type: 'chat' }
];
