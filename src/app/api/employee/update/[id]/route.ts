import { NextRequest, NextResponse } from 'next/server';
import User from '@backend/models/User';
import UserProfile from '@backend/models/UserProfile';
import { Op } from 'sequelize';
import { ROLES_EMPLOYEE } from '@/form/user';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const {
      phone, roleId, address, name, baseSalary, dateOfBirth, position,
      bankNo, bankId, bankFullname, dateLeave, shiftId, status, avatar,
      cccdFront, cccdBack, publicAvatar, publicCccdFront, publicCccdBack,
      dateBeginJob, note
    } = body;
    const param = await params
    const user = await User.findByPk(param.id);

    if (!user) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 404 });
    }

    const existingUser = await User.findOne({
      where: {
        phone,
        roleId: { [Op.in]: ROLES_EMPLOYEE },
        id: { [Op.ne]: param.id },
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Số điện thoại đã tồn tại' }, { status: 400 });
    }

    await user.update({ phone, roleId, address, name, baseSalary, dateOfBirth, status, shiftId });

    const userProfile = await UserProfile.findOne({ where: { userId: param.id } });

    if (!userProfile) {
      return NextResponse.json({ message: 'Thông tin người dùng không tồn tại' }, { status: 404 });
    }

    await userProfile.update({
      phone, name, dateOfBirth, baseSalary, position, bankNo, bankId, bankFullname,
      dateLeave, dateBeginJob, publicCccdFront, publicCccdBack, publicAvatar, note,
      ...(cccdFront && { cccdFront }),
      ...(cccdBack && { cccdBack }),
      ...(avatar && { avatar }),
    });

    return NextResponse.json({ message: 'Cập nhật thông tin người dùng thành công', user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng' }, { status: 500 });
  }
}