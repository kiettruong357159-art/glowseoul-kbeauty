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

async function main() {
  console.log('Seeding K-Beauty products into SQLite...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const item of sampleProducts) {
    await prisma.product.create({
      data: item,
    });
  }

  const count = await prisma.product.count();
  console.log(`Successfully seeded ${count} K-Beauty products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
