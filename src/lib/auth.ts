import crypto from 'crypto';
import { prisma } from './db';

const SESSION_SECRET = process.env.SESSION_SECRET || 'glowseoul-kbeauty-super-secure-secret-key-2026';
export const SESSION_COOKIE_NAME = 'glowseoul_session';

/**
 * Hash a password using PBKDF2 with a random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a plain password against a stored salt:hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
  expiresAt: number;
}

/**
 * Create a signed session token
 */
export function createSessionToken(data: Omit<SessionData, 'expiresAt'>, maxAgeDays = 7): string {
  const expiresAt = Date.now() + maxAgeDays * 24 * 60 * 60 * 1000;
  const payload: SessionData = { ...data, expiresAt };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');
  return `${payloadBase64}.${signature}`;
}

/**
 * Verify and decode a signed session token
 */
export function verifySessionToken(token: string): SessionData | null {
  if (!token || !token.includes('.')) return null;
  const [payloadBase64, signature] = token.split('.');
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const payload: SessionData = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf-8'));
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Helper to get current authenticated user from cookie in API handlers or server components
 */
export async function getCurrentUserFromCookie(cookieHeader?: string | null) {
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) return null;

  const session = verifySessionToken(token);
  if (!session) return null;

  // Retrieve fresh user and role info from DB
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { role: true },
  });

  if (!user || !user.isActive) return null;

  let permissions: string[] = [];
  try {
    permissions = JSON.parse(user.role.permissions || '[]');
  } catch {
    permissions = [];
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    phone: user.phone,
    role: user.role.name,
    roleDisplayName: user.role.displayName,
    permissions,
  };
}
