# 🌟 BỘ QUY CHUẨN KỸ THUẬT & CÔNG NGHỆ DỰ ÁN (PROJECT RULES & TECH STACK)

> Tài liệu chuẩn hóa toàn bộ công nghệ, kiến trúc và **các nguyên tắc kỹ thuật cốt lõi (Core Engineering Mindset)** được kế thừa từ tiêu chuẩn Enterprise cao cấp, áp dụng chuyên biệt cho hệ sinh thái **Next.js 15 + TypeScript + Prisma + Vanilla CSS Design System**.  
> Sử dụng làm kim chỉ nam (`AGENTS.md` hoặc `.cursorrules`) khi chuyển giao hoặc khởi tạo bất kỳ dự án mới nào.

---

## 🧠 PHẦN I: CÁC NGUYÊN TẮC VÀNG & TƯ DUY CỐT LÕI (CORE ENGINEERING MINDSET)

Đây là những tư duy bất biến bắt buộc phải tuân thủ trong mọi dòng code và quyết định kiến trúc:

### 1. Tư duy dữ liệu lớn (> 10.000 bản ghi)
* **Bắt buộc luôn đặt câu hỏi**: *"Nếu bảng này tăng lên 10.000 - 100.000 bản ghi thì code này có gây sập RAM hay nghẽn CPU không?"*
* **Tuyệt đối cấm**: Truy vấn dữ liệu thả phanh (`findMany()` không giới hạn `take`) đưa hàng nghìn bản ghi lên bộ nhớ.
* **Bắt buộc phân trang & lọc**: Mọi danh sách hiển thị đều phải có phân trang (`Pagination`) và bộ lọc tìm kiếm có debounce.
* **Cấm thẻ select nguyên thủy**: Không render danh sách `<option>` thô vào HTML cho danh mục/dữ liệu lớn. Bắt buộc dùng dropdown tìm kiếm (`CustomSelect`) hỗ trợ tìm kiếm tức thì hoặc dynamic fetch.

### 2. Kỷ luật Bảo mật & Phân quyền (Security & Authorization)
* **Quyền hạn đi liền tính năng**: Mọi chức năng (Feature/Action/API) bắt buộc phải gắn liền với hệ thống phân quyền (RBAC).
* **Kiểm tra quyền trước khi thực thi**: Luôn xác thực quyền (Check Permission / Gate) ở tầng backend/API trước khi can thiệp vào database.
* **Đồng bộ phân quyền lên UI**: Kiểm tra quyền trước khi render nút bấm hoặc giao diện tính năng. Nút hành động (Thêm/Sửa/Xóa/Export) phải tự động ẩn hoặc vô hiệu hóa nếu tài khoản không đủ quyền, không để người dùng bấm vào rồi mới báo lỗi.

### 3. Kỷ luật Thẩm mỹ & Màu sắc (Strict Taste & Design Discipline)
* **Nói KHÔNG với việc bịa mã màu HEX**: Tuyệt đối không tự ý viết các mã HEX ngẫu nhiên rải rác trong file.
* **Đồng bộ bảng màu**: Mọi màu sắc phải lấy từ Design Tokens chuẩn tại `globals.css` (hoặc kế thừa từ component cha) để đảm bảo 100% tính đồng nhất của hệ thống nhận diện.
* **Component-based**: Giao diện chia nhỏ dạng component dễ tái sử dụng, code gọn gàng, clean, chuẩn chỉnh. Không dùng text giữ chỗ (placeholder) ngô nghê hay hình ảnh tạm bợ kém chất lượng.

### 4. Kỷ luật Quy trình phát triển (AI Workflow & Engineering Constraints)
* **Plan-first (Kế hoạch trước khi thực thi)**: Luôn luôn trình bày kế hoạch các bước triển khai (Implementation Plan) để kiểm duyệt trước khi viết hoặc sửa code.
* **Bảo toàn mã nguồn cũ**: Tuyệt đối **KHÔNG** tự ý xóa hay thay đổi các hàm, logic cũ ngoài phạm vi yêu cầu khi chưa có sự xác nhận.
* **Tối đa hóa tái sử dụng**: Ưu tiên tận dụng tối đa các helper, component, service đã có sẵn (`src/lib/`, `src/components/ui/`). Chỉ đề xuất viết mới khi thực sự chưa có giải pháp thay thế.
* **Nói KHÔNG với suy đoán lý thuyết**: Phải đọc và kiểm tra code, schema thực tế trước khi kết luận.
* **Chuẩn hiển thị công thức & Ký hiệu**: 
  - Dùng `->` thay vì các ký hiệu toán LaTeX khó đọc.
  - Viết công thức bằng tiếng Việt rõ ràng, dạng khung code block kèm các bước tuần tự và ví dụ số liệu thực tế cụ thể:
    ```text
    Tổng thanh toán = Tạm tính - Tiền giảm voucher + Phí vận chuyển
    Ví dụ: 450.000₫ - 45.000₫ (10%) + 0₫ (Freeship) = 405.000₫
    ```
* **Không tự ý chụp ảnh màn hình**: Yêu cầu hỗ trợ bằng text nếu cần kiểm tra UI.
* **Quản lý tiến độ**: Thêm/cập nhật checklist đầu việc dev & test vào file `task.md`.

---

## 🚀 PHẦN II: CÔNG NGHỆ CỐT LÕI (CORE TECH STACK)

| Thành phần | Công nghệ / Thư viện | Phiên bản | Ghi chú & Mục đích |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | `^15.2.0` | Server Components (RSC) cho SEO/Performance, Client Components cho tương tác |
| **Giao diện** | **React** | `^19.0.0` | React 19 Server/Client Actions, Context API |
| **Ngôn ngữ** | **TypeScript** | `^5.7.3` | Strict mode, type-safe toàn bộ models, API payloads và props |
| **Database & ORM** | **Prisma ORM** | `^6.4.1` | Quản lý schema tập trung, type-safe query, hỗ trợ PostgreSQL / SQLite |
| **Styling** | **Vanilla CSS & Tokens** | Native CSS | Design system tập trung qua CSS Variables tại `globals.css`, không dùng Tailwind |
| **Typography** | **Google Fonts** | Hosted | `Plus Jakarta Sans` (chính) & `Playfair Display` (tiêu đề editorial) |
| **Iconography** | **Lucide React** | `^0.475.0` | Bộ icon SVG đồng bộ, nhẹ và hiện đại |
| **State Global** | **React Context** | Built-in | `CartContext`, `ToastContext`, `AuthContext` đồng bộ `localStorage` |
| **Xác thực (Auth)** | **Crypto Session + RBAC** | Node Native | Session token HMAC SHA-256 qua Cookie, hash PBKDF2, phân quyền Role/Permissions |
| **Thanh toán** | **VietQR + COD** | Napas247 | Sinh mã QR ngân hàng thanh toán tức thì chuẩn VietQR theo cú pháp tự động |
| **Kiểm thử** | **Vitest** | `^3.0.7` | Chạy test suite tự động nhanh chóng cho UI, API, DB models và utilities |
| **Runner** | **Node.js LTS** | `v20+` / `v22+` | Runtime môi trường phát triển và sản xuất |

---

## 📁 PHẦN III: KIẾN TRÚC THƯ MỤC CHUẨN

```text
├── prisma/
│   ├── schema.prisma              # Database schema (Models, Relations, Indexes)
│   └── seed.ts                    # Dữ liệu khởi tạo (Sản phẩm mẫu, danh mục, brands, admin role/user)
├── src/
│   ├── app/                       # Next.js 15 App Router
│   │   ├── (auth)/                # Route groups xác thực (login, register)
│   │   ├── admin/                 # Quản trị Master Data, Sản phẩm, Đơn hàng, Banner, Voucher
│   │   ├── api/                   # API Route Handlers (RESTful JSON endpoints)
│   │   │   ├── admin/             # API dành riêng cho quản trị nội bộ
│   │   │   ├── auth/              # API đăng nhập, đăng ký, đăng xuất, lấy session
│   │   │   └── orders/            # API đặt hàng, tra cứu đơn hàng
│   │   ├── products/              # Storefront catalog, bộ lọc đa năng & trang chi tiết [id]
│   │   ├── checkout/              # Trang thanh toán COD & hiển thị VietQR
│   │   ├── layout.tsx             # Root Layout (Gắn ToastProvider, CartProvider, Header, Footer)
│   │   ├── globals.css            # Toàn bộ CSS Tokens, Variables, Reset & Animations
│   │   └── page.tsx               # Trang chủ Storefront (Hero, Bestsellers, Skin Routine, Brands)
│   ├── components/                # Component-based Architecture
│   │   ├── ui/                    # Reusable UI Atoms (CustomSelect, Pagination, Toast, Modal)
│   │   ├── layout/                # Header, Footer, PromoBar, AdminSidebar
│   │   ├── product/               # ProductCard, FilterSidebar, LiveSearch, QuickViewModal
│   │   ├── cart/                  # CartDrawer, CartItem, FreeShippingBar
│   │   ├── checkout/              # VietQRModal, CheckoutForm
│   │   └── admin/                 # ProductListTable, OrderManager, TaxonomiesManager, CouponManager
│   ├── context/                   # React Context Providers (CartContext, ToastContext, AuthContext)
│   └── lib/                       # Core Logic, Helpers & Singletons
│       ├── db.ts                  # Prisma Client Singleton (chống rò rỉ kết nối dev)
│       ├── auth.ts                # Session token sign/verify, PBKDF2 password hasher
│       ├── vietqr.ts              # Generator URL VietQR Napas247 động
│       ├── filter.ts              # Query builder cho bộ lọc danh mục và loại da
│       ├── constants.ts           # Hạn mức Freeship, phí ship mặc định, cấu hình cố định
│       └── utils.ts               # Format tiền tệ VNĐ, tính % giảm giá, helper chuỗi
└── tests/                         # Thư mục kiểm thử tự động với Vitest (*.test.ts)
```

---

## ⚡ PHẦN IV: QUY ƯỚC LẬP TRÌNH NEXT.JS 15 (APP ROUTER)

1. **Phân định rõ Server Components vs Client Components**:
   - **Server Components (Mặc định)**: Toàn bộ layout, trang danh mục (`/products`), trang chi tiết (`/products/[id]`), trang chủ (`/`). Truy vấn trực tiếp Prisma trong Server Component để tối ưu SEO, loại bỏ waterfall API phía client.
   - **Client Components (`"use client"`)**: Chỉ khai báo ở đầu file cho các component thực sự cần tương tác của người dùng:
     - Form input, Modal, Drawer, Toast.
     - Component sử dụng hook: `useState`, `useEffect`, `useContext`, `useRouter`, `useSearchParams`.
     - Dropdown tìm kiếm (`CustomSelect`), giỏ hàng (`CartDrawer`), xem nhanh (`QuickViewModal`).

2. **Route Handlers (`src/app/api/.../route.ts`)**:
   - Sử dụng `NextRequest` và trả về `NextResponse.json(data, { status })`.
   - Bắt buộc bọc khối `try...catch` để bắt lỗi, trả về JSON có cấu trúc nhất quán:
     ```typescript
     // Thành công
     return NextResponse.json({ success: true, data: result }, { status: 200 });

     // Thất bại
     return NextResponse.json({ success: false, error: 'Thông báo lỗi cụ thể' }, { status: 400 });
     ```

3. **Prisma Client Singleton**:
   - Luôn import `prisma` từ `@/lib/db`. Không bao giờ `new PrismaClient()` trực tiếp trong từng component hay route handler để tránh cạn kiệt connection pool khi hot-reload.

---

## 🗄️ PHẦN V: QUY CHUẨN DATABASE & PRISMA SCHEMA

1. **Quy ước Model trong `prisma/schema.prisma`**:
   - Khóa chính sử dụng CUID dạng string: `id String @id @default(cuid())`.
   - Với đơn hàng (`Order`), sử dụng mã định danh người dùng dễ đọc (ví dụ: `ORD-1712345678`).
   - Luôn có `createdAt DateTime @default(now())` và `updatedAt DateTime @updatedAt` cho các model nghiệp vụ.
   - Bắt buộc đánh Index (`@@index([column])`) cho các trường thường xuyên tìm kiếm, lọc hoặc khóa ngoại (`userId`, `orderId`, `status`, `category`).
   - Quan hệ có cấu hình toàn vẹn khóa ngoại rõ ràng:
     - `onDelete: Cascade` khi xóa cha thì con bị xóa (ví dụ: Order -> OrderItems, Product -> Reviews).
     - `onDelete: SetNull` khi thông tin liên kết có thể nullable (ví dụ: Order -> User).

2. **Quy trình cập nhật Database**:
   - Thêm/sửa model trực tiếp trong `prisma/schema.prisma`.
   - Đồng bộ schema: `npx prisma db push`.
   - Cập nhật Prisma Client: `npx prisma generate`.
   - Chạy seed dữ liệu mẫu: `npm run seed` (`tsx prisma/seed.ts`).
   - Tuyệt đối không tự ý chạy các lệnh xóa toàn bộ DB (`prisma migrate reset`) nếu không có sự đồng ý.

---

## 🎨 PHẦN VI: HỆ THỐNG THẨM MỸ & DESIGN SYSTEM (VANILLA CSS)

1. **Quản lý Design Tokens tập trung tại `globals.css`**:
   - **Màu chủ đạo (Brand Primary)**:
     - `--color-primary: #ff6b81;`
     - `--color-primary-hover: #fa5252;`
     - `--color-primary-light: #fff0f3;`
     - `--color-gradient-brand: linear-gradient(135deg, #ff6b81 0%, #ffa07a 100%);`
   - **Nền & Bề mặt (Surfaces)**:
     - `--color-bg: #fdfbf9;` (tone ấm nhẹ, dịu mắt)
     - `--color-surface: #ffffff;`
     - `--color-border: #f0eae6;`
   - **Chữ (Typography)**:
     - `--color-text-main: #1e1e24;`
     - `--color-text-muted: #64748b;`
   - **Bo góc (Border Radius)**:
     - `--radius-sm: 8px;`, `--radius-md: 14px;`, `--radius-lg: 20px;`, `--radius-full: 9999px;`
   - **Bóng đổ (Shadows)**:
     - `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow` (ánh sáng mờ tinh tế).

2. **Quy tắc phối màu & Giao diện**:
   - **Cấm bịa mã HEX**: Mọi class CSS phải sử dụng biến token `var(--color-...)`.
   - **Hiệu ứng Kính mờ (Glassmorphism)**: Áp dụng `backdrop-filter: blur(12px)` kết hợp background bán trong suốt cho Header, PromoBar, Cart Drawer và QuickView Modal.
   - **Micro-animations**: Thời lượng từ 0.2s - 0.3s với timing-function mượt mà (`cubic-bezier(0.16, 1, 0.3, 1)`), hỗ trợ hiệu ứng hover scale nhẹ (`transform: translateY(-2px)`).

3. **Quy chuẩn Component Tương tác**:
   - **Bảng dữ liệu (Data Tables)**: Bắt buộc tích hợp component `Pagination` (chuyển trang, đếm tổng số mục) và thanh tìm kiếm/bộ lọc tức thì.
   - **Dropdown tìm kiếm (`CustomSelect`)**: Không dùng thẻ `<select>` thô sơ của trình duyệt. Dùng `CustomSelect` có ô tìm kiếm tích hợp, đóng khi click ngoài (backdrop) hoặc nhấn phím `Escape`.
   - **Thông báo Toast (`ToastContext`)**: Thông báo góc trên/dưới màn hình với animation trượt, tự biến mất sau 3 giây hoặc click đóng.

---

## 🔒 PHẦN VII: XÁC THỰC & BẢO MẬT PHÂN QUYỀN (AUTH & RBAC)

1. **Cơ chế Session Token tự phát hành**:
   - Quản lý qua `src/lib/auth.ts`:
     - Token cấu trúc: `base64url(payload).hmacSha256Signature`.
     - Payload gồm: `userId`, `email`, `name`, `role`, `permissions`, `expiresAt`.
     - Lưu trữ an toàn trong Cookie `glowseoul_session` với cấu hình `HttpOnly; Path=/; SameSite=Lax`.

2. **Bảo mật Mật khẩu**:
   - Sử dụng PBKDF2 với Dynamic Salt ngẫu nhiên 16 bytes:
     `crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512')`.
   - Chuỗi lưu DB có định dạng: `${salt}:${hash}`.

3. **Phân quyền vai trò (RBAC)**:
   - Model `Role` chứa chuỗi JSON `permissions`:
     - `["*"]`: Toàn quyền quản trị Admin.
     - `["orders:*", "products:view"]`: Quyền theo module cụ thể.
   - Kiểm tra quyền tại API Route hoặc Server Action trước khi thực thi các thao tác nhạy cảm:
     ```typescript
     const user = await getCurrentUserFromCookie(request.headers.get('cookie'));
     if (!user || (!user.permissions.includes('*') && !user.permissions.includes('products:manage'))) {
       return NextResponse.json({ error: 'Không có quyền thực hiện hành động này' }, { status: 403 });
     }
     ```

---

## 💳 PHẦN VIII: NGHIỆP VỤ E-COMMERCE ĐẶC THÙ

1. **Giỏ hàng (`CartContext`)**:
   - Tự động lưu và phục hồi từ `localStorage` (`glowseoul_cart`).
   - Tự động tính tiến trình Freeship theo ngưỡng hạn mức cố định (ví dụ: `399.000₫`).
   - Drawer giỏ hàng trượt từ phải sang với hiệu ứng mượt và backdrop làm mờ trang.

2. **Thanh toán VietQR Napas247**:
   - Sinh link ảnh QR động theo chuẩn Napas247:
     `https://img.vietqr.io/image/{bankId}-{accountNo}-compact2.png?amount={amount}&addInfo={orderId}&accountName={accountName}`.
   - Tương thích tức thì với tất cả các ứng dụng ngân hàng và ví điện tử tại Việt Nam mà không cần cài đặt cổng thanh toán phức tạp.

3. **Bộ lọc sản phẩm thông minh**:
   - Hỗ trợ lọc kết hợp: Danh mục (`category`), Tình trạng da (`skinType`: Da dầu, Da khô, Da nhạy cảm, Da mụn), Thương hiệu (`brand`), Sắp xếp theo giá và độ bán chạy.

---

## 🧪 PHẦN IX: TIÊU CHUẨN KIỂM THỬ (TESTING WITH VITEST)

1. Cấu trúc file test đặt tại thư mục `tests/*.test.ts`.
2. Chạy toàn bộ test suites:
   ```bash
   npm test
   ```
3. Mỗi khi thêm tính năng mới, tạo test case tương ứng để xác nhận:
   - Hợp đồng component (sự tồn tại của các props, class, element cần thiết).
   - Logic tính toán tiền tệ, giảm giá coupon, freeship.
   - Mã trạng thái và định dạng phản hồi của API Handlers.
   - Tính toàn vẹn của logic phân quyền RBAC và mã hóa Auth.
