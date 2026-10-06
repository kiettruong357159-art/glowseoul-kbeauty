# Responsive Design Specification - GlowSeoul K-Beauty

**Date**: 2026-10-06  
**Status**: Approved  
**Author**: Antigravity  

---

## 1. Executive Summary

GlowSeoul is a premium K-Beauty cosmetics e-commerce web application built on Next.js 15 App Router, TypeScript, Prisma (SQLite), and Vanilla CSS. This specification details the end-to-end responsive design system across mobile (< 768px), tablet (768px - 1023px), and desktop (≥ 1024px) devices, eliminating layout breaks, horizontal overflow, and ensuring a native-app-like mobile shopping experience.

---

## 2. Responsive Breakpoints & Global Utilities

### 2.1 Breakpoints Standard
- **Mobile Compact (`max-width: 639px`)**: Primary mobile phone view (iPhone, Samsung Galaxy). Lays out products in 2 columns, containers with `16px` horizontal padding.
- **Mobile Large & Phablet (`640px - 767px`)**: Large phones and small tablets.
- **Tablet (`768px - 1023px`)**: Tablets (iPad) and small laptops. 3-column product grid, adjusted sidebars.
- **Desktop (`≥ 1024px`)**: Full desktop experience with sticky desktop sidebars, 4-column product grids, and full horizontal navigation bar.

### 2.2 Global Helper Classes (`src/app/globals.css`)
```css
/* Responsive visibility utilities */
@media (max-width: 767px) {
  .hide-on-mobile {
    display: none !important;
  }
  .show-on-mobile {
    display: block !important;
  }
  .show-on-mobile-flex {
    display: flex !important;
  }
  .container {
    padding: 0 16px !important;
  }
}

@media (min-width: 768px) {
  .show-on-mobile,
  .show-on-mobile-flex {
    display: none !important;
  }
  .hide-on-mobile {
    display: initial;
  }
}
```

---

## 3. Component Responsive Architecture

### 3.1 Header & Mobile Navigation Drawer (`src/components/layout/Header.tsx`)
- **Desktop (≥ 768px)**:
  - Height: `72px`.
  - Brand logo with icon on the left.
  - Horizontal `<nav>` links: Trang chủ, Tất cả sản phẩm, Serum & Ampoule, Kem chống nắng, Mặt nạ.
  - Right: Search button, Cart button with label and count badge.
- **Mobile (< 768px)**:
  - Height: `60px`.
  - Left: Hamburger menu button (`<Menu size={22} />`).
  - Center: Brand logo (`GlowSeoul`) with compact icon.
  - Right: Search button (`<Search size={20} />`) and Cart button formatted as an icon with count pill badge (omitting the text label).
- **Mobile Navigation Drawer**:
  - Off-canvas slide-in drawer from the left (`translateX(-100%)` to `0`).
  - Backdrop blur overlay with `fadeIn` animation.
  - Drawer contents:
    - Close button (`<X size={20} />`) and GlowSeoul branding.
    - Quick Category Links with cute badge pills.
    - Live Search bar shortcut.
    - Customer care hotline and 100% authentic guarantee badge.

### 3.2 Homepage Layouts (`src/components/home/`)
1. **Hero Banner (`HeroBanner.tsx`)**:
   - Desktop: `display: grid; grid-template-columns: 1.2fr 0.8fr; padding: 60px 48px;`.
   - Mobile: `grid-template-columns: 1fr; padding: 32px 20px; gap: 24px;`. Title font-size scaled from `44px` to `28px` for comfortable readability without text overflowing.
2. **Category Grid (`CategoryGrid.tsx`)**:
   - Desktop: 4 columns.
   - Mobile: 2 columns (`grid-template-columns: repeat(2, 1fr)`), compact aspect ratio.
3. **Brand Showcase (`BrandShowcase.tsx`)**:
   - Desktop: 5 columns.
   - Tablet: 3 columns.
   - Mobile: 2 columns with reduced card padding (`12px 8px`).
4. **Skin Type Selector (`SkinTypeSelector.tsx`)**:
   - Desktop: 4 columns.
   - Mobile: 2 columns with responsive card icons and labels.

### 3.3 Product Catalog Page (`src/app/products/page.tsx`)
- **Desktop (≥ 768px)**:
  - Layout: `display: grid; grid-template-columns: 260px 1fr; gap: 32px;`.
  - Left: Sticky `FilterSidebar` (`top: 90px`).
  - Right: Product grid (3 to 4 columns depending on width).
- **Mobile (< 768px)**:
  - Layout: Single column (`grid-template-columns: 1fr; gap: 16px;`).
  - Sticky Mobile Filter Bar: A clean, sleek bar with:
    - Filter Button: `<SlidersHorizontal size={16} />` + "Bộ lọc" + badge showing count of active filters.
    - Live Search bar fitting full width or beside filter trigger.
  - Mobile Filter Bottom Sheet / Drawer:
    - Opens smoothly from bottom or right when the Filter button is tapped.
    - Full access to all categories, skin types, brands, and price ranges.
    - Footer with "Xem kết quả" button that dismisses the drawer with zero scroll jumping.
  - Product Cards: 2-column layout (`grid-template-columns: repeat(2, 1fr); gap: 12px;`) optimized for high density and clear imagery.

### 3.4 Product Detail Page (`src/app/products/[id]/page.tsx`)
- **Desktop (≥ 768px)**:
  - 2 columns: `grid-template-columns: minmax(320px, 1fr) 1.2fr; gap: 48px;`.
- **Mobile (< 768px)**:
  - 1 column: Gallery on top (`aspect-ratio: 1/1`), Buying panel below (`padding: 20px; gap: 20px;`).
  - Mobile Bottom Sticky Bar: When user scrolls past buying options, a floating bottom bar with Price + "Thêm vào giỏ" button ensures effortless purchase conversion.

### 3.5 Cart Drawer & Checkout Flow (`src/components/cart/CartDrawer.tsx` & `/checkout`)
- **Cart Drawer**:
  - Desktop: `width: 420px`.
  - Mobile (< 480px): `width: 100vw; max-width: 100vw; border-radius: 0;`.
- **Checkout Page**:
  - Desktop: 2 columns (`grid-template-columns: 1.2fr 0.8fr`).
  - Mobile: 1 column stacked (Order Summary first or above VietQR payment).
  - Form inputs: `font-size: 16px` on mobile to prevent iOS Safari auto-zoom.

### 3.6 Footer (`src/components/layout/Footer.tsx`)
- Desktop: Value proposition 4 columns, link groups 4 columns.
- Mobile: Value propositions stacked in 2 columns or 1 column; link groups stacked cleanly with touch-friendly spacing (`padding: 8px 0`).

---

## 4. Verification & Testing

1. **Automated Testing**:
   - `npm test`: Run existing 16 unit tests and add responsive component tests.
   - `npm run build`: Verify zero build/typing errors in Next.js production pipeline.
2. **Viewport Verification**:
   - 375px (iPhone SE / standard phone).
   - 414px (iPhone Pro Max / Plus).
   - 768px (iPad portrait).
   - 1024px+ (Desktop standard).
   - Validate zero horizontal scroll (`overflow-x: hidden`).
