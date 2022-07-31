export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer'
}