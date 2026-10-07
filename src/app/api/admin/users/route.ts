import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserFromCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const currentUser = await getCurrentUserFromCookie(cookieHeader);

    // Only ADMIN can manage users
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Chỉ Quản trị viên mới có quyền quản lý người dùng' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase().trim() || '';
    const roleFilter = searchParams.get('role')?.toUpperCase().trim() || '';

    const where: any = {};
    if (roleFilter) {
      where.roleName = roleFilter;
    }
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const [users, roles, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { role: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.role.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.user.count({ where }),
    ]);

    // Sanitize password before sending
    const sanitizedUsers = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      avatar: u.avatar,
      phone: u.phone,
      roleId: u.roleId,
      roleName: u.role.name,
      roleDisplayName: u.role.displayName,
      isActive: u.isActive,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({
      users: sanitizedUsers,
      roles,
      total,
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải danh sách người dùng' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const currentUser = await getCurrentUserFromCookie(cookieHeader);

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Chỉ Quản trị viên mới có quyền cập nhật người dùng' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, roleName, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu mã người dùng (id)' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    // Prevent deactivating own account
    if (existingUser.id === currentUser.id && isActive === false) {
      return NextResponse.json(
        { error: 'Bạn không thể tự vô hiệu hóa tài khoản của chính mình' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    if (roleName) {
      const targetRole = await prisma.role.findUnique({
        where: { name: roleName },
      });
      if (!targetRole) {
        return NextResponse.json(
          { error: `Vai trò "${roleName}" không tồn tại` },
          { status: 400 }
        );
      }
      updateData.roleId = targetRole.id;
      updateData.roleName = targetRole.name;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Cập nhật tài khoản thành công',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        roleName: updatedUser.role.name,
        roleDisplayName: updatedUser.role.displayName,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật thông tin người dùng' },
      { status: 500 }
    );
  }
}
