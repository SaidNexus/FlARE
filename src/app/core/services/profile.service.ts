import { Injectable } from '@angular/core';

export interface UserAddress {
  id: number;
  title: string;
  address: string;
  isDefault: boolean;
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  addresses: UserAddress[];
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  async getProfile(): Promise<UserProfileData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: 'عميل FLARE',
          email: 'customer@flare.com',
          phone: '0500000000',
          addresses: [
            { id: 1, title: 'المنزل', address: 'الرياض, حي الملقا', isDefault: true },
          ],
        });
      }, 100);
    });
  }

  async updateProfile(data: any): Promise<{ success: boolean; data: any }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data });
      }, 200);
    });
  }
}
