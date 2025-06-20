import { NextRequest, NextResponse } from 'next/server';
import User from '@backend/models/User';

import { Op } from 'sequelize';
import { ROLE_CUSTOMER } from '@/form/user';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { phone, name, status } = body;
    const param = await params
    const customer = await User.findByPk(param.id);

    if (!customer) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 404 });
    }

    const existingUser = await User.findOne({
      where: {
        phone,
        roleId: ROLE_CUSTOMER,
        id: { [Op.ne]: param.id },
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Số điện thoại đã tồn tại' }, { status: 400 });
    }

    await customer.update({ phone, name, status });

    return NextResponse.json({ message: 'Cập nhật khách hàng thành công', data: customer }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi khi cập nhật người dùng' }, { status: 500 });
  }
}