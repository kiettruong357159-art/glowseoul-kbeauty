import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserFromCookie } from '@/lib/auth';

/**
 * Kiểm tra quyền quản trị Flash Sale (ADMIN hoặc có quyền products:manage / *)
 */
async function checkManagePermission(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const currentUser = await getCurrentUserFromCookie(cookieHeader);

  if (!currentUser) {
    return { authorized: false, status: 401, error: 'Vui lòng đăng nhập để tiếp tục' };
  }

  const isAllowed =
    currentUser.role === 'ADMIN' ||
    currentUser.permissions.includes('*') ||
    currentUser.permissions.includes('products:manage') ||
    currentUser.permissions.includes('products:*');

  if (!isAllowed) {
    return { authorized: false, status: 403, error: 'Bạn không có quyền quản lý chương trình Flash Sale' };
  }

  return { authorized: true, user: currentUser };
}

// 1. GET: Danh sách các chiến dịch Flash Sale (kèm phân trang)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');

    const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : null;
    const pageSize = pageSizeParam ? Math.min(100, Math.max(1, parseInt(pageSizeParam, 10) || 10)) : null;

    const findOptions: any = {
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                originalPrice: true,
                images: true,
                stock: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    };

    if (page && pageSize) {
      findOptions.skip = (page - 1) * pageSize;
      findOptions.take = pageSize;
    }

    const [campaigns, total] = await Promise.all([
      prisma.flashSale.findMany(findOptions),
      prisma.flashSale.count(),
    ]);

    return NextResponse.json({
      success: true,
      campaigns,
      total,
      page: page || 1,
      pageSize: pageSize || total,
      totalPages: pageSize ? Math.ceil(total / pageSize) : 1,
    });
  } catch (error: any) {
    console.error('Error fetching flash sales:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ khi lấy danh sách Flash Sale' },
      { status: 500 }
    );
  }
}

// 2. POST: Tạo mới chiến dịch Flash Sale
export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkManagePermission(request);
    if (!authCheck.authorized) {
      return NextResponse.json({ success: false, error: authCheck.error }, { status: authCheck.status });
    }

    const body = await request.json();
    const { title, description, startTime, endTime, isActive = true, items = [] } = body;

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ tiêu đề, thời gian bắt đầu và kết thúc' },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return NextResponse.json(
        { success: false, error: 'Thời gian kết thúc phải diễn ra sau thời gian bắt đầu' },
        { status: 400 }
      );
    }

    // Tạo chiến dịch kèm các sản phẩm được chọn
    const newCampaign = await prisma.flashSale.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        isActive,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            discountPrice: Math.round(Number(item.discountPrice) || 0),
            limitQuantity: Math.max(1, parseInt(item.limitQuantity, 10) || 50),
            soldQuantity: 0,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, campaign: newCampaign }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating flash sale:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi tạo chiến dịch Flash Sale' },
      { status: 500 }
    );
  }
}

// 3. PUT: Cập nhật chiến dịch Flash Sale
export async function PUT(request: NextRequest) {
  try {
    const authCheck = await checkManagePermission(request);
    if (!authCheck.authorized) {
      return NextResponse.json({ success: false, error: authCheck.error }, { status: authCheck.status });
    }

    const body = await request.json();
    const { id, title, description, startTime, endTime, isActive, items } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID chiến dịch cần cập nhật' }, { status: 400 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    // Nếu có gửi danh sách items mới -> cập nhật lại items
    if (Array.isArray(items)) {
      // Xóa items cũ và tạo lại items mới trong cùng transaction
      await prisma.$transaction([
        prisma.flashSaleItem.deleteMany({ where: { flashSaleId: id } }),
        prisma.flashSale.update({
          where: { id },
          data: {
            ...updateData,
            items: {
              create: items.map((item: any) => ({
                productId: item.productId,
                discountPrice: Math.round(Number(item.discountPrice) || 0),
                limitQuantity: Math.max(1, parseInt(item.limitQuantity, 10) || 50),
                soldQuantity: Math.max(0, parseInt(item.soldQuantity, 10) || 0),
              })),
            },
          },
        }),
      ]);
    } else {
      await prisma.flashSale.update({
        where: { id },
        data: updateData,
      });
    }

    const updated = await prisma.flashSale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error: any) {
    console.error('Error updating flash sale:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi cập nhật chiến dịch Flash Sale' },
      { status: 500 }
    );
  }
}

// 4. DELETE: Xóa chiến dịch Flash Sale
export async function DELETE(request: NextRequest) {
  try {
    const authCheck = await checkManagePermission(request);
    if (!authCheck.authorized) {
      return NextResponse.json({ success: false, error: authCheck.error }, { status: authCheck.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID chiến dịch cần xóa' }, { status: 400 });
    }

    await prisma.flashSale.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Đã xóa chiến dịch Flash Sale thành công' });
  } catch (error: any) {
    console.error('Error deleting flash sale:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi xóa chiến dịch Flash Sale' },
      { status: 500 }
    );
  }
}
