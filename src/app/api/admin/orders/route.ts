import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const orderStatus = searchParams.get('orderStatus')?.trim() || '';
    const paymentStatus = searchParams.get('paymentStatus')?.trim() || '';

    const where: any = {};

    if (orderStatus) {
      where.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (q) {
      where.OR = [
        { id: { contains: q } },
        { customerName: { contains: q } },
        { phone: { contains: q } },
        { email: { contains: q } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách đơn hàng' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, orderStatus, paymentStatus, note } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã đơn hàng' }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    const dataToUpdate: any = {};
    if (orderStatus !== undefined) dataToUpdate.orderStatus = orderStatus;
    if (paymentStatus !== undefined) dataToUpdate.paymentStatus = paymentStatus;
    if (note !== undefined) dataToUpdate.note = note;

    const order = await prisma.order.update({
      where: { id },
      data: dataToUpdate,
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật đơn hàng' },
      { status: 500 }
    );
  }
}
