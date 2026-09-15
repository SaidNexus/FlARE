import { Review } from '../../domain/models/product.model';

export const reviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Sarah M.',
    rating: 5,
    comment: 'منتج ممتاز جداً! أوقف تساقط الشعر والقشرة في أقل من أسبوعين وترك شعري ناعماً وصحياً.',
    date: '2026-08-15',
    approved: true,
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'فاطمة أحمد',
    rating: 5,
    comment: 'أفضل شامبو استخدمته للعناية بالشعر، رائحته لطيفة وفروة الرأس أصبحت نظيفة ومنتعشة.',
    date: '2026-08-10',
    approved: true,
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userName: 'نور خليل',
    rating: 5,
    comment: 'البلسم مذهل ومرطب قوي جداً، الشعر أصبح سلس وسهل التسريح وخف الكشكش تماماً.',
    date: '2026-08-20',
    approved: true,
  },
  {
    id: 'rev-4',
    productId: 'prod-3',
    userName: 'أمل العتيبي',
    rating: 5,
    comment: 'ماسك الكيراتين أعاد الحيوية لشعري التالف بعد الصبغة. جودة تستحق كل ريال.',
    date: '2026-08-18',
    approved: true,
  },
];
