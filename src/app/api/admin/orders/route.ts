import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserFromCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const orderStatus = searchParams.get('orderStatus')?.trim() || '';
    const paymentStatus = searchParams.get('paymentStatus')?.trim() || '';
    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');

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

    const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : null;
    const pageSize = pageSizeParam ? Math.min(100, Math.max(1, parseInt(pageSizeParam, 10) || 10)) : null;

    const findOptions: any = {
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    };

    if (page && pageSize) {
      findOptions.skip = (page - 1) * pageSize;
      findOptions.take = pageSize;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany(findOptions),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page: page || 1,
      pageSize: pageSize || total,
      totalPages: pageSize ? Math.ceil(total / pageSize) : 1,
    });
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
    const cookieHeader = request.headers.get('cookie');
    const currentUser = await getCurrentUserFromCookie(cookieHeader);
    if (currentUser) {
      const isAllowed =
        currentUser.role === 'ADMIN' ||
        currentUser.permissions.includes('*') ||
        currentUser.permissions.includes('orders:*') ||
        currentUser.permissions.includes('orders:manage');
      if (!isAllowed) {
        return NextResponse.json(
          { error: 'Bạn không có quyền cập nhật đơn hàng' },
          { status: 403 }
        );
      }
    }

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
