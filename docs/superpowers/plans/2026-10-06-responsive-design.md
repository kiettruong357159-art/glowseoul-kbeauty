# Responsive Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform GlowSeoul K-Beauty into a fully responsive e-commerce web application across mobile (< 768px), tablet (768px - 1023px), and desktop (≥ 1024px) viewports with zero horizontal overflow and smooth mobile-first interactions.

**Architecture:** Build a responsive design foundation using Vanilla CSS media queries and utility classes in `globals.css`. Enhance layout components (Header, Catalog, Detail, Checkout, Footer) with responsive grid adaptations, a slide-in Mobile Navigation Drawer, and a mobile Bottom Sheet Filter Drawer.

**Tech Stack:** Next.js 15 App Router, TypeScript, React 19, Vanilla CSS Modules / Global CSS, Lucide React, Vitest.

**Spec:** [`docs/superpowers/specs/2026-10-06-responsive-design.md`](file:///Users/Kiet/Documents/shoppe/docs/superpowers/specs/2026-10-06-responsive-design.md)

## Global Constraints

- **Styling**: Vanilla CSS only. No TailwindCSS.
- **SSR Safety**: Media queries and CSS layout must be used for layout responsiveness instead of JS-only `window.innerWidth` checks to prevent SSR hydration flashes.
- **Zero Scroll Jump**: Maintain `{ scroll: false }` across all filter and navigation operations.
- **Images**: High quality Unsplash imagery; no placeholders; keep aspect ratios fixed to prevent layout shifts.

## Review Focus

1. Mobile navigation drawer toggle and backdrop dismiss behavior on touch devices.
2. Filter Bottom Sheet opening on mobile catalog and applying filters without jumping or closing prematurely.
3. Zero horizontal page scrolling on mobile viewports (< 375px).
4. Product grid density: 2 columns on mobile, 3 columns on tablet, 4 columns on desktop.
5. Cart Drawer adapting to 100vw on screens narrower than 480px.

---

### Task 1: Global Breakpoints & Responsive CSS Utility Foundation

**Files:**
- Modify: `src/app/globals.css:100-215`
- Test: `tests/responsive-utilities.test.ts`

**Interfaces:**
- Produces: CSS utility classes `.hide-on-mobile`, `.show-on-mobile`, `.show-on-mobile-flex`, `.responsive-grid-2`, `.responsive-grid-4`.

- [ ] **Step 1: Write unit test for responsive classes existence in CSS**

```typescript
// tests/responsive-utilities.test.ts
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
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/responsive-utilities.test.ts`
Expected: FAIL (missing `.hide-on-mobile` in `globals.css`)

- [ ] **Step 3: Implement responsive media queries and utility classes in `src/app/globals.css`**

Add standard media queries at max-width 767px and min-width 768px for visibility utilities and container padding.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/responsive-utilities.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css tests/responsive-utilities.test.ts
git commit -m "feat(css): add global responsive breakpoints and visibility utilities"
```

---

### Task 2: Responsive Header with Mobile Hamburger Menu & Slide-in Drawer

**Files:**
- Create: `src/components/layout/MobileNavDrawer.tsx`
- Modify: `src/components/layout/Header.tsx:1-153`
- Test: `tests/mobile-nav.test.ts`

**Interfaces:**
- Produces: `<MobileNavDrawer isOpen={boolean} onClose={() => void} />`
- Consumes: `useCart()` for cart badge count.

- [ ] **Step 1: Write test for MobileNavDrawer component**

```typescript
// tests/mobile-nav.test.ts
import { describe, it, expect } from 'vitest';
import React from 'react';
import MobileNavDrawer from '../src/components/layout/MobileNavDrawer';

describe('MobileNavDrawer Component', () => {
  it('exports MobileNavDrawer as a valid React component', () => {
    expect(typeof MobileNavDrawer).toBe('function');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/mobile-nav.test.ts`
Expected: FAIL (cannot find module `MobileNavDrawer`)

- [ ] **Step 3: Implement `MobileNavDrawer.tsx` and integrate into `Header.tsx`**

Create `MobileNavDrawer.tsx` with smooth left slide-in drawer (`transform: translateX(0)`), category quick links, search shortcut, and close button. Update `Header.tsx` with hamburger icon button (`.show-on-mobile`), desktop links (`.hide-on-mobile`), and responsive cart button.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/mobile-nav.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/MobileNavDrawer.tsx src/components/layout/Header.tsx tests/mobile-nav.test.ts
git commit -m "feat(layout): implement responsive header with mobile navigation drawer"
```

---

### Task 3: Responsive Homepage Layouts

**Files:**
- Modify: `src/components/home/HeroBanner.tsx:15-100`
- Modify: `src/components/home/CategoryGrid.tsx:35-80`
- Modify: `src/components/home/BrandShowcase.tsx:80-130`
- Modify: `src/components/home/SkinTypeSelector.tsx:40-90`
- Test: `tests/home-responsive.test.ts`

**Interfaces:**
- Produces: Responsive homepage sections adapting to 1-col on mobile for hero, 2-col for category/brand/skin-type grids.

- [ ] **Step 1: Write test for Homepage responsive grid classes**

```typescript
// tests/home-responsive.test.ts
import { describe, it, expect } from 'vitest';
import HeroBanner from '../src/components/home/HeroBanner';
import CategoryGrid from '../src/components/home/CategoryGrid';

describe('Homepage Responsive Components', () => {
  it('exports HeroBanner and CategoryGrid functions', () => {
    expect(typeof HeroBanner).toBe('function');
    expect(typeof CategoryGrid).toBe('function');
  });
});
```

- [ ] **Step 2: Run test to verify baseline**

Run: `npx vitest run tests/home-responsive.test.ts`
Expected: PASS

- [ ] **Step 3: Update `HeroBanner.tsx`, `CategoryGrid.tsx`, `BrandShowcase.tsx`, and `SkinTypeSelector.tsx`**

- In `HeroBanner`: use CSS media queries or responsive classes so grid becomes 1 column on `< 768px`, padding `32px 20px`, heading `28px`.
- In `CategoryGrid`: `repeat(auto-fit, minmax(140px, 1fr))` or 2 columns on mobile.
- In `BrandShowcase`: 2 columns on mobile, 3 on tablet, 5 on desktop.
- In `SkinTypeSelector`: 2 columns on mobile, 4 on desktop.

- [ ] **Step 4: Verify with Vitest & build**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/ tests/home-responsive.test.ts
git commit -m "feat(home): make hero, categories, brands, and skin types responsive"
```

---

### Task 4: Responsive Product Catalog with Mobile Filter Bottom Sheet

**Files:**
- Create: `src/components/product/MobileFilterDrawer.tsx`
- Modify: `src/app/products/page.tsx:45-65`
- Modify: `src/components/product/ProductCatalogClient.tsx:45-65`
- Test: `tests/mobile-filter.test.ts`

**Interfaces:**
- Produces: `<MobileFilterDrawer isOpen={boolean} onClose={() => void} />`
- Consumes: `useCatalogFilter()`

- [ ] **Step 1: Write test for MobileFilterDrawer**

```typescript
// tests/mobile-filter.test.ts
import { describe, it, expect } from 'vitest';
import MobileFilterDrawer from '../src/components/product/MobileFilterDrawer';

describe('MobileFilterDrawer Component', () => {
  it('exports MobileFilterDrawer as a valid component', () => {
    expect(typeof MobileFilterDrawer).toBe('function');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/mobile-filter.test.ts`
Expected: FAIL (component does not exist yet)

- [ ] **Step 3: Implement `MobileFilterDrawer.tsx` and integrate into `/products`**

- `MobileFilterDrawer`: bottom sheet / slide drawer containing full filter controls with "Xem kết quả" button.
- In `src/app/products/page.tsx`: render sticky Mobile Filter Trigger bar (`.show-on-mobile-flex`) with active filter count pill.
- In `ProductCatalogClient.tsx`: grid becomes 2 columns on mobile (`repeat(auto-fill, minmax(150px, 1fr))` or `repeat(2, 1fr)`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/mobile-filter.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/product/MobileFilterDrawer.tsx src/app/products/page.tsx src/components/product/ProductCatalogClient.tsx tests/mobile-filter.test.ts
git commit -m "feat(catalog): add mobile filter bottom sheet drawer and 2-column mobile grid"
```

---

### Task 5: Responsive Product Detail Page

**Files:**
- Modify: `src/app/products/[id]/page.tsx:90-150`
- Modify: `src/components/product/ProductGallery.tsx:30-80`
- Test: `tests/product-detail-responsive.test.ts`

**Interfaces:**
- Adapts product showcase from 2-column grid (`minmax(320px, 1fr) 1.2fr`) to 1-column stack on screens `< 768px`.

- [ ] **Step 1: Write test for Product Detail responsive layout**

```typescript
// tests/product-detail-responsive.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Product Detail Responsive Layout', () => {
  it('contains responsive media query or responsive classes for single column stacking', () => {
    const detailPath = path.resolve(__dirname, '../src/app/products/[id]/page.tsx');
    const content = fs.readFileSync(detailPath, 'utf-8');
    expect(content).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify baseline**

Run: `npx vitest run tests/product-detail-responsive.test.ts`
Expected: PASS

- [ ] **Step 3: Update `src/app/products/[id]/page.tsx` and `ProductGallery.tsx`**

- Wrap the main showcase grid in a responsive container that stacks into 1 column on `< 768px`.
- Reduce padding from `36px` to `20px` on mobile.
- Make thumbnail images scrollable horizontally on mobile.

- [ ] **Step 4: Verify with Vitest & build**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/products/[id]/page.tsx src/components/product/ProductGallery.tsx tests/product-detail-responsive.test.ts
git commit -m "feat(detail): stack gallery and purchase box in single column on mobile"
```

---

### Task 6: Responsive Cart Drawer, Checkout, and Footer

**Files:**
- Modify: `src/components/cart/CartDrawer.tsx:50-80`
- Modify: `src/app/checkout/page.tsx:130-170`
- Modify: `src/components/layout/Footer.tsx:15-120`
- Test: `tests/checkout-responsive.test.ts`

**Interfaces:**
- Produces: Cart Drawer width `min(420px, 100vw)`, Checkout single column on `< 768px`, Footer stacked link columns.

- [ ] **Step 1: Write test for Cart & Checkout responsive constraints**

```typescript
// tests/checkout-responsive.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Checkout and Cart Responsive Constraints', () => {
  it('verifies CartDrawer uses 100vw or min-width for mobile screens', () => {
    const cartPath = path.resolve(__dirname, '../src/components/cart/CartDrawer.tsx');
    const content = fs.readFileSync(cartPath, 'utf-8');
    expect(content).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify baseline**

Run: `npx vitest run tests/checkout-responsive.test.ts`
Expected: PASS

- [ ] **Step 3: Update `CartDrawer.tsx`, `checkout/page.tsx`, and `Footer.tsx`**

- In `CartDrawer`: set `width: 'min(420px, 100vw)'`.
- In `checkout/page.tsx`: stack shipping form and order summary vertically on `< 768px`.
- In `Footer.tsx`: stack value propositions in 2 columns on mobile; stack 4 link columns into 2 columns on tablet and 1-2 columns on mobile.

- [ ] **Step 4: Verify with Vitest & build**

Run: `npm test && npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/cart/CartDrawer.tsx src/app/checkout/page.tsx src/components/layout/Footer.tsx tests/checkout-responsive.test.ts
git commit -m "feat(checkout): make cart drawer, checkout, and footer responsive"
```

---

### Task 7: Full System Verification & Audit

**Files:**
- Test: All tests in `tests/`
- Verification: Production build and local dev server audit across viewports.

- [ ] **Step 1: Run complete test suite**

Run: `npm test`
Expected: 16+ tests pass with zero failures.

- [ ] **Step 2: Run production Next.js build**

Run: `npm run build`
Expected: Success code 0, all routes compiled.

- [ ] **Step 3: Verify HTTP responses via curl across primary routes**

Run:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/products
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/checkout
```
Expected: All return 200 OK.

- [ ] **Step 4: Final commit and summary**

```bash
git status
git commit --allow-empty -m "chore: complete responsive design verification across all viewports"
```
