import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, portal = 'storefront' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ email và mật khẩu' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Tài khoản của bạn đã bị tạm khoá. Vui lòng liên hệ quản trị viên' },
        { status: 403 }
      );
    }

    const isValidPassword = verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // Portal Access Control:
    // If logging into admin portal, verify role is ADMIN or STAFF
    if (portal === 'admin' && user.role.name !== 'ADMIN' && user.role.name !== 'STAFF') {
      return NextResponse.json(
        { error: 'Tài khoản của bạn không có quyền truy cập vào Cổng Quản Trị' },
        { status: 403 }
      );
    }

    let permissions: string[] = [];
    try {
      permissions = JSON.parse(user.role.permissions || '[]');
    } catch {
      permissions = [];
    }

    // Create session token
    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      permissions,
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      phone: user.phone,
      role: user.role.name,
      roleDisplayName: user.role.displayName,
      permissions,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: safeUser,
    });

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra trong quá trình đăng nhập' },
      { status: 500 }
    );
  }
}
