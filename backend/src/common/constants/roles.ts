export const ROLE_CODES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;

export type RoleCode = (typeof ROLE_CODES)[keyof typeof ROLE_CODES];