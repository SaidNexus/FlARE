import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';

const TRACKED_ORDERS_STORAGE_KEY = 'lk-completed-orders';
const TRACKED_ORDERS_UPDATED_EVENT = 'lk-completed-orders-updated';

export const STATUS_LABELS: Record<string, string> = {
  'pending-approval': 'قيد الاعتماد',
  confirmed: 'طلب جديد',
  preparing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  'out-for-delivery': 'قيد التوصيل',
  delivered: 'تم التسليم',
  postponed: 'طلب مؤجل',
  cancelled: 'ملغى',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid: 'تم الدفع',
  unpaid: 'غير مدفوع',
};

@Injectable({
  providedIn: 'root',
})
export class OrderTrackingService {
  createTrackedOrderId(): string {
    return 'ord-' + Date.now();
  }

  getTrackedOrders(): Order[] {
    try {
      const stored = localStorage.getItem(TRACKED_ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  getTrackedOrderById(id: string): Order | undefined {
    const orders = this.getTrackedOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id);
  }

  saveTrackedOrder(order: Order): void {
    const orders = this.getTrackedOrders();
    const existingIndex = orders.findIndex(
      (o) => o.id === order.id || o.orderNumber === order.orderNumber
    );
    if (existingIndex >= 0) {
      orders[existingIndex] = { ...orders[existingIndex], ...order };
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(TRACKED_ORDERS_STORAGE_KEY, JSON.stringify(orders));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(TRACKED_ORDERS_UPDATED_EVENT));
    }
  }

  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(TRACKED_ORDERS_UPDATED_EVENT, callback);
    window.addEventListener('storage', callback);
    return () => {
      window.removeEventListener(TRACKED_ORDERS_UPDATED_EVENT, callback);
      window.removeEventListener('storage', callback);
    };
  }
}
