# Kế Hoạch Tối Ưu Toàn Diện Dự Án GlowSeoul K-Beauty (Dựa Trên Kinh Nghiệm Enterprise & TECH.md)

- [x] **Giai Đoạn 1: CSDL & Bổ Sung Composite Index**
  - [x] Cập nhật `prisma/schema.prisma` với composite indexes trên bảng `Order` (`[orderStatus, createdAt]`, `[paymentStatus, createdAt]`) và `Product` (`[category, createdAt]`, `[brand, createdAt]`)
  - [x] Chạy verify test `tests/db.test.ts`

- [x] **Giai Đoạn 2: Tối Ưu Toàn Diện Trang Admin (Admin Portal)**
  - [x] Cải tổ triệt để `src/app/api/admin/dashboard/route.ts` bằng SQL Aggregations (`_sum`, `count`, `take: 5`), triệt tiêu việc load toàn bộ bảng vào RAM
  - [x] Bổ sung Debounce Search (400ms) cho bộ lọc sản phẩm trong Admin (`src/app/admin/page.tsx`)
  - [x] Thêm trạng thái disabled và loading spinner chống double-click trên các modal quản trị (`ProductFormModal.tsx`)
  - [x] Chạy verify test `tests/admin-dashboard-orders.test.ts`

- [x] **Giai Đoạn 3: Tối Ưu Phân Hệ Khách Hàng (Customer / Storefront)**
  - [x] Nâng cấp `src/components/product/LiveSearch.tsx` thành True Live Search với Debounce 400ms
  - [x] Bổ sung `prefetch={true}` cho `CategoryGrid.tsx`, `BrandShowcase.tsx` và `ProductCard.tsx`
  - [x] Tối ưu Edge CDN Cache-Control header cho `src/app/api/flash-sales/active/route.ts` (`s-maxage=10, stale-while-revalidate=59`)
  - [x] Hoàn thiện guard chống double submit cho `src/app/account/page.tsx`

- [x] **Giai Đoạn 4: Kiểm Thử Toàn Diện & Nghiệm Thu**
  - [x] Viết unit test `tests/admin-dashboard-aggregation.test.ts` kiểm tra tính chính xác và tốc độ của aggregation
  - [x] Chạy `npm test` toàn bộ 49 test suites (132/132 tests passed)

- [x] **Giai Đoạn 5: Triển khai Vercel Production**
  - [x] Khắc phục lỗi TypeScript `orderItemsData` tại `src/app/api/orders/route.ts` gây lỗi build Vercel
  - [x] Chạy verify `npm run build` cục bộ thành công 100% (30/30 routes)
  - [x] Chạy toàn bộ 49 test suites (132/132 tests passed)
  - [x] Push commit lên Git và kích hoạt Vercel build
  - [x] Nghiệm thu Vercel deployment trạng thái READY và URL hoạt động (`https://glowseoul-kbeauty.vercel.app`)

- [x] **Giai Đoạn 6: Chuẩn Hóa Hệ Thống Fallback Ảnh & Khắc Phục Lỗi Ảnh Yêu Thích**
  - [x] Tạo asset placeholder SVG dự phòng ngoại tuyến: `public/placeholder-product.svg`
  - [x] Tạo module quy chuẩn fallback ảnh: `src/lib/image-fallback.ts` (`DEFAULT_PRODUCT_IMAGE`, `LOCAL_PLACEHOLDER_IMAGE`, `getProductImageUrl`, `getProductImageArray`)
  - [x] Xuất `DEFAULT_PRODUCT_IMAGE` từ `src/lib/constants.ts`
  - [x] Tạo component `SafeImage.tsx` tự động xử lý `onError` và fallback đa tầng cho toàn hệ thống
  - [x] Sửa API `/api/account/wishlist` định dạng trả về trường `image` hợp lệ cho từng sản phẩm
  - [x] Cập nhật giao diện `/account` (wishlist card, order history items, Add to Cart) sử dụng `SafeImage` và fallback
  - [x] Chuẩn hóa toàn bộ hệ thống hiển thị ảnh sản phẩm: `ProductCard`, `QuickViewModal`, `ProductGallery`, `FlashSaleSection`, `CartItem`, `checkout/page.tsx`, `orders/[id]/page.tsx`, `quiz/page.tsx`, `ProductListTable`, `OrderManager`
  - [x] Viết test suite `tests/image-fallback.test.ts` (141/141 tests passed)
  - [x] Xác minh production build `npm run build` thành công 100%

- [x] **Giai Đoạn 7: Xây Dựng Hệ Thống Loading Skeletons Chuyên Biệt Từng Trang**
  - [x] Thêm utility class `.skeleton-shimmer` và `.skeleton-box` chuẩn HSL ánh hồng pastel tại `src/app/globals.css`
  - [x] Xây dựng bộ thư viện UI Skeletons dạng module:
    - `src/components/ui/skeletons/SkeletonBox.tsx`
    - `src/components/ui/skeletons/ProductCardSkeleton.tsx`
    - `src/components/ui/skeletons/AccountOrdersSkeleton.tsx`
    - `src/components/ui/skeletons/AccountWishlistSkeleton.tsx`
    - `src/components/ui/skeletons/AdminTableSkeleton.tsx`
    - `src/components/ui/skeletons/AdminDashboardSkeleton.tsx`
  - [x] Thiết kế file `loading.tsx` chuẩn theo layout riêng biệt cho từng trang Next.js:
    - `src/app/loading.tsx`: Trang chủ (Hero banner + Danh mục + Flash Sale + Best Sellers)
    - `src/app/products/loading.tsx`: Trang danh mục sản phẩm (Filter sidebar 260px + Grid 8 sản phẩm)
    - `src/app/products/[id]/loading.tsx`: Trang chi tiết sản phẩm (Gallery 1:1 + Buy Box + Tabs + Reviews)
    - `src/app/account/loading.tsx`: Trang cá nhân (Banner profile + Sidebar tabs + Danh sách đơn hàng)
    - `src/app/admin/loading.tsx`: Trang quản trị Admin (Sidebar + Header + 4 KPI Cards + Bảng dữ liệu)
    - `src/app/checkout/loading.tsx`: Trang thanh toán (Form thông tin giao hàng + Tóm tắt giỏ hàng)
    - `src/app/orders/[id]/loading.tsx`: Trang xác nhận & theo dõi đơn hàng (Banner + Thanh 4 bước trạng thái + Chi tiết đơn)
    - `src/app/quiz/loading.tsx`: Trang trắc nghiệm chu trình da (Thanh tiến độ + Thẻ câu hỏi 4 lựa chọn)
  - [x] Cải thiện loading state cục bộ cho `/account` và `/admin` (thay thế văn bản "Đang tải..." và spinner bằng skeletons)
  - [x] Viết test suite `tests/page-skeletons.test.ts` (150/150 tests passed)
  - [x] Xác minh production build `npm run build` thành công 100%

- [x] **Giai Đoạn 8: Thiết Lập Pipeline Kiểm Tra Rule Code Trước Khi Push (Pre-push & CI Pipeline)**
  - [x] Xây dựng script kiểm tra quy chuẩn tĩnh `scripts/verify-code-rules.ts` (Image fallback, Route Skeletons, FOUC Middleware, Anti-double submit, Design Tokens)
  - [x] Cấu hình các lệnh scripts trong `package.json` (`check:types`, `check:rules`, `verify`, `pre-push`, `prepare:hooks`)
  - [x] Thiết lập Git Pre-push Hook tự động (`.git/hooks/pre-push` & `scripts/setup-hooks.ts`)
  - [x] Thiết lập GitHub Actions CI Pipeline (`.github/workflows/ci.yml`)
  - [x] Chạy thử nghiệm toàn diện `npm run verify` và kiểm tra hoạt động của pre-push hook (156/156 tests passed, build 30/30 routes thành công)

- [x] **Giai Đoạn 9: Tinh Giản UI Admin & Kích Hoạt Kỷ Luật Zero Dead Code**
  - [x] Xóa badge SQLite Connected và dọn dẹp AdminHeader
  - [x] Xóa khối Tiêu đề h1 & Mô tả trùng lặp trên tất cả các tab Admin trong `src/app/admin/page.tsx`
  - [x] Nâng cấp trạng thái tải của `DashboardOverview.tsx` với Shimmer Skeleton
  - [x] Kích hoạt `noUnusedLocals` và `noUnusedParameters` trong `tsconfig.json`
  - [x] Dọn sạch 100% imports và biến không sử dụng trong toàn bộ `src/` và `tests/`
  - [x] Nâng cấp `scripts/verify-code-rules.ts` với Rule 6 (Zero Dead Code) và Rule 7 (Chống Debugger/Console.log)
  - [x] Bổ sung quy chuẩn vào `PROJECT_RULES_TEMPLATE.md`
  - [x] Chạy kiểm thử tự động, build và deploy lên Vercel Production

- [x] **Giai Đoạn 10: Triệt Tiêu 100% Biến Giả Underscore '_' & Kích Hoạt Rule 8 Chặn Lách Pipeline**
  - [x] Rà soát và xóa sạch 100% biến/tham số giả có tiền tố `_` trong `src/` (dashboard, reviews, HeroBanner, ProductDetail, AdminTableSkeleton)
  - [x] Bổ sung tham số thực tế và nghiệp vụ lọc đánh giá theo sao trong `src/app/api/products/[id]/reviews/route.ts`
  - [x] Nâng cấp `scripts/verify-code-rules.ts` với Rule 8 (Anti-Underscore Cheat Gateway)
  - [x] Cập nhật điều khoản cấm tuyệt đối lấp liếm biến thừa trong `PROJECT_RULES_TEMPLATE.md`
  - [x] Cập nhật test suite `tests/code-rules-pipeline.test.ts`
  - [x] Kiểm thử toàn diện 52 test suites (156 tests passed) và deploy Vercel Production


