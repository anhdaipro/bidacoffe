import { NextRequest, NextResponse } from 'next/server';
import User from '@backend/models/User';
import { Op } from 'sequelize';
import { ROLE_CUSTOMER } from '@/form/user';
import dayjs from 'dayjs';



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    const where: any = { roleId: ROLE_CUSTOMER };

    if (searchParams.get('name')) {
      where.name = { [Op.like]: `%${searchParams.get('name')}%` };
    }
    if (searchParams.get('phone')) {
      where.phone = searchParams.get('phone');
    }
    if (searchParams.get('status')) {
      where.status = searchParams.get('status');
    }
    if (searchParams.get('dateFrom') || searchParams.get('dateTo')) {
      where.createdAt = {
        ...(searchParams.get('dateFrom') && { [Op.gte]: searchParams.get('dateFrom') }),
        ...(searchParams.get('dateTo') && { [Op.lte]: dayjs(searchParams.get('dateTo') as string).add(1) }),
      };
    }

    const { rows: users, count: total } = await User.findAndCountAll({
      where,
      limit,
      offset,
      attributes: ['phone', 'point', 'name', 'createdAt', 'status', 'id'],
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      message: 'Lấy dữ liệu thành công',
      data: users,
      pagination: { total, totalPages, currentPage: page, limit },
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi khi lấy danh sách người dùng' }, { status: 500 });
  }
}