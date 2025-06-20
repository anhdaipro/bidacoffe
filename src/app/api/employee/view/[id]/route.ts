import { NextRequest, NextResponse } from 'next/server';
import User from '@backend/models/User';
import UserProfile from '@backend/models/UserProfile';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const user = await User.findByPk(param.id, {
      include: [{ model: UserProfile, as: 'rProfile' }],
    });

    if (!user) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 404 });
    }

    const userData = user.toJSON();
    const { id: profileId, createdAt, ...rest } = userData.rProfile || {};
    const data = Object.assign(userData, { ...rest });

    return NextResponse.json({ message: 'Lấy thông tin người dùng thành công', data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi khi lấy thông tin người dùng' }, { status: 500 });
  }
}