# Implementation Plan: Flash Sale & Hourly Deals with Realtime Countdown

- **Date**: 2026-10-08
- **Status**: Ready for Execution
- **Spec**: `docs/superpowers/specs/2026-10-08-flash-sale-realtime-countdown.md`

---

## 1. Database Schema & Migration Phase
1. **Prisma Schema Update**:
   - File: `prisma/schema.prisma`
   - Add `FlashSale` and `FlashSaleItem` models.
   - Add `flashSaleItems FlashSaleItem[]` relation to `Product`.
   - Add indexes `@@index([isActive])`, `@@index([startTime, endTime])`, `@@index([flashSaleId])`, `@@index([productId])`.
2. **Database DDL Execution via MCP**:
   - Execute SQL DDL migration on **Supabase** (`oyzbmwwyrwfxjhzmbhkh`) using `supabase:apply_migration` / `execute_sql`.
   - Execute SQL DDL migration on **Neon** (`broad-voice-84173872`) using `mcp-server-neon:run_sql`.
   - Run `npx prisma generate` to update Prisma Client types.

---

## 2. Backend API Development Phase
1. **Public Active Flash Sale Route**:
   - File: `src/app/api/flash-sales/active/route.ts`
   - Method: `GET`
   - Logic: Find first `FlashSale` with `isActive: true`, `startTime <= now`, `endTime > now`. Include `items.product`. Fallback to next upcoming sale if none active.
2. **Admin Flash Sale Management Route**:
   - File: `src/app/api/admin/flash-sales/route.ts`
   - Methods: `GET` (list with pagination), `POST` (create campaign & items), `PUT` (update campaign), `DELETE` (delete campaign).
   - Security: Validate `getCurrentUserFromCookie` for write actions (`admin` / `products:manage`), returning `403 Forbidden` if unauthorized.
3. **Checkout Order Update**:
   - File: `src/app/api/orders/route.ts`
   - In order creation transaction: Increment `soldQuantity` on active `FlashSaleItem` when matching products are purchased.

---

## 3. UI Component Development Phase (Vanilla CSS Tokens)
1. **Real-time Countdown Timer**:
   - File: `src/components/ui/CountdownTimer.tsx`
   - Props: `targetDate: string | Date`, `onExpire?: () => void`
   - Styling: Glassmorphism badges with hour/min/sec boxes, subtle pulse animations on seconds tick.
2. **Heat Progress Bar**:
   - File: `src/components/ui/FlashSaleProgressBar.tsx`
   - Props: `soldQuantity: number`, `limitQuantity: number`
   - Visual: Dynamic gradient bar (`linear-gradient(90deg, #ff6b81, #fa5252)`), flaming badge, percentage indicator.
3. **Storefront Flash Sale Section**:
   - File: `src/components/product/FlashSaleSection.tsx`
   - Features: Section header with glowing bolt icon ⚡, active countdown timer, responsive horizontal product scroll/grid, Add to Cart integration.
4. **Admin Flash Sale Manager**:
   - File: `src/components/admin/FlashSaleManager.tsx`
   - Features: Campaign creation modal, date-time pickers, product picker with discount price and limit setting, real-time sold tracking table.
5. **Layout Integrations**:
   - `src/components/admin/AdminSidebar.tsx`: Add "Flash Sale" tab (`Clock` / `Zap` icon).
   - `src/app/admin/page.tsx`: Render `FlashSaleManager` when `activeTab === 'flash-sales'`.
   - `src/app/page.tsx`: Mount `FlashSaleSection` below Hero Banner.

---

## 4. Testing & Verification Phase
1. **Vitest Automated Tests**:
   - File: `tests/flash-sale.test.ts`
   - Tests: Time calculation accuracy, progress bar percentages, expired countdown handling, discount calculations.
2. **Build Verification**:
   - Run `npm test` -> Confirm 100% pass rate.
   - Run `npm run build` -> Confirm 28/28 Next.js 15 routes build with 0 errors.
3. **Git & Deploy**:
   - Update `task.md`.
   - Commit changes to Git.
   - Deploy directly to Vercel Production via Vercel CLI.
