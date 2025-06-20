import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import User from '@backend/models/User';
import UserProfile from '@backend/models/UserProfile';
import { Op } from 'sequelize';
import { ROLES_EMPLOYEE } from '@/form/user';
import { generateUsername } from '@/backend/Format';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      phone, email, roleId, address, name, baseSalary, dateOfBirth,
      position, bankNo, bankId, bankFullname, dateLeave, dateBeginJob,
      shiftId, avatar, cccdFront, cccdBack, publicAvatar, publicCccdFront,
      publicCccdBack, status, note
    } = body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ phone }],
        roleId: { [Op.in]: ROLES_EMPLOYEE },
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Tên người dùng hoặc số điện thoại đã tồn tại' }, { status: 400 });
    }

    let username = generateUsername(name);
    let counter = 1;
    const password = '123123';
    while (await User.findOne({ where: { username } })) {
      username = `${username}${counter}`;
      counter++;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      phone, name, email, password, baseSalary, username, dateOfBirth,
      hashedPassword, roleId, address, status, shiftId,
    });

    await UserProfile.create({
      userId: newUser.id, phone, name, dateOfBirth, baseSalary, avatar,
      publicAvatar, publicCccdFront, publicCccdBack, cccdFront, cccdBack,
      position, bankNo, bankId, bankFullname, dateLeave, dateBeginJob, note,
    });

    return NextResponse.json({ message: 'Người dùng đã được tạo thành công', user: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi khi tạo người dùng' }, { status: 500 });
  }
}