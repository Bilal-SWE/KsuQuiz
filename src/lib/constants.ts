export const APP_NAME = 'KSU Quiz';

export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
