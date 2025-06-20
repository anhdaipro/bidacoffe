import { NextRequest, NextResponse } from 'next/server';
import User from '@/backend/models/User';
import { ROLE_CUSTOMER } from '@/form/user';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

    const user = await User.findOne({
      where: { phone },
      attributes: { exclude: ['password', 'hashedPassword'] },
    });

    if (!user) {
      const newUser = await User.create({ phone, roleId: ROLE_CUSTOMER });
      return NextResponse.json({ data: newUser, message: 'Chưa có khách hàng' }, { status: 200 });
    }

    return NextResponse.json({ data: user, message: 'Lấy khách hàng thành công' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi khi lấy thông tin người dùng' }, { status: 500 });
  }
}