import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skinType = 'oily', concern = 'acne', goal = 'glass_skin' } = body;

    // Fetch all catalog products with their categories and attributes
    const products = await prisma.product.findMany();

    // Helper to extract first image
    const getFirstImage = (imagesStr: string) => {
      try {
        const arr = JSON.parse(imagesStr);
        return arr[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
      } catch {
        return 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
      }
    };

    // 1. Cleanser Match
    let cleanser = products.find((p) => p.category === 'cleanser');
    if (!cleanser) {
      cleanser = products[0];
    }

    // 2. Toner Match
    let toner = products.find((p) => {
      if (p.category !== 'toner') return false;
      if (concern === 'acne' && p.name.includes('AHA-BHA-PHA')) return true;
      if ((skinType === 'sensitive' || concern === 'soothing') && p.name.includes('Anua')) return true;
      return true;
    }) || products.find((p) => p.category === 'toner') || products[1];

    // 3. Serum Match
    let serum = products.find((p) => {
      if (p.category !== 'serum') return false;
      if (concern === 'acne' || concern === 'soothing') {
        return p.name.includes('Centella') || p.brand === 'Skin1004';
      }
      if (skinType === 'dry' || concern === 'hydration') {
        return p.name.includes('Torriden') || p.name.includes('Hyaluronic');
      }
      if (goal === 'glass_skin') {
        return p.name.includes('Snail') || p.name.includes('COSRX');
      }
      return true;
    }) || products.find((p) => p.category === 'serum') || products[2];

    // 4. Sunscreen Match
    let sunscreen = products.find((p) => {
      if (p.category !== 'sunscreen') return false;
      if (skinType === 'dry' || concern === 'hydration') {
        return p.name.includes('Round Lab') || p.name.includes('Birch Juice');
      }
      return p.name.includes('Beauty of Joseon') || p.name.includes('Relief Sun');
    }) || products.find((p) => p.category === 'sunscreen') || products[3];

    // Build the 4 steps
    const steps = [
      {
        stepNumber: 1,
        stepName: 'Làm Sạch Dịu Nhẹ (Cleanser)',
        product: {
          id: cleanser.id,
          name: cleanser.name,
          brand: cleanser.brand,
          price: cleanser.price,
          originalPrice: cleanser.originalPrice,
          image: getFirstImage(cleanser.images),
        },
        reason: 'Độ pH 5.0 - 6.0 lý tưởng giúp rửa trôi bã nhờn, làm thông thoáng lỗ chân lông mà không làm tổn thương màng ẩm tự nhiên.',
      },
      {
        stepNumber: 2,
        stepName: 'Cân Bằng & Mở Đường Dưỡng (Toner)',
        product: {
          id: toner.id,
          name: toner.name,
          brand: toner.brand,
          price: toner.price,
          originalPrice: toner.originalPrice,
          image: getFirstImage(toner.images),
        },
        reason: toner.name.includes('Anua')
          ? 'Chứa 77% chiết xuất Diếp Cá hữu cơ, xoa dịu tức thì các nốt mẩn đỏ, kháng viêm và hạ nhiệt độ bề mặt da.'
          : 'Bộ 3 acid AHA-BHA-PHA thanh tẩy tế bào chết dịu nhẹ mỗi ngày, giảm bít tắc mụn ẩn và mụn đầu đen.',
      },
      {
        stepNumber: 3,
        stepName: 'Tinh Chất Đặc Trị Chuyên Sâu (Serum)',
        product: {
          id: serum.id,
          name: serum.name,
          brand: serum.brand,
          price: serum.price,
          originalPrice: serum.originalPrice,
          image: getFirstImage(serum.images),
        },
        reason: serum.name.includes('Torriden')
          ? 'Phức hợp 5 loại Hyaluronic Acid phân tử siêu nhỏ len lỏi cấp ẩm đa tầng, tạo hiệu ứng da ngậm nước căng bóng.'
          : serum.name.includes('Centella')
          ? '100% tinh chất rau má Madagascar tinh khiết tăng cường tái tạo biểu bì, giảm thâm đỏ và chữa lành hàng rào da.'
          : '96% dịch nhầy ốc sên cô đặc phục hồi độ đàn hồi, ngăn ngừa nếp nhăn và mang lại làn da Glass Skin chuẩn Hàn.',
      },
      {
        stepNumber: 4,
        stepName: 'Bảo Vệ Hàng Rào & Khóa Ẩm (Sunscreen)',
        product: {
          id: sunscreen.id,
          name: sunscreen.name,
          brand: sunscreen.brand,
          price: sunscreen.price,
          originalPrice: sunscreen.originalPrice,
          image: getFirstImage(sunscreen.images),
        },
        reason: sunscreen.name.includes('Beauty of Joseon')
          ? 'Chiết xuất cám gạo 30% kết hợp men vi sinh nuôi dưỡng hệ vi sinh da khỏe mạnh, chống tia UV đỉnh cao không vệt trắng.'
          : 'Nhựa cây bạch dương Birch Juice cấp nước liên tục 24h, finish ẩm mịn rạng rỡ không gây bết rít suốt ngày dài.',
      },
    ];

    const originalTotal = steps.reduce((sum, s) => sum + s.product.price, 0);
    const discountPercent = 10;
    const discountAmount = Math.round((originalTotal * discountPercent) / 100);
    const finalPrice = originalTotal - discountAmount;

    let routineTitle = 'Routine K-Beauty Chuẩn Hàn Glass Skin';
    let routineDesc = 'Phác đồ được tối ưu hóa cho làn da của bạn dựa trên 4 bước tinh giản nhưng đem lại hiệu quả phục hồi và căng bóng tối đa.';

    if (skinType === 'oily' || concern === 'acne') {
      routineTitle = 'Liệu Trình Kiềm Dầu, Ngừa Mụn & Cân Bằng Lỗ Chân Lông';
      routineDesc = 'Tập trung làm sạch sâu bã nhờn, kháng khuẩn dịu nhẹ và cấp nước tầng sâu để điều tiết lượng dầu thừa tiết ra.';
    } else if (skinType === 'dry' || concern === 'hydration') {
      routineTitle = 'Liệu Trình Cấp Ẩm Đa Tầng & Phục Hồi Hàng Rào Da Căng Mọng';
      routineDesc = 'Bơm đầy độ ẩm vào các tầng biểu bì khô ráp, tái thiết lập lớp màng lipid khóa ẩm bền vững.';
    } else if (skinType === 'sensitive' || concern === 'soothing') {
      routineTitle = 'Liệu Trình Làm Dịu Khẩn Cấp & Phục Hồi Da Nhạy Cảm';
      routineDesc = 'Thành phần thuần chay hữu cơ lành tính giúp giảm đỏ, tăng cường sức đề kháng cho làn da yếu nhạy cảm.';
    }

    return NextResponse.json({
      success: true,
      profile: {
        skinType,
        concern,
        goal,
        routineTitle,
        routineDesc,
      },
      steps,
      pricing: {
        originalTotal,
        discountPercent,
        discountAmount,
        finalPrice,
        couponCode: 'KBEAUTY10',
      },
    });
  } catch (error) {
    console.error('Error generating quiz routine:', error);
    return NextResponse.json({ error: 'Không thể tạo routine cá nhân hóa' }, { status: 500 });
  }
}
