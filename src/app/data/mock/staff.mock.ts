import { StaffAccount } from '../../domain/models/staff-account.model';

export const DEFAULT_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'staff-admin',
    name: 'أحمد الإداري',
    email: 'admin@flare.com',
    role: 'admin',
    roleLabel: 'مدير النظام',
  },
  {
    id: 'staff-sales-1',
    name: 'سارة الموظفة',
    email: 'sales@flare.com',
    role: 'sales',
    roleLabel: 'مسؤول مبيعات',
  },
];
