# Implementation Plan: Reviews, Customer Account & Skin Routine Quiz

- **Goal**: Implement Product Reviews & Ratings (⭐), Customer Account Portal (`/account`) with Order History & Wishlist (👤), and K-Beauty Smart Skin Routine Quiz (`/quiz`) (🧴).
- **Architecture**: Next.js 15 App Router, Prisma ORM with Supabase PostgreSQL, Vanilla CSS with K-Beauty design tokens.
- **Verification**: TDD with Vitest test suites, full regression testing, production build verification, and live Vercel push.

---

### Task 1: Prisma Schema & Seed for Reviews & Wishlist
- Add `Review` model to `prisma/schema.prisma`.
- Add `Wishlist` model to `prisma/schema.prisma`.
- Update `Product` and `User` relations.
- Push schema to Supabase PostgreSQL using `npx prisma db push`.
- Add realistic sample reviews in `prisma/seed.ts` and run `npm run seed`.
- Verify with `tests/db-reviews-wishlist.test.ts`.

---

### Task 2: API Endpoints for Reviews, Account & Wishlist
- `src/app/api/products/[id]/reviews/route.ts`:
  - `GET`: return reviews for product + rating distribution statistics.
  - `POST`: submit review, recompute product's `rating` & `reviewCount`.
- `src/app/api/account/profile/route.ts`:
  - `GET`: return current user profile + default address.
  - `PUT`: update profile name, phone, address.
- `src/app/api/account/orders/route.ts`:
  - `GET`: fetch user's past orders based on session or email.
- `src/app/api/account/wishlist/route.ts`:
  - `GET`: fetch user wishlist products.
  - `POST`: toggle wishlist product (add if missing, remove if present).
- `src/app/api/admin/reviews/route.ts`:
  - `GET`: list all reviews with product details.
  - `DELETE`: remove a review.
- Verify with `tests/reviews-account-api.test.ts`.

---

### Task 3: Product Detail Reviews & Rating UI (`/products/[id]`)
- Build `ProductReviewsSection` component:
  - Rating summary scorecard (average rating, distribution breakdown bars).
  - List of reviews with author, verified purchase badge, skin type badge ("Da nhạy cảm", "Da dầu", etc.).
  - "Viết đánh giá" modal with 5 interactive stars, skin type selector, and submission form.
- Integrate into `src/app/products/[id]/page.tsx`.
- Verify with `tests/product-reviews-ui.test.ts`.

---

### Task 4: Customer Account & Order History Portal (`/account`)
- Build `src/app/account/page.tsx`:
  - Tab 1: "Đơn hàng của tôi" - list of orders with items, status badges, link to track.
  - Tab 2: "Sản phẩm yêu thích (Wishlist)" - grid of favorited items with quick add to cart.
  - Tab 3: "Thông tin cá nhân" - update display name, phone, shipping address.
- Update `Header.tsx` and `MobileNavDrawer.tsx` to link user avatar to `/account`.
- Verify with `tests/customer-account-ui.test.ts`.

---

### Task 5: K-Beauty Smart Skin Routine Quiz (`/quiz`)
- Build `src/app/quiz/page.tsx`:
  - 3-step interactive quiz: Skin Type -> Skin Concern -> Target Focus.
  - Smart Algorithm matching 4-step routine (Cleanser + Toner + Serum + Sunscreen).
  - Results card with step numbers, reason for recommendation, and bundle price calculation with `KBEAUTY10`.
  - 1-Click "Thêm trọn bộ vào giỏ hàng" adds all 4 products directly to cart and opens CartDrawer.
- Add "Trắc nghiệm chọn Routine" banner on homepage (`src/app/page.tsx`).
- Verify with `tests/skin-routine-quiz.test.ts`.

---

### Task 6: Admin Reviews Management Tab (`/admin`)
- Build `ReviewManager.tsx` component.
- Add `reviews` tab to `AdminSidebar.tsx` and `AdminPage`.
- Allow deleting or moderating reviews.
- Verify with `tests/admin-reviews-manager.test.ts`.

---

### Task 7: Full Verification, Regression Testing & Vercel Push
- Run all vitest suites across repository (must be 100% PASS).
- Verify `npm run build`.
- Commit changes and push to GitHub `main` -> trigger Vercel production deployment.
- Verify live production endpoints.
