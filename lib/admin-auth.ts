// lib/admin-auth.ts
// Simple hardcoded admin auth. Replace with proper auth in production.

export const ADMIN_EMAIL = "admin@hypsoul.in";
export const ADMIN_PASSWORD = "admin123";
export const SESSION_COOKIE = "hypsoul_admin_session";
export const SESSION_SECRET = "hypsoul-admin-secret-2024";

export function isValidAdmin(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}
