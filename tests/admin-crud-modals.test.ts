import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Pop-up Modal Dialogs for Create & Edit', () => {
  it('verifies CategoryManager uses a pop-up modal for adding and editing categories instead of an inline form', () => {
    const file = path.resolve(__dirname, '../src/components/admin/CategoryManager.tsx');
    expect(fs.existsSync(file)).toBe(true);
    const content = fs.readFileSync(file, 'utf-8');
    // Has modal state
    expect(content).toContain('isModalOpen');
    expect(content).toContain('editingCategory');
    // Has edit button with Pencil icon
    expect(content).toContain('Pencil');
    // Has open modal triggers
    expect(content).toContain('setIsModalOpen(true)');
    // Modal dialog elements
    expect(content).toContain('fixed');
    expect(content).toContain('backdropFilter');
    expect(content).toContain('Chỉnh sửa danh mục');
    expect(content).toContain('Thêm danh mục');
  });

  it('verifies BrandManager uses a pop-up modal for adding and editing brands instead of an inline form', () => {
    const file = path.resolve(__dirname, '../src/components/admin/BrandManager.tsx');
    expect(fs.existsSync(file)).toBe(true);
    const content = fs.readFileSync(file, 'utf-8');
    // Has modal state
    expect(content).toContain('isModalOpen');
    expect(content).toContain('editingBrand');
    // Has edit button with Pencil icon
    expect(content).toContain('Pencil');
    // Has open modal triggers
    expect(content).toContain('setIsModalOpen(true)');
    // Modal dialog elements
    expect(content).toContain('fixed');
    expect(content).toContain('backdropFilter');
    expect(content).toContain('Chỉnh sửa thương hiệu');
    expect(content).toContain('Thêm thương hiệu');
  });

  it('verifies CouponManager uses a pop-up modal for adding and editing coupons instead of an inline form', () => {
    const file = path.resolve(__dirname, '../src/components/admin/CouponManager.tsx');
    expect(fs.existsSync(file)).toBe(true);
    const content = fs.readFileSync(file, 'utf-8');
    // Has modal state
    expect(content).toContain('isModalOpen');
    expect(content).toContain('editingCoupon');
    // Has edit button with Pencil icon
    expect(content).toContain('Pencil');
    // Has open modal triggers
    expect(content).toContain('setIsModalOpen(true)');
    // Modal dialog elements
    expect(content).toContain('fixed');
    expect(content).toContain('backdropFilter');
    expect(content).toContain('Chỉnh sửa mã voucher');
    expect(content).toContain('Tạo mã voucher mới');
  });
});
