import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Responsive Global CSS Utilities', () => {
  it('defines mobile breakpoints and visibility utilities', () => {
    const cssPath = path.resolve(__dirname, '../src/app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    expect(cssContent).toContain('@media (max-width: 767px)');
    expect(cssContent).toContain('.hide-on-mobile');
    expect(cssContent).toContain('.show-on-mobile');
    expect(cssContent).toContain('.show-on-mobile-flex');
  });
});
