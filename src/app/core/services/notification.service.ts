import { Injectable } from '@angular/core';
import { NotificationItem } from '../models/notification.model';
import { notifications as mockNotifications } from '../data/mock-data';

const KEY = 'flare-notifications';

function getStored(): NotificationItem[] | null {
  try {
    const s = localStorage.getItem(KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function save(notifs: NotificationItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(notifs));
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  async getNotifications(): Promise<NotificationItem[]> {
    const stored = getStored();
    return stored || [...mockNotifications];
  }

  async markRead(id: string): Promise<NotificationItem[]> {
    const notifs = getStored() || [...mockNotifications];
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    save(updated);
    return updated;
  }

  async markAllRead(): Promise<NotificationItem[]> {
    const notifs = getStored() || [...mockNotifications];
    const updated = notifs.map((n) => ({ ...n, read: true }));
    save(updated);
    return updated;
  }

  async clear(): Promise<NotificationItem[]> {
    save([]);
    return [];
  }
}
