export interface User {
  id: string;
  email: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  phone?: string;
  role: 'customer' | 'admin' | 'manager' | 'sales';
  city?: string;
  country?: string;
}

export interface StaffAccount {
  id: string;
  name: string;
  roleLabel: string;
  email: string;
  avatar: string | null;
}
