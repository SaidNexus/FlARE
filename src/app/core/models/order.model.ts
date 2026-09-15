import { Product } from './product.model';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  name?: string;
  size?: string;
  quantity: number;
  qty?: number;
  price: number;
  unitPrice?: number;
  image?: string;
  productImage?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customer?: string;
  customerName?: string;
  phone?: string;
  country?: string;
  city?: string;
  area?: string;
  address?: string;
  notes?: string;
  gender?: string;
  paymentMethod?: string;
  paymentStatus?: 'paid' | 'unpaid' | 'pending';
  deliveryCompany?: string;
  estimatedDelivery?: string;
  shipmentCode?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | string;
  items: OrderItem[];
  subtotal?: number;
  shipping?: number;
  shippingCost?: number;
  discount?: number;
  total: number;
  bankTransferReceipt?: {
    name: string;
    type?: string;
    dataUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface TrackedOrderHistoryEntry {
  id: string;
  timestamp: string;
  fieldName: string;
  oldValue: any;
  newValue: any;
  updater?: {
    name: string;
    avatar?: string;
  };
}

export type {
  TrackedOrder,
  TrackedOrderStatus,
  TrackedOrderPaymentStatus,
  TrackedOrderGender,
  TrackedOrderStatusUpdater,
  TrackedOrderViewerEntry,
  BankTransferReceipt,
  TrackedOrderItem,
} from '../../domain/models/order.model';

