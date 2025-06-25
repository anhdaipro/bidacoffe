import { NextRequest, NextResponse } from 'next/server';

import User from '@/backend/models/User';
import UserProfile from '@/backend/models/UserProfile';
import { Op } from 'sequelize';
import { ROLES_EMPLOYEE } from '@/form/user';
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    const where: any = { roleId: { [Op.in]: ROLES_EMPLOYEE } };
    const userProfileWhere: any = {};

    if (searchParams.get('name')) {
      where.name = { [Op.like]: `%${searchParams.get('name')}%` };
    }
    if (searchParams.get('phone')) {
      where.phone = searchParams.get('phone');
    }
    if (searchParams.get('status')) {
      where.status = searchParams.get('status');
    }

    const include: any[] = [{
      model: UserProfile,
      as: 'rProfile',
      required: Object.keys(userProfileWhere).length > 0,
      ...(Object.keys(userProfileWhere).length > 0 && { where: userProfileWhere }),
    }];

    const { rows: users, count: total } = await User.findAndCountAll({
      where,
      limit,
      offset,
      include,
      attributes: ['phone', 'name', 'createdAt', 'status', 'id', 'address', 'roleId'],
      order: [['id', 'DESC']],

    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      message: 'Lấy dữ liệu thành công',
      data: users,
      pagination: { total, totalPages, currentPage: page, limit },
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi khi lấy danh sách nhân viên' }, { status: 500 });
  }
}