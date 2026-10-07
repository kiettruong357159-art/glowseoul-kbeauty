import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserFromCookie } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: session.id },
          { email: session.email.toLowerCase() },
        ],
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching account orders:', error);
    return NextResponse.json({ error: 'Lỗi tải danh sách đơn hàng' }, { status: 500 });
  }
}
