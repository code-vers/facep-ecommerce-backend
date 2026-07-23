export type UserRole = 'BUYER' | 'VENDOR' | 'ADMIN';

export interface IAuthUser {
  userId: string;
  email: string;
  role: UserRole;
}
