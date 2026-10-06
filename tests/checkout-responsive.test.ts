import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Checkout and Cart Responsive Constraints', () => {
  it('verifies CartDrawer uses 100vw or min-width for mobile screens', () => {
    const cartPath = path.resolve(__dirname, '../src/components/cart/CartDrawer.tsx');
    const content = fs.readFileSync(cartPath, 'utf-8');
    expect(content).toContain('100vw');
  });

  it('verifies Checkout page uses responsive-grid-1 for mobile form stacking', () => {
    const checkoutPath = path.resolve(__dirname, '../src/app/checkout/page.tsx');
    const content = fs.readFileSync(checkoutPath, 'utf-8');
    expect(content).toContain('responsive-grid-1');
  });
});
