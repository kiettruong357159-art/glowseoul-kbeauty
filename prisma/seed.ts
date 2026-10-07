import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: 'Tinh Chất Phục Hồi Ốc Sên COSRX Advanced Snail 96 Mucin Power Essence',
    brand: 'COSRX',
    price: 285000,
    originalPrice: 380000,
    category: 'serum',
    skinType: 'sensitive',
    ingredients: '96.3% Dịch nhầy ốc sên (Snail Secretion Filtrate), Sodium Hyaluronate, Panthenol, Allantoin',
    description: 'Chứa 96.3% dịch nhầy ốc sên nguyên chất, cấp ẩm sâu, phục hồi hàng rào bảo vệ da, làm dịu da kích ứng và cải thiện độ đàn hồi cho làn da căng bóng mịn màng chuẩn Hàn.',
    usage: 'Sau bước toner, lấy một lượng vừa đủ vỗ nhẹ lên toàn bộ khuôn mặt cho đến khi tinh chất thẩm thấu hoàn toàn.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-2e652613279c?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.9,
    reviewCount: 342,
    isBestSeller: true,
    isNew: false,
    stock: 80,
  },
  {
    name: 'Kem Chống Nắng Lúa Mạch & Men Vi Sinh Beauty of Joseon Relief Sun: Rice + Probiotics',
    brand: 'Beauty of Joseon',
    price: 320000,
    originalPrice: 420000,
    category: 'sunscreen',
    skinType: 'all',
    ingredients: '30% Chiết xuất cám gạo, Phức hợp Men vi sinh (Grain Probiotics), Niacinamide 2%',
    description: 'Kem chống nắng hóa học quang phổ rộng SPF50+ PA++++ với kết cấu mỏng nhẹ như kem dưỡng, không vệt trắng, làm dịu da và nuôi dưỡng làn da sáng khỏe tự nhiên.',
    usage: 'Thoa đều lên mặt và cổ ở bước cuối cùng của chu trình skincare buổi sáng, trước khi ra nắng 20 phút.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.9,
    reviewCount: 520,
    isBestSeller: true,
    isNew: false,
    stock: 120,
  },
  {
    name: 'Mặt Nạ Ngủ Dưỡng Môi Laneige Lip Sleeping Mask (Berry Hương Dâu)',
    brand: 'Laneige',
    price: 340000,
    originalPrice: 450000,
    category: 'mask',
    skinType: 'all',
    ingredients: 'Công nghệ Moisture Wrap™, Chiết xuất quả mọng Berry Mix Complex giàu Vitamin C, Hyaluronic Acid',
    description: 'Nhẹ nhàng làm tan tế bào da chết trên môi suốt đêm, cung cấp độ ẩm dồi dào cho đôi môi căng mọng, mềm mịn và hồng hào rạng rỡ vào mỗi sáng thức dậy.',
    usage: 'Trước khi đi ngủ, dùng cọ hoặc đầu ngón tay lấy một lượng vừa đủ thoa đều lên môi. Sáng hôm sau dùng bông cotton lau nhẹ.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.8,
    reviewCount: 285,
    isBestSeller: true,
    isNew: false,
    stock: 65,
  },
  {
    name: 'Tinh Chất Rau Má Làm Dịu Da Skin1004 Madagascar Centella Ampoule',
    brand: 'Skin1004',
    price: 310000,
    originalPrice: 410000,
    category: 'serum',
    skinType: 'acne',
    ingredients: '100% Chiết xuất rau má vùng Madagascar (Centella Asiatica Extract)',
    description: 'Chứa 100% chiết xuất rau má tinh khiết từ đảo Madagascar giúp kháng viêm, làm dịu tức thì các vết mụn sưng đỏ, củng cố hàng rào bảo vệ cho da nhạy cảm mụn.',
    usage: 'Nhỏ 2-3 giọt tinh chất lên trán và hai má, thoa đều và vỗ nhẹ để dưỡng chất thẩm thấu sâu vào da.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.8,
    reviewCount: 198,
    isBestSeller: false,
    isNew: true,
    stock: 50,
  },
  {
    name: 'Nước Hoa Hồng Cân Bằng Dịu Nhẹ Anua Heartleaf 77% Soothing Toner',
    brand: 'Anua',
    price: 360000,
    originalPrice: 480000,
    category: 'toner',
    skinType: 'sensitive',
    ingredients: '77% Chiết xuất lá diếp cá (Houttuynia Cordata Extract), Panthenol, Chiết xuất rau má',
    description: 'Toner quốc dân tại Hàn Quốc với 77% chiết xuất lá diếp cá lành tính, kiểm soát bã nhờn, làm dịu các đốm đỏ và cấp nước cân bằng độ pH chuẩn 5.5-6.0 cho da.',
    usage: 'Thấm toner ra bông tẩy trang lau nhẹ theo chiều cấu trúc da hoặc đổ ra lòng bàn tay vỗ trực tiếp.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.9,
    reviewCount: 410,
    isBestSeller: true,
    isNew: false,
    stock: 90,
  },
  {
    name: 'Serum Cấp Nước Đa Tầng Torriden DIVE-IN Low Molecular Hyaluronic Acid',
    brand: 'Torriden',
    price: 345000,
    originalPrice: 460000,
    category: 'serum',
    skinType: 'dry',
    ingredients: 'Phức hợp 5 loại Hyaluronic Acid phân tử siêu nhỏ, D-Panthenol, Allantoin, Chiết xuất Malachite',
    description: 'Top 1 Hwahae nhiều năm liền, công thức 5D Hyaluronic Acid cấp ẩm sâu đến từng tế bào biểu bì, làm mờ nếp nhăn do thiếu nước mà không hề gây bết dính.',
    usage: 'Sử dụng sáng và tối sau bước làm sạch và toner, thoa đều từ 3-4 giọt khắp mặt.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.9,
    reviewCount: 312,
    isBestSeller: true,
    isNew: true,
    stock: 75,
  },
  {
    name: 'Son Kem Lì Mịn Như Mơ Rom&nd Zero Velvet Tint #06 Deeptoul',
    brand: 'Rom&nd',
    price: 185000,
    originalPrice: 240000,
    category: 'makeup',
    skinType: 'all',
    ingredients: 'Dầu hạt Macadamia, Vitamin E, Hạt sắc tố màu khoáng cao cấp',
    description: 'Chất son xốp nhẹ tênh như nhung, hiệu ứng làm mờ rãnh môi đỉnh cao, gam màu đỏ nâu Deeptoul tôn da thần thái cho mọi phong cách trang điểm K-Beauty.',
    usage: 'Thoa một lượng nhỏ vào lòng môi rồi tán đều ra viền môi hoặc đánh full môi nổi bật.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.7,
    reviewCount: 650,
    isBestSeller: true,
    isNew: false,
    stock: 150,
  },
  {
    name: 'Sữa Rửa Mặt Dịu Nhẹ Độ pH Thấp COSRX Low pH Good Morning Gel Cleanser',
    brand: 'COSRX',
    price: 165000,
    originalPrice: 220000,
    category: 'cleanser',
    skinType: 'oily',
    ingredients: 'Chiết xuất tràm trà tự nhiên (Tea Tree Oil), BHA tự nhiên 0.5%',
    description: 'Gel rửa mặt làm sạch sâu bã nhờn và tạp chất trong lỗ chân lông mà không làm khô căng rát da, duy trì độ ẩm cân bằng lý tưởng sau khi rửa.',
    usage: 'Lấy lượng gel cỡ hạt đậu, tạo bọt với nước ấm, massage nhẹ nhàng khắp mặt trong 60 giây rồi rửa sạch.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.7,
    reviewCount: 420,
    isBestSeller: true,
    isNew: false,
    stock: 95,
  },
  {
    name: 'Kem Dưỡng Chống Nắng Cấp Nước Round Lab Birch Juice Moisturizing Sun Cream',
    brand: 'Round Lab',
    price: 335000,
    originalPrice: 430000,
    category: 'sunscreen',
    skinType: 'dry',
    ingredients: 'Nhựa cây bạch dương Inje (Birch Juice), Hyaluronic Acid, Niacinamide',
    description: 'Chỉ số bảo vệ đỉnh cao SPF50+ PA++++ kết hợp dưỡng chất từ nhựa cây bạch dương giúp da luôn mọng nước, làm dịu làn da mệt mỏi do tác hại tia cực tím.',
    usage: 'Sử dụng mỗi buổi sáng ở bước chăm sóc da cuối cùng.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.9,
    reviewCount: 290,
    isBestSeller: true,
    isNew: true,
    stock: 60,
  },
  {
    name: 'Serum Trà Xanh Cấp Ẩm Chuyên Sâu Innisfree Green Tea Seed Hyaluronic Serum',
    brand: 'Innisfree',
    price: 490000,
    originalPrice: 620000,
    category: 'serum',
    skinType: 'dry',
    ingredients: 'Beauty Green Tea™ cô đặc từ đảo Jeju, Phức hợp Hyaluronic Acid nano thẩm thấu nhanh',
    description: 'Cấp ẩm tức thì gấp 7 lần, phục hồi hàng rào bảo vệ da chỉ sau 30 phút, đem lại làn da sáng mịn, đàn hồi và tươi trẻ tự nhiên.',
    usage: 'Bơm 2-3 pump sau khi làm sạch mặt, vỗ nhẹ cho tinh chất thẩm thấu sâu.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.8,
    reviewCount: 175,
    isBestSeller: false,
    isNew: false,
    stock: 40,
  },
  {
    name: 'Mặt Nạ Đất Sét Thu Nhỏ Lỗ Chân Lông Innisfree Super Volcanic Pore Clay Mask 2X',
    brand: 'Innisfree',
    price: 295000,
    originalPrice: 380000,
    category: 'mask',
    skinType: 'oily',
    ingredients: 'Đá tro núi lửa Jeju Volcanic Cluster Sphere™, Bột vỏ quả óc chó, AHA',
    description: 'Giải pháp toàn diện 10 trong 1: Hút sạch 98% bã nhờn thừa, làm sạch sâu tế bào chết, se khít lỗ chân lông và làm mát da tức thì.',
    usage: 'Sau khi rửa mặt, thoa đều lên da khô tránh vùng mắt môi. Để 10-15 phút rồi rửa sạch với nước ấm kết hợp massage.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.7,
    reviewCount: 260,
    isBestSeller: false,
    isNew: false,
    stock: 55,
  },
  {
    name: 'Nước Thần Trị Mụn 30 Ngày Some By Mi AHA-BHA-PHA 30 Days Miracle Toner',
    brand: 'Some By Mi',
    price: 265000,
    originalPrice: 360000,
    category: 'toner',
    skinType: 'acne',
    ingredients: 'Phức hợp AHA - BHA - PHA, 10.000ppm Chiết xuất Tràm trà (Tea Tree)',
    description: 'Bộ ba acid làm sạch tế bào sừng già cỗi, gom cồi mụn, giảm mụn viêm và kháng khuẩn hiệu quả rõ rệt chỉ sau 30 ngày kiên trì sử dụng.',
    usage: 'Thấm toner lên bông tẩy trang lau nhẹ khắp mặt 2 lần mỗi ngày sáng và tối.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'
    ]),
    rating: 4.6,
    reviewCount: 380,
    isBestSeller: false,
    isNew: false,
    stock: 70,
  },
];

const sampleCategories = [
  { name: 'Serum & Tinh Chất', slug: 'serum', description: 'Tinh chất dưỡng sâu phục hồi da chuyên biệt chuẩn Hàn' },
  { name: 'Kem Chống Nắng', slug: 'sunscreen', description: 'Chống nắng phổ rộng bảo vệ da tối ưu' },
  { name: 'Mặt Nạ Dưỡng Da', slug: 'mask', description: 'Mặt nạ ngủ và mặt nạ đất sét cấp ẩm tức thì' },
  { name: 'Nước Hoa Hồng (Toner)', slug: 'toner', description: 'Cân bằng độ ẩm và làm dịu da nhạy cảm' },
  { name: 'Sữa Rửa Mặt', slug: 'cleanser', description: 'Làm sạch sâu bã nhờn dịu nhẹ lành tính' },
  { name: 'Trang Điểm (Makeup)', slug: 'makeup', description: 'Son môi và mỹ phẩm trang điểm chuẩn phong cách Hàn Quốc' },
];

const sampleBrands = [
  { name: 'COSRX', slug: 'cosrx', tag: 'Dược mỹ phẩm dịu nhẹ', origin: 'Hàn Quốc' },
  { name: 'Beauty of Joseon', slug: 'beauty-of-joseon', tag: 'Thảo mộc Hanbang truyền thống', origin: 'Hàn Quốc' },
  { name: 'Laneige', slug: 'laneige', tag: 'Dưỡng ẩm mọng nước', origin: 'Hàn Quốc' },
  { name: 'Skin1004', slug: 'skin1004', tag: 'Rau má Madagascar', origin: 'Hàn Quốc' },
  { name: 'Anua', slug: 'anua', tag: 'Diếp cá làm dịu da', origin: 'Hàn Quốc' },
  { name: 'Torriden', slug: 'torriden', tag: 'Cấp nước đa tầng', origin: 'Hàn Quốc' },
  { name: 'Rom&nd', slug: 'romand', tag: 'Makeup thời thượng', origin: 'Hàn Quốc' },
  { name: 'Innisfree', slug: 'innisfree', tag: 'Thiên nhiên đảo Jeju', origin: 'Hàn Quốc' },
  { name: 'Round Lab', slug: 'round-lab', tag: 'Nhựa cây bạch dương', origin: 'Hàn Quốc' },
  { name: 'Some By Mi', slug: 'some-by-mi', tag: 'Chuyên gia trị mụn', origin: 'Hàn Quốc' },
];

const sampleCoupons = [
  { code: 'KBEAUTY10', discountPercent: 10, minOrderAmount: 0, isActive: true },
  { code: 'GLOW20', discountPercent: 20, minOrderAmount: 500000, isActive: true },
];

const sampleBanners = [
  {
    type: 'promo_bar',
    title: 'Freeship toàn quốc đơn từ 399K • Nhập KBEAUTY10 giảm 10%',
    badgeText: 'HOT PROMO',
    linkUrl: '/products',
    isActive: true,
  },
  {
    type: 'hero',
    title: 'Đánh Thức Làn Da Sáng Mịn Căng Bóng Chuẩn Hàn',
    subtitle: 'Khám phá bộ sưu tập tinh chất ốc sên COSRX, kem chống nắng Beauty of Joseon, và các thương hiệu mỹ phẩm Hàn Quốc được yêu thích nhất toàn cầu.',
    badgeText: 'K-Beauty Trending 2026 • 100% Chính Hãng',
    linkUrl: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
];

async function main() {
  console.log('Seeding K-Beauty master data, users & reviews into PostgreSQL Supabase...');
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();

  // 1. Seed Roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      displayName: 'Quản trị viên',
      description: 'Toàn quyền quản trị hệ thống, dữ liệu gốc, đơn hàng và phân quyền',
      permissions: JSON.stringify(['*']),
    },
  });

  const staffRole = await prisma.role.create({
    data: {
      name: 'STAFF',
      displayName: 'Nhân viên vận hành',
      description: 'Xem & xử lý đơn hàng, cập nhật số lượng tồn kho sản phẩm',
      permissions: JSON.stringify(['orders:read', 'orders:write', 'products:read', 'products:stock']),
    },
  });

  const customerRole = await prisma.role.create({
    data: {
      name: 'CUSTOMER',
      displayName: 'Khách hàng',
      description: 'Khách hàng mua sắm, theo dõi đơn hàng cá nhân',
      permissions: JSON.stringify(['orders:own', 'profile:edit']),
    },
  });

  // 2. Seed Users (with hashed passwords using pbkdf2)
  const { hashPassword } = await import('../src/lib/auth');

  await prisma.user.create({
    data: {
      email: 'admin@glowseoul.vn',
      name: 'Quản Trị Viên GlowSeoul',
      password: hashPassword('admin123'),
      roleId: adminRole.id,
      roleName: 'ADMIN',
      phone: '0909123456',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
  });

  await prisma.user.create({
    data: {
      email: 'staff@glowseoul.vn',
      name: 'Trần Nhân Viên',
      password: hashPassword('staff123'),
      roleId: staffRole.id,
      roleName: 'STAFF',
      phone: '0908765432',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  });

  await prisma.user.create({
    data: {
      email: 'customer@glowseoul.vn',
      name: 'Lê Khách Hàng',
      password: hashPassword('customer123'),
      roleId: customerRole.id,
      roleName: 'CUSTOMER',
      phone: '0912345678',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
  });

  for (const item of sampleProducts) {
    await prisma.product.create({ data: item });
  }

  for (const cat of sampleCategories) {
    await prisma.category.create({ data: cat });
  }

  for (const brand of sampleBrands) {
    await prisma.brand.create({ data: brand });
  }

  for (const coupon of sampleCoupons) {
    await prisma.coupon.create({ data: coupon });
  }

  for (const banner of sampleBanners) {
    await prisma.banner.create({ data: banner });
  }

  // 3. Seed initial authentic K-Beauty customer reviews
  const allProducts = await prisma.product.findMany();
  const cosrxSnail = allProducts.find(p => p.name.includes('COSRX') && p.name.includes('Snail'));
  const bojSun = allProducts.find(p => p.name.includes('Beauty of Joseon'));
  const torriden = allProducts.find(p => p.name.includes('Torriden'));
  const anua = allProducts.find(p => p.name.includes('Anua'));

  if (cosrxSnail) {
    await prisma.review.create({
      data: {
        productId: cosrxSnail.id,
        rating: 5,
        title: 'Cứu tinh cho da nhạy cảm mất nước!',
        comment: 'Da căng mọng ngậm nước sau 2 tuần dùng đều đặn sáng tối. Da mình cực kỳ nhạy cảm và dễ kích ứng nhưng dùng em ốc sên này trộm vía êm ru, phục hồi hàng rào da siêu đỉnh!',
        authorName: 'Ngọc Mai',
        authorEmail: 'ngocmai@gmail.com',
        skinType: 'sensitive',
        isVerifiedPurchase: true,
      },
    });
    await prisma.review.create({
      data: {
        productId: cosrxSnail.id,
        rating: 5,
        title: 'Chất nhầy thấm nhanh bất ngờ',
        comment: 'Lúc đầu sợ bết rít vì kết cấu nhờn của ốc sên nhưng vỗ lên mặt tầm 1 phút là thấm sạch bong, tạo hiệu ứng glowy mướt mát tự nhiên chuẩn Hàn. Chắc chắn sẽ mua lại!',
        authorName: 'Khánh Linh',
        authorEmail: 'khanhlinh@gmail.com',
        skinType: 'dry',
        isVerifiedPurchase: true,
      },
    });
  }

  if (bojSun) {
    await prisma.review.create({
      data: {
        productId: bojSun.id,
        rating: 5,
        title: 'Kem chống nắng chân ái mùa hè',
        comment: 'Chất kem mỏng nhẹ như kem dưỡng ẩm, không để lại bất kỳ vệt trắng nào, không châm chích mắt. Lớp finish bóng nhẹ khỏe khoắn chứ không hề đổ dầu.',
        authorName: 'Thuỳ Trang',
        authorEmail: 'thuytrang@gmail.com',
        skinType: 'all',
        isVerifiedPurchase: true,
      },
    });
  }

  if (torriden) {
    await prisma.review.create({
      data: {
        productId: torriden.id,
        rating: 5,
        title: 'Cấp ẩm đa tầng cực đỉnh',
        comment: 'Ngồi văn phòng điều hòa 8 tiếng da hay bị khô căng tróc vảy ở cánh mũi, dùng serum Torriden này tầm 3 ngày là hết hẳn. Phân tử HA siêu nhỏ thấm cực sâu.',
        authorName: 'Bảo Trâm',
        authorEmail: 'baotram@gmail.com',
        skinType: 'dry',
        isVerifiedPurchase: true,
      },
    });
  }

  if (anua) {
    await prisma.review.create({
      data: {
        productId: anua.id,
        rating: 5,
        title: 'Làm dịu nốt mụn đỏ sưng viêm',
        comment: 'Chiết xuất 77% diếp cá quá đỉnh, mình hay thấm ra bông đắp toner pad 5 phút các nốt mụn sưng gom cồi nhanh hơn hẳn.',
        authorName: 'Minh Anh',
        authorEmail: 'minhanh@gmail.com',
        skinType: 'acne',
        isVerifiedPurchase: true,
      },
    });
  }

  const pCount = await prisma.product.count();
  const cCount = await prisma.category.count();
  const bCount = await prisma.brand.count();
  const cpCount = await prisma.coupon.count();
  const bnCount = await prisma.banner.count();
  const rCount = await prisma.role.count();
  const uCount = await prisma.user.count();
  const rvCount = await prisma.review.count();
  console.log(`Seeded: ${rCount} roles, ${uCount} users, ${pCount} products, ${cCount} categories, ${bCount} brands, ${cpCount} coupons, ${bnCount} banners, ${rvCount} reviews!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
