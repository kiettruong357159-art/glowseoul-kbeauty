import { describe, it, expect } from 'vitest';
import { calculateCartTotals } from '../src/context/CartContext';

describe('Cart Calculation Logic', () => {
  it('calculates correct subtotal, shipping fee, and free shipping progress', () => {
    const items = [
      { id: '1', name: 'COSRX Essence', price: 250000, quantity: 1, image: '' },
      { id: '2', name: 'Laneige Mask', price: 100000, quantity: 1, image: '' },
    ];
    const { subtotal, shippingFee, freeShippingRemaining } = calculateCartTotals(items);
    expect(subtotal).toBe(350000);
    expect(shippingFee).toBe(30000); // Under 399.000đ threshold
    expect(freeShippingRemaining).toBe(49000);
  });

  it('provides free shipping when subtotal is 399.000đ or more', () => {
    const items = [
      { id: '1', name: 'Innisfree Serum', price: 490000, quantity: 1, image: '' },
    ];
    const { subtotal, shippingFee, freeShippingRemaining } = calculateCartTotals(items);
    expect(subtotal).toBe(490000);
    expect(shippingFee).toBe(0);
    expect(freeShippingRemaining).toBe(0);
  });
});
