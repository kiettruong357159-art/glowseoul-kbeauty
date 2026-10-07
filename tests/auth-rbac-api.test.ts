import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

describe('Authentication Core and RBAC API Endpoints', () => {
  it('correctly hashes and verifies passwords using salt and pbkdf2', () => {
    const raw = 'my-secret-password-123';
    const hash = hashPassword(raw);
    expect(hash).toContain(':');
    expect(verifyPassword(raw, hash)).toBe(true);
    expect(verifyPassword('wrong-password', hash)).toBe(false);
  });

  it('creates and verifies cryptographically signed session tokens', () => {
    const payload = {
      userId: 'usr_123',
      email: 'admin@glowseoul.vn',
      name: 'Admin Test',
      role: 'ADMIN',
    };
    const token = createSessionToken(payload);
    expect(token).toContain('.');
    const decoded = verifySessionToken(token);
    expect(decoded).toBeDefined();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.role).toBe('ADMIN');

    // Tampered token fails
    const tampered = token.slice(0, -3) + 'abc';
    expect(verifySessionToken(tampered)).toBeNull();
  });

  it('POST /api/auth/login validates credentials and denies customer access to admin portal', async () => {
    const { POST } = await import('@/app/api/auth/login/route');

    // 1. Wrong password fails
    const badReq = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@glowseoul.vn', password: 'wrong' }),
    });
    const badRes = await POST(badReq);
    expect(badRes.status).toBe(401);

    // 2. Customer trying to log into admin portal gets 403 Forbidden
    const custAdminReq = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@glowseoul.vn',
        password: 'customer123',
        portal: 'admin',
      }),
    });
    const custAdminRes = await POST(custAdminReq);
    expect(custAdminRes.status).toBe(403);
    const custData = await custAdminRes.json();
    expect(custData.error).toContain('không có quyền truy cập');

    // 3. Admin login into admin portal succeeds and sets HttpOnly cookie
    const adminReq = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@glowseoul.vn',
        password: 'admin123',
        portal: 'admin',
      }),
    });
    const adminRes = await POST(adminReq);
    expect(adminRes.status).toBe(200);
    const adminData = await adminRes.json();
    expect(adminData.user.role).toBe('ADMIN');
    expect(adminData.user.password).toBeUndefined(); // Sensitive field omitted

    const setCookie = adminRes.headers.get('set-cookie');
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain(SESSION_COOKIE_NAME);
    expect(setCookie).toContain('HttpOnly');
  });

  it('GET /api/auth/me returns current authenticated session user and POST /api/auth/logout clears session', async () => {
    const { POST: loginPOST } = await import('@/app/api/auth/login/route');
    const { GET: meGET } = await import('@/app/api/auth/me/route');
    const { POST: logoutPOST } = await import('@/app/api/auth/logout/route');

    // Login as staff
    const staffReq = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'staff@glowseoul.vn', password: 'staff123' }),
    });
    const staffRes = await loginPOST(staffReq);
    const setCookie = staffRes.headers.get('set-cookie');
    expect(setCookie).toBeDefined();
    const cookieHeader = setCookie?.split(';')[0] || '';

    // Call /api/auth/me with cookie
    const meReq = new NextRequest('http://localhost:3000/api/auth/me', {
      headers: { Cookie: cookieHeader },
    });
    const meRes = await meGET(meReq);
    expect(meRes.status).toBe(200);
    const meData = await meRes.json();
    expect(meData.user.email).toBe('staff@glowseoul.vn');
    expect(meData.user.role).toBe('STAFF');

    // Call logout
    const logoutReq = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      headers: { Cookie: cookieHeader },
    });
    const logoutRes = await logoutPOST(logoutReq);
    expect(logoutRes.status).toBe(200);
    const logoutCookie = logoutRes.headers.get('set-cookie');
    expect(logoutCookie).toContain('Max-Age=0');
  });
});
