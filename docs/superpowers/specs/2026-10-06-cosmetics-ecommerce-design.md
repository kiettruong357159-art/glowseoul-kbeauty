# Design Spec: K-Beauty Cosmetics E-commerce Web Application

**Date:** 2026-10-06  
**Status:** Approved by User  
**Project:** Shoppe K-Beauty Storefront  
**Classification:** Architectural (Fullstack Next.js Greenfield Application)

---

## 1. Executive Summary & Intent

Xây dựng nền tảng thương mại điện tử chuyên biệt về mỹ phẩm K-Beauty (Hàn Quốc), mang lại trải nghiệm mua sắm trực tuyến vượt trội:
- **Khách hàng mục tiêu:** Tín đồ làm đẹp, người tìm kiếm mỹ phẩm chính hãng từ các thương hiệu nổi tiếng (COSRX, Beauty of Joseon, Laneige, Rom&nd, Innisfree, Torriden...).
- **Giá trị cốt lõi:** Giao diện K-Beauty Vibrant & Trendy lôi cuốn, bộ lọc thông minh theo tình trạng da (Da dầu, Da khô, Da nhạy cảm, Da mụn), tốc độ tải trang cực nhanh, giỏ hàng mượt mà và thanh toán tức thì qua VietQR / COD.

---

## 2. Technology Stack & Architecture

- **Framework:** Next.js 15+ (App Router, TypeScript).
- **Rendering Strategy:**
  - **Server Components (RSC):** Trang chủ, Danh mục sản phẩm, Chi tiết sản phẩm (tối ưu hóa SEO, Zero Client Waterfall, Metadata động).
  - **Client Components:** Search bar, Filter sidebar, Cart drawer, Quick-view modal, Checkout form.
- **Styling:** Vanilla CSS & CSS Modules (Design Tokens tại `globals.css`, không phụ thuộc TailwindCSS, đảm bảo 60fps animations và kiểm soát 100% thẩm mỹ).
- **Database & ORM:** SQLite nhúng cục bộ quản lý qua Prisma ORM (zero-config, chạy ngay không cần server DB phụ trợ).
- **State Management:** React Context (`CartContext`) đồng bộ `localStorage`.
- **Payment Integration:** VietQR (Napas247 dynamic QR generation) và COD (Tiền mặt khi nhận hàng).

---

## 3. Data Model & Database Schema

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id            String      @id @default(cuid())
  name          String
  brand         String      // COSRX, Beauty of Joseon, Laneige, Rom&nd...
  price         Int         // Giá bán (VNĐ)
  originalPrice Int?        // Giá gốc để tính % giảm giá
  category      String      // serum, toner, sunscreen, makeup, mask, cleanser
  skinType      String      // all, oily, dry, sensitive, acne
  ingredients   String      // Thành phần chính (VD: Niacinamide 10%, Centella Asiatica)
  description   String      // Mô tả công dụng chi tiết
  usage         String      // Hướng dẫn sử dụng chi tiết
  images        String      // JSON array các URL ảnh studio chất lượng cao
  rating        Float       @default(4.8)
  reviewCount   Int         @default(0)
  isBestSeller  Boolean     @default(false)
  isNew         Boolean     @default(false)
  stock         Int         @default(50)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  orderItems    OrderItem[]
}

model Order {
  id              String      @id // Mã đơn hiển thị (VD: ORD-8823)
  customerName    String
  phone           String
  email           String
  shippingAddress String
  note            String?
  paymentMethod   String      // COD | VIETQR
  paymentStatus   String      @default("pending") // pending | paid
  orderStatus     String      @default("confirmed") // confirmed | preparing | shipping | completed
  totalAmount     Int
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  items           OrderItem[]
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  name        String
  price       Int
  quantity    Int
  image       String
}
```

---

## 4. Visual Design System (K-Beauty Aesthetic)

### 4.1. Color Tokens
- `--color-primary`: `#FF6B81` (Hồng san hô tươi K-Beauty)
- `--color-primary-gradient`: `linear-gradient(135deg, #FF6B81 0%, #FFA07A 100%)`
- `--color-primary-hover`: `#E85068`
- `--color-bg-light`: `#FDFBF9` (Nền trắng sứ cao cấp)
- `--color-bg-rose`: `#FFF0F3` (Nền phớt hồng pastel)
- `--color-bg-peach`: `#FFF6F0` (Nền tone đào nhẹ nhàng)
- `--color-border`: `#F1EBE7` (Viền mềm mại)
- `--color-text-main`: `#1E1E24` (Charcoal espresso độ tương phản cao)
- `--color-text-muted`: `#6B7280` (Màu chữ phụ)
- `--color-badge-bestseller`: `#F59E0B`
- `--color-badge-new`: `#10B981`
- `--color-badge-sale`: `#EF4444`

### 4.2. Typography & Hierarchy
- Font Family: `Plus Jakarta Sans`, sans-serif (tải từ Google Fonts).
- Header & Section Headings: Font weight 700 / 800, tracking nhẹ.
- Body text: Font weight 400 / 500, line-height 1.6, dễ chịu cho mắt.

### 4.3. Micro-interactions & Polish
- **Glassmorphism:** Navigation bar bán trong suốt với `backdrop-filter: blur(16px)` và viền mờ `rgba(255, 255, 255, 0.6)`.
- **Card Hover:** Đổ bóng hồng đào `0 12px 30px rgba(255, 107, 129, 0.15)`, nâng thẻ lên 6px.
- **Cart Slide-over:** Drawer trượt êm từ phải sang với hiệu ứng backdrop mờ.
- **Badge Animations:** Hiệu ứng nhịp đập nhẹ nhàng (pulse) cho các tag Giảm giá & Bán chạy.

---

## 5. Page Layouts & User Workflows

### 5.1. Home Page (`/`)
- **Promo Bar:** Banner thông báo trên cùng: "Miễn phí vận chuyển cho đơn hàng từ 399.000đ | Tặng kèm sample K-Beauty chính hãng".
- **Glassmorphism Header:** Logo `GlowSeoul K-Beauty`, menu điều hướng, ô tìm kiếm Live Search, icon giỏ hàng với số lượng realtime.
- **Hero Section:** Banner tương tác, visual mỹ phẩm rạng rỡ, tiêu đề "Đánh thức vẻ đẹp chuẩn Hàn", nút CTA "Khám phá ngay".
- **Shop by Skin Type:** Các thẻ chọn nhanh phân loại theo làn da:
  - *Da dầu & Lỗ chân lông* (Oily / Pore Care)
  - *Da khô & Cấp ẩm sâu* (Dry / Hydration)
  - *Da nhạy cảm & Phục hồi* (Sensitive / Soothing)
  - *Da mụn & Làm dịu* (Acne / Trouble Care)
- **Top Categories:** Thẻ hình ảnh bo góc mềm mại: Serum & Ampoule, Kem chống nắng, Toner cân bằng, Mặt nạ dưỡng, Son môi K-Beauty.
- **Best Sellers Grid:** 8 sản phẩm bán chạy nhất kèm Quick View và nút thêm nhanh vào giỏ.
- **Brand Showcase:** Logo các thương hiệu nổi bật: COSRX, Beauty of Joseon, Laneige, Innisfree, Rom&nd, Torriden.

### 5.2. Products & Filter Page (`/products`)
- **Live Search Input:** Tìm kiếm tức thời theo từ khóa tên hoặc thành phần.
- **Filter Sidebar:**
  - Phân loại theo Danh mục (Category).
  - Phân loại theo Thương hiệu (Brand).
  - Phân loại theo Loại da (Skin Type).
  - Lọc theo khoảng giá.
- **Sorting Options:** Bán chạy nhất, Giá thấp đến cao, Giá cao đến thấp, Đánh giá cao nhất.
- **Quick View Modal:** Xem pop-up chi tiết thành phần, chọn số lượng, thêm vào giỏ mà không cần rời trang.

### 5.3. Product Detail Page (`/products/[id]`)
- **Image Gallery:** Xem nhiều hình ảnh chất lượng cao.
- **Purchase Section:** Giá, % giảm giá, chọn số lượng, nút "Thêm vào giỏ" và "Mua ngay".
- **Tabs thông tin chuyên sâu:**
  - *Công dụng nổi bật (Key Benefits).*
  - *Thành phần chi tiết (Full Ingredients breakdown).*
  - *Cách sử dụng chuẩn K-Beauty Routine (How to Use).*
- **Related Products:** Gợi ý sản phẩm cùng thương hiệu hoặc cùng công dụng.

### 5.4. Cart & Slide-Over Drawer
- Quản lý số lượng (+/-) hoặc xóa sản phẩm.
- Thanh tiến độ Freeship: "Mua thêm X để được Freeship".
- Nút "Tiến hành đặt hàng" dẫn đến trang `/checkout`.

### 5.5. Checkout Page (`/checkout`)
- **Thông tin nhận hàng:** Tên, Số điện thoại, Địa chỉ giao hàng, Ghi chú.
- **Phương thức thanh toán:**
  - **COD:** Thanh toán khi nhận hàng.
  - **VietQR:** Sinh mã QR chuyển khoản tự động kèm logo ngân hàng, số tiền chính xác, mã đơn hàng.
- **Voucher giảm giá:** Nhập mã giảm giá (ví dụ: `KBEAUTY10` - giảm 10%).
- **Tóm tắt đơn hàng:** Tạm tính, phí vận chuyển (0đ nếu >= 399k, 30k nếu < 399k), giảm giá, tổng thanh toán.

### 5.6. Order Confirmation Page (`/orders/[id]`)
- Thông báo đặt hàng thành công.
- Mã đơn hàng để tra cứu.
- Trạng thái tiến trình đơn: *Đã tiếp nhận -> Đang xử lý -> Đang giao -> Hoàn thành*.
- Hiển thị lại mã VietQR nếu khách chọn thanh toán chuyển khoản và chưa thanh toán.

---

## 6. Implementation & Seed Data Plan

Dự án sẽ được khởi tạo với bộ dữ liệu mẫu gồm 15+ sản phẩm thật của K-Beauty:
1. *Beauty of Joseon Relief Sun: Rice + Probiotics (SPF50+ PA++++)*
2. *COSRX Advanced Snail 96 Mucin Power Essence*
3. *Laneige Lip Sleeping Mask (Berry)*
4. *Skin1004 Madagascar Centella Ampoule*
5. *Anua Heartleaf 77% Soothing Toner*
6. *Torriden DIVE-IN Low Molecular Hyaluronic Acid Serum*
7. *Rom&nd Juicy Lasting Tint*
8. *Innisfree Green Tea Seed Hyaluronic Serum*
9. *Round Lab Birch Juice Moisturizing Sun Cream*
10. *COSRX Low pH Good Morning Gel Cleanser*
11. *Some By Mi AHA-BHA-PHA 30 Days Miracle Toner*
12. *Klairs Freshly Juiced Vitamin Drop*
... cùng đầy đủ ảnh studio chân thực, công dụng và thành phần.

---

## 7. Self-Review & Quality Assurance

- **Placeholders:** Không có placeholder; toàn bộ đường dẫn, schema và danh mục đều cụ thể.
- **Contradictions:** Không có xung đột giữa công nghệ (Next.js App Router + SQLite) và các trang nghiệp vụ.
- **Ambiguity:** Các bước từ chọn hàng, lọc, thêm giỏ đến thanh toán VietQR đều được mô tả chi tiết.
- **Scope:** Đúng phạm vi MVP tập trung trải nghiệm mua hàng cho khách hàng, lưu đơn hàng thật vào DB.
