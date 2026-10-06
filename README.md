# GlowSeoul — K-Beauty E-commerce Platform

Nền tảng thương mại điện tử chuyên biệt về mỹ phẩm Hàn Quốc (K-Beauty) xây dựng trên nền tảng **Next.js 15+ App Router**, **TypeScript**, **Prisma ORM với SQLite**, và **Vanilla CSS Design System**.

---

## ✨ Điểm Nổi Bật

- **Thẩm mỹ K-Beauty Vibrant & Trendy:** Bảng màu hồng phấn/san hô rực rỡ, hiệu ứng kính mờ (Glassmorphism), micro-animations 60fps, typography `Plus Jakarta Sans`.
- **Cơ sở dữ liệu SQLite qua Prisma:** Đã seed sẵn 12+ sản phẩm K-Beauty hot nhất (COSRX, Beauty of Joseon, Laneige, Skin1004, Torriden, Anua, Rom&nd...).
- **Lọc theo loại da thông minh:** Lọc nhanh theo *Da dầu & Lỗ chân lông, Da khô thiếu nước, Da nhạy cảm phục hồi, Da mụn làm dịu*.
- **Live Search & Quick View:** Tìm kiếm tức thì theo tên, thành phần; xem nhanh pop-up công dụng & thành phần không cần rời trang.
- **Giỏ hàng Slide-Over Mini-Cart:** Đồng bộ `localStorage`, hiển thị thanh tiến độ nhận Freeship toàn quốc (từ 399.000₫).
- **Thanh toán 1 chạm & VietQR Napas247:** Form checkout tinh gọn, áp dụng mã giảm giá `KBEAUTY10`, tự động sinh mã VietQR chuẩn ngân hàng kèm số tiền và mã đơn.
- **Theo dõi đơn hàng:** Trang xác nhận đơn với tiến trình vận chuyển và lưu trữ đơn thật vào SQLite.

---

## 🚀 Hướng Dẫn Khởi Chạy

### 1. Cài đặt thư viện (nếu chưa cài):
```bash
npm install
```

### 2. Khởi tạo & Seed dữ liệu SQLite:
```bash
npx prisma db push
npm run seed
```

### 3. Khởi chạy môi trường phát triển (Dev server):
```bash
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### 4. Chạy kiểm thử tự động (Vitest):
```bash
npm test
```

### 5. Build bản phát hành (Production build):
```bash
npm run build
```

---

## 📁 Cấu Trúc Thư Mục

```text
shoppe/
├── prisma/
│   ├── schema.prisma         # Schema database: Product, Order, OrderItem
│   └── seed.ts               # Dữ liệu 12+ sản phẩm K-Beauty mẫu
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout chính với Header, PromoBar, CartDrawer, Footer
│   │   ├── globals.css       # Design System & K-Beauty CSS Tokens
│   │   ├── page.tsx          # Trang chủ (Hero, Lọc theo da, Bestsellers, Brands)
│   │   ├── products/
│   │   │   ├── page.tsx      # Trang danh mục & bộ lọc đa năng
│   │   │   └── [id]/page.tsx # Trang chi tiết sản phẩm, bảng thành phần & routine
│   │   ├── checkout/page.tsx # Trang thanh toán COD & VietQR
│   │   ├── orders/[id]/page.tsx # Trang xác nhận và theo dõi đơn hàng
│   │   └── api/orders/route.ts  # API nhận & lưu đơn hàng vào SQLite
│   ├── components/
│   │   ├── layout/           # PromoBar, Header, Footer
│   │   ├── product/          # ProductCard, FilterSidebar, LiveSearch, QuickViewModal
│   │   ├── cart/             # CartDrawer, CartItem, FreeShippingBar
│   │   ├── checkout/         # VietQRModal
│   │   └── order/            # OrderStatusTracker
│   ├── context/
│   │   └── CartContext.tsx   # Quản lý giỏ hàng toàn cục (localStorage sync)
│   └── lib/
│       ├── db.ts             # Prisma Client singleton
│       ├── utils.ts          # Định dạng tiền tệ VNĐ, tính giảm giá
│       ├── constants.ts      # Hạn mức Freeship & phí ship chuẩn
│       ├── filter.ts         # Query builder cho bộ lọc danh mục
│       └── vietqr.ts         # Trình tạo link VietQR Napas247 tự động
└── tests/                    # 9 bộ test suites với Vitest
```

---

## 💳 Thông Tin Thanh Toán Demo
- **Mã giảm giá:** `KBEAUTY10` (Giảm 10% trên tổng giá trị đơn hàng)
- **Freeship:** Tự động miễn phí vận chuyển cho đơn hàng từ 399.000₫ trở lên
- **VietQR Demo:** Tự động tạo mã QR Napas247 tương thích tất cả ứng dụng ngân hàng và ví điện tử
