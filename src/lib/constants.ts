export const APP_NAME = 'KSU Quiz';

// Shown publicly on the contact, privacy, and refund pages when set.
export const CONTACT_EMAIL = '';

export const PUBLIC_PAGES = [
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'اتصل بنا' },
  { href: '/privacy', label: 'سياسة الخصوصية' },
  { href: '/refund', label: 'سياسة الاسترجاع' },
] as const;

export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
