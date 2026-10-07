import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin User Management & Header Logout Integration', () => {
  it('verifies UserManager component exists with standard controls, role switcher and active toggle', () => {
    const userManagerPath = path.resolve(__dirname, '../src/components/admin/UserManager.tsx');
    expect(fs.existsSync(userManagerPath)).toBe(true);
    const content = fs.readFileSync(userManagerPath, 'utf-8');

    expect(content).toContain('UserManager');
    expect(content).toContain('CustomSelect');
    expect(content).toContain('Search');
    expect(content).toContain('Pagination');
    expect(content).toContain('handleRoleChange');
    expect(content).toContain('handleToggleActive');
  });

  it('verifies AdminHeader contains user profile display and logout button', () => {
    const headerPath = path.resolve(__dirname, '../src/components/admin/AdminHeader.tsx');
    expect(fs.existsSync(headerPath)).toBe(true);
    const content = fs.readFileSync(headerPath, 'utf-8');

    expect(content).toContain('useAuth');
    expect(content).toContain('logout');
    expect(content).toContain('Đăng xuất');
    expect(content).toContain('LogOut');
  });

  it('verifies AdminSidebar includes users tab for accounts and RBAC', () => {
    const sidebarPath = path.resolve(__dirname, '../src/components/admin/AdminSidebar.tsx');
    expect(fs.existsSync(sidebarPath)).toBe(true);
    const content = fs.readFileSync(sidebarPath, 'utf-8');

    expect(content).toContain('users');
    expect(content).toContain('Tài khoản & Phân quyền');
  });

  it('verifies Admin main page incorporates users tab and UserManager component', () => {
    const adminPagePath = path.resolve(__dirname, '../src/app/admin/page.tsx');
    expect(fs.existsSync(adminPagePath)).toBe(true);
    const content = fs.readFileSync(adminPagePath, 'utf-8');

    expect(content).toContain('UserManager');
    expect(content).toContain('users');
  });
});
