import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Storefront Auth Integration (Header & Mobile Drawer)', () => {
  it('verifies Header includes useAuth, customer login link and logout action', () => {
    const headerPath = path.resolve(__dirname, '../src/components/layout/Header.tsx');
    expect(fs.existsSync(headerPath)).toBe(true);
    const content = fs.readFileSync(headerPath, 'utf-8');

    expect(content).toContain('useAuth');
    expect(content).toContain('/login');
    expect(content).toContain('logout');
    expect(content).toContain('Đăng nhập');
  });

  it('verifies MobileNavDrawer includes user status, admin link for privileged users and login/logout', () => {
    const drawerPath = path.resolve(__dirname, '../src/components/layout/MobileNavDrawer.tsx');
    expect(fs.existsSync(drawerPath)).toBe(true);
    const content = fs.readFileSync(drawerPath, 'utf-8');

    expect(content).toContain('useAuth');
    expect(content).toContain('/login');
    expect(content).toContain('logout');
    expect(content).toContain('/admin');
  });
});
