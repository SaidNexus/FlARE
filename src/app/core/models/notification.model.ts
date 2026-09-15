export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date?: string;
  createdAt?: string;
  read: boolean;
  orderId?: string;
  type?: 'order' | 'offer' | 'chat' | 'general' | string;
}
