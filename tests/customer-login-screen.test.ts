import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Storefront Customer Login Screen UI (/login)', () => {
  it('verifies customer login page component exists with K-Beauty storefront layout', () => {
    const loginPath = path.resolve(__dirname, '../src/app/login/page.tsx');
    expect(fs.existsSync(loginPath)).toBe(true);
    const content = fs.readFileSync(loginPath, 'utf-8');

    // Branding & Header
    expect(content).toContain('GlowSeoul');
    expect(content).toContain('Đăng Nhập');

    // Form inputs
    expect(content).toContain('type="email"');
    expect(content).toContain("showPassword ? 'text' : 'password'");
    expect(content).toContain('email');
    expect(content).toContain('password');

    // Quick demo customer fill
    expect(content).toContain('customer@glowseoul.vn');
    expect(content).toContain('Điền Khách Hàng');

    // Link back to home
    expect(content).toContain('href="/"');
    expect(content).toContain('Tiếp tục mua sắm');
  });
});
