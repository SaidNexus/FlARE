import { Injectable } from '@angular/core';

const STAFF_DEVICE_KEY = 'lk-known-staff-device';
const STAFF_DEVICE_EVENT = 'lk-staff-device-changed';

export function isStaffRole(role?: string): boolean {
  return role === 'admin' || role === 'manager' || role === 'sales';
}

@Injectable({
  providedIn: 'root',
})
export class StaffAccessService {
  isKnownStaffDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STAFF_DEVICE_KEY) === 'true';
  }

  markKnownStaffDevice(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STAFF_DEVICE_KEY, 'true');
    window.dispatchEvent(new Event(STAFF_DEVICE_EVENT));
  }

  forgetKnownStaffDevice(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STAFF_DEVICE_KEY);
    window.dispatchEvent(new Event(STAFF_DEVICE_EVENT));
  }

  subscribeToStaffDevice(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STAFF_DEVICE_KEY) callback();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener(STAFF_DEVICE_EVENT, callback);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(STAFF_DEVICE_EVENT, callback);
    };
  }
}
