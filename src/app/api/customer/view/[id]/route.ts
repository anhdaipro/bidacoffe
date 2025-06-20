import { NextRequest, NextResponse } from 'next/server';
import User from '@backend/models/User';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const user = await User.findByPk(param.id, {
      attributes: { exclude: ['password', 'hashedPassword'] },
    });

    if (!user) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi khi lấy thông tin người dùng' }, { status: 500 });
  }
}