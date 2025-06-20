import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import User from '@backend/models/User';
import { Op } from 'sequelize';
import { ROLE_CUSTOMER, STATUS_ACTIVE } from '@/form/user';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, name } = body;
    const username = phone;
    const password = '123123';
    const roleId = ROLE_CUSTOMER;
    const status = STATUS_ACTIVE;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ phone }, { phone }],
        roleId: ROLE_CUSTOMER,
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Tên người dùng hoặc số điện thoại đã tồn tại' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      phone,
      name,
      status,
      password,
      hashedPassword,
      roleId,
    });

    return NextResponse.json({ message: 'Tạo khách hàng thành công', data: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi khi tạo người dùng' }, { status: 500 });
  }
}