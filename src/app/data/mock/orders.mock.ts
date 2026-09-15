export interface LegacyOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  country: string;
  notes: string;
  items: any[];
  subtotal: number;
  delivery: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shipmentCode?: string;
  createdAt: string;
  updatedAt: string;
}

export const orders: LegacyOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'FLR-2026-1847',
    customerId: 'user-1',
    customerName: 'Sarah Johnson',
    customerPhone: '+966 50 123 4567',
    customerEmail: 'sarah@flare.com',
    address: 'شارع التحلية، العليا',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    notes: 'يرجى الاتصال قبل التوصيل',
    items: [
      {
        productId: 'prod-1',
        productName: 'شامبو مكافح للقشرة - تنظيف عميق',
        productImage: '/assets/images/products/shampoo/shampoo-dandruff.png',
        size: '400ml',
        quantity: 1,
        price: 49.99,
      },
    ],
    subtotal: 49.99,
    delivery: 15.00,
    total: 64.99,
    status: 'shipped',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    shipmentCode: 'SMSA-882910-FLR',
    createdAt: '2026-08-20T14:32:00Z',
    updatedAt: '2026-08-22T09:15:00Z',
  },
  {
    id: 'ord-2',
    orderNumber: 'FLR-2026-1846',
    customerId: 'user-2',
    customerName: 'فاطمة الحسن',
    customerPhone: '+966 55 234 5678',
    customerEmail: 'fatima@flare.com',
    address: 'حي الروضة، طريق الملك',
    city: 'جدة',
    country: 'المملكة العربية السعودية',
    notes: '',
    items: [
      {
        productId: 'prod-2',
        productName: 'بلسم مكثف للترطيب العميق',
        productImage: '/assets/images/products/shampoo/temp.png',
        size: '500ml',
        quantity: 1,
        price: 64.99,
      },
    ],
    subtotal: 64.99,
    delivery: 0,
    total: 64.99,
    status: 'confirmed',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    createdAt: '2026-08-21T10:05:00Z',
    updatedAt: '2026-08-21T16:30:00Z',
  },
];
