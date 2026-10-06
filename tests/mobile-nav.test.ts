import { describe, it, expect } from 'vitest';
import MobileNavDrawer from '../src/components/layout/MobileNavDrawer';

describe('MobileNavDrawer Component', () => {
  it('exports MobileNavDrawer as a valid React component', () => {
    expect(typeof MobileNavDrawer).toBe('function');
  });
});
