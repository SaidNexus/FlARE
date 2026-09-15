export interface NotificationItem {
  id: string;
  type: 'order' | 'chat' | 'offer' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  orderId?: string;
}

export const notifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'NOTIFICATIONS.ORDER_SHIPPED_TITLE',
    message: 'NOTIFICATIONS.ORDER_SHIPPED_MSG',
    read: false,
    createdAt: '2026-08-22T09:20:00Z',
    orderId: 'ord-1',
  },
  {
    id: 'notif-2',
    type: 'offer',
    title: 'NOTIFICATIONS.FLASH_SALE_TITLE',
    message: 'NOTIFICATIONS.FLASH_SALE_MSG',
    read: false,
    createdAt: '2026-08-21T12:00:00Z',
  },
];

export const chatMessages = [
  { id: 'm-1', sender: 'user', text: 'مرحباً! أود الاستفسار عن الشامبو المناسب للشعر الجاف.', time: '14:20', read: true },
  { id: 'm-2', sender: 'support', text: 'أهلاً بك! نسعد بمساعدتك. ننصحك ببلسم الترطيب المكثف وماسك الكيراتين.', time: '14:23', read: true },
];

export const adminChatInbox = [
  { id: 'conv-1', name: 'سارة جونسون', avatar: 'س', lastMessage: 'شكراً جزيلاً!', time: '14:32', unread: 0, online: true },
  { id: 'conv-2', name: 'فاطمة الحسن', avatar: 'ف', lastMessage: 'متى يصل طلبي؟', time: '13:45', unread: 2, online: false },
];
