import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserFromCookie } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        phone: true,
        address: true,
        roleName: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching account profile:', error);
    return NextResponse.json({ error: 'Lỗi tải thông tin cá nhân' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getCurrentUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(phone !== undefined ? { phone: phone?.trim() || null } : {}),
        ...(address !== undefined ? { address: address?.trim() || null } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        phone: true,
        address: true,
        roleName: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating account profile:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật thông tin' }, { status: 500 });
  }
}
