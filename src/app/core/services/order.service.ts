import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { orders as mockOrders } from '../data/mock-data';

const ORDERS_KEY = 'flare-user-orders';

function getStoredOrders(): Order[] {
  try {
    const s = localStorage.getItem(ORDERS_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  async getMyOrders(userId?: string): Promise<Order[]> {
    const stored = getStoredOrders();
    if (stored.length > 0) return stored;
    return mockOrders.filter(
      (o) => o.customerId === userId || userId === 'guest-demo' || !userId
    );
  }

  async getOrder(orderId: string): Promise<Order> {
    const stored = getStoredOrders();
    const all = [...stored, ...mockOrders];
    const order = all.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async placeOrder(orderData: Partial<Order>): Promise<Order> {
    const stored = getStoredOrders();
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: 'FL-2026-' + Math.floor(1000 + Math.random() * 9000),
      items: [],
      total: 0,
      ...orderData,
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    stored.unshift(newOrder);
    saveOrders(stored);
    return newOrder;
  }
}
