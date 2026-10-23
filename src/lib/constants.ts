export const APP_NAME = 'منصة التدريب';

export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
