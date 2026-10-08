import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();

    // 1. Tìm chiến dịch Flash Sale đang diễn ra trong khung giờ hiện tại
    const activeSale = await prisma.flashSale.findFirst({
      where: {
        isActive: true,
        startTime: { lte: now },
        endTime: { gt: now },
      },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            soldQuantity: 'desc',
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    if (activeSale) {
      return NextResponse.json({
        success: true,
        status: 'active',
        flashSale: activeSale,
        serverTime: now.toISOString(),
      });
    }

    // 2. Nếu không có chiến dịch active, tìm chiến dịch sắp diễn ra tiếp theo
    const upcomingSale = await prisma.flashSale.findFirst({
      where: {
        isActive: true,
        startTime: { gt: now },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      status: upcomingSale ? 'upcoming' : 'none',
      flashSale: upcomingSale || null,
      serverTime: now.toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching active flash sale:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ khi lấy thông tin Flash Sale' },
      { status: 500 }
    );
  }
}
