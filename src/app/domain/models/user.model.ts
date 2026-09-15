import { UserRole, isStaffRole } from '../enums/user-role.enum';
export { isStaffRole };

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}
