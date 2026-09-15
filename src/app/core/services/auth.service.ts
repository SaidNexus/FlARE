import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

const MOCK_USERS: (User & { passwords?: string[] })[] = [
  {
    id: 'user-1',
    email: 'user@flare.com',
    passwords: ['password', '123456'],
    name: 'Sarah Johnson',
    nameAr: 'سارة جونسون',
    phone: '+966 50 123 4567',
    role: 'customer',
  },
  {
    id: 'admin-1',
    email: 'admin@flare.com',
    passwords: ['admin', '123456', 'password'],
    name: 'FLARE Admin',
    nameAr: 'مدير فلير',
    phone: '',
    role: 'admin',
  },
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  async login(email: string, password: string): Promise<User> {
    const found = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        (u.passwords ? u.passwords.includes(password) : true)
    );
    if (!found) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    const { passwords: _, ...safeUser } = found;
    return safeUser as User;
  }

  async getProfile(userId: string): Promise<User> {
    const found = MOCK_USERS.find((u) => u.id === userId);
    if (!found) {
      throw new Error('User not found');
    }
    const { passwords: _, ...safeUser } = found;
    return safeUser as User;
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const userIndex = MOCK_USERS.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...updates };
    }
    return { id: userId, ...updates } as User;
  }
}
