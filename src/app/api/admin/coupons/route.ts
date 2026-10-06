import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ error: 'Không thể tải danh sách mã giảm giá' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, discountPercent, minOrderAmount, maxDiscount, expiresAt, isActive } = body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Mã giảm giá không được để trống' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const percent = Number(discountPercent);
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      return NextResponse.json({ error: 'Phần trăm giảm giá phải từ 1% đến 100%' }, { status: 400 });
    }

    const minAmount = minOrderAmount !== undefined ? Math.max(0, Math.round(Number(minOrderAmount))) : 0;
    const maxDisc = maxDiscount ? Math.round(Number(maxDiscount)) : null;

    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });
    if (existing) {
      return NextResponse.json({ error: 'Mã giảm giá này đã tồn tại' }, { status: 409 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discountPercent: Math.round(percent),
        minOrderAmount: minAmount,
        maxDiscount: maxDisc,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: 'Không thể tạo mã giảm giá' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã ID coupon' }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy mã giảm giá' }, { status: 404 });
    }

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: 'Không thể xoá mã giảm giá' }, { status: 500 });
  }
}
