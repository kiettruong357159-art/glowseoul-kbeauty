import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Admin Beautiful Page Size Custom Select in Pagination', () => {
  it('verifies Pagination component has custom select dropdown for page sizes instead of unstyled native select', () => {
    const filePath = path.resolve(__dirname, '../src/components/ui/Pagination.tsx');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf-8');
    // Has custom select state and icons
    expect(content).toContain('isDropdownOpen');
    expect(content).toContain('ChevronDown');
    expect(content).toContain('Check');
    // Formats with itemLabel / trang
    expect(content).toContain('itemLabel');
    expect(content).toContain('/ trang');
  });

  it('verifies admin managers pass descriptive itemLabels to Pagination', () => {
    const productList = fs.readFileSync(path.resolve(__dirname, '../src/components/admin/ProductListTable.tsx'), 'utf-8');
    expect(productList).toContain('itemLabel="sản phẩm"');

    const catManager = fs.readFileSync(path.resolve(__dirname, '../src/components/admin/CategoryManager.tsx'), 'utf-8');
    expect(catManager).toContain('itemLabel="danh mục"');

    const brandManager = fs.readFileSync(path.resolve(__dirname, '../src/components/admin/BrandManager.tsx'), 'utf-8');
    expect(brandManager).toContain('itemLabel="thương hiệu"');

    const couponManager = fs.readFileSync(path.resolve(__dirname, '../src/components/admin/CouponManager.tsx'), 'utf-8');
    expect(couponManager).toContain('itemLabel="mã voucher"');

    const orderManager = fs.readFileSync(path.resolve(__dirname, '../src/components/admin/OrderManager.tsx'), 'utf-8');
    expect(orderManager).toContain('itemLabel="đơn hàng"');
  });
});
