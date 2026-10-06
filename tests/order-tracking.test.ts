import { describe, it, expect } from 'vitest';
import { getOrderStatusStep } from '../src/components/order/OrderStatusTracker';

describe('Order Status Step Helper', () => {
  it('returns step index 0 for confirmed, 1 for preparing, 2 for shipping, 3 for completed', () => {
    expect(getOrderStatusStep('confirmed')).toBe(0);
    expect(getOrderStatusStep('preparing')).toBe(1);
    expect(getOrderStatusStep('shipping')).toBe(2);
    expect(getOrderStatusStep('completed')).toBe(3);
  });

  it('defaults to 0 for unknown statuses', () => {
    expect(getOrderStatusStep('unknown')).toBe(0);
  });
});
