import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Dedicated Login Screen UI (/admin/login)', () => {
  it('verifies admin login page component exists with glassmorphism layout, credentials form, and demo buttons', () => {
    const loginPagePath = path.resolve(__dirname, '../src/app/admin/login/page.tsx');
    expect(fs.existsSync(loginPagePath)).toBe(true);
    const content = fs.readFileSync(loginPagePath, 'utf-8');

    // Branding & Header
    expect(content).toContain('GlowSeoul');
    expect(content).toContain('Admin');
    expect(content).toContain('Cổng Quản Trị');

    // Form inputs
    expect(content).toContain('type="email"');
    expect(content).toContain("showPassword ? 'text' : 'password'");
    expect(content).toContain('email');
    expect(content).toContain('password');

    // 1-Click Quick Demo Login buttons for fast testing
    expect(content).toContain('admin@glowseoul.vn');
    expect(content).toContain('staff@glowseoul.vn');
    expect(content).toContain('Điền Admin');
    expect(content).toContain('Điền Staff');

    // Portal check: passes 'admin' to login
    expect(content).toContain("'admin'");

    // Link back to storefront
    expect(content).toContain('Về cửa hàng');
    expect(content).toContain('href="/"');
  });
});
