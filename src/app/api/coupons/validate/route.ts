import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ valid: false, message: 'Vui lòng nhập mã giảm giá' }, { status: 200 });
    }

    const cleanCode = code.trim().toUpperCase();
    const orderSubtotal = Math.max(0, Number(subtotal) || 0);

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (coupon) {
      if (!coupon.isActive) {
        return NextResponse.json({
          valid: false,
          message: 'Mã giảm giá này hiện đang tạm ngừng kích hoạt',
        });
      }

      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return NextResponse.json({
          valid: false,
          message: 'Mã giảm giá này đã hết hạn sử dụng',
        });
      }

      if (orderSubtotal < coupon.minOrderAmount) {
        return NextResponse.json({
          valid: false,
          message: `Mã giảm giá chỉ áp dụng cho đơn hàng tối thiểu ${coupon.minOrderAmount.toLocaleString('vi-VN')}₫`,
        });
      }

      let discountAmount = Math.round(orderSubtotal * (coupon.discountPercent / 100));
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }

      return NextResponse.json({
        valid: true,
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount,
      });
    }

    // Fallback for default voucher KBEAUTY10 if database is unseeded
    if (cleanCode === 'KBEAUTY10') {
      const discountAmount = Math.round(orderSubtotal * 0.1);
      return NextResponse.json({
        valid: true,
        code: 'KBEAUTY10',
        discountPercent: 10,
        discountAmount,
      });
    }

    return NextResponse.json({
      valid: false,
      message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn',
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { valid: false, message: 'Không thể xác thực mã giảm giá, vui lòng thử lại' },
      { status: 500 }
    );
  }
}
