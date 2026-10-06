import { describe, it, expect } from 'vitest';
import MobileFilterDrawer from '../src/components/product/MobileFilterDrawer';

describe('MobileFilterDrawer Component', () => {
  it('exports MobileFilterDrawer as a valid React component', () => {
    expect(typeof MobileFilterDrawer).toBe('function');
  });
});
