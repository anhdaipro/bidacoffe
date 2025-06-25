import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import User from '@/backend/models/User';
import UserSession from '@/backend/models/UserSession';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

 // ✅ Bắt buộc nếu dùng Sequelize

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { identifier, password, deviceInfo } = body;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Người dùng không tồn tại' }, { status: 404 });
    }

    const isPasswordValid =
      user.password && (await bcrypt.compare(password, user.hashedPassword));

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Mật khẩu không chính xác' }, { status: 401 });
    }

    // const existingToken = await redisClient.get(`user:${user.id}`);
    const userSesionExist = await UserSession.findOne({
      where:{
        userId: user.id
      }
    })
    const check = user.checkRoleLoginMoreDevice()
    if (!check && userSesionExist){
      let message = 'Tài khoản đang được sử dụng ở thiết bị khác'
      if(userSesionExist){
        const type = userSesionExist.deviceInfo.deviceType
        const deviceName = userSesionExist.deviceInfo?.model || userSesionExist.deviceInfo?.browser || 'thiết bị không xác định';
        const osName = userSesionExist.deviceInfo?.os || 'HĐH không xác định';
        const ip = userSesionExist.ip || 'IP không xác định';
        const loginAt = userSesionExist.loginAt ? new Date(userSesionExist.loginAt).toLocaleString('vi-VN') : 'thời gian không rõ';
        message = `Tài khoản đang được sử dụng ở thiết bị khác:\n- Loại thiết bị ${type} \n- Tên thiết bị ${deviceName} (${osName}) \n- Địa chỉ IP: ${ip} \n- Đăng nhập lúc: ${loginAt}`;
      }
      return NextResponse.json(
        { message},
        { status: 403 }
      );
    }

    const accessToken = jwt.sign(
      { id: user.id, roleId: user.roleId },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, roleId: user.roleId },
      REFRESH_TOKEN_SECRET
    );
    const ip = req.headers.get('x-forwarded-for') || body.ip || 'unknown';
    await UserSession.create({
      userId: user.id,
      accessToken,
      refreshToken,
      deviceInfo,
      ip,
    });
    // await redisClient.set(`user:${user.id}`, accessToken, 'EX', 3600);
    const { password:passwordUser, hashedPassword, createdAt, updatedAt, ...safeUser } = user.toJSON();
    const response = NextResponse.json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      user: safeUser,
    });
    const cookieStore  = await cookies()
    // ✅ Set cookie HTTPOnly
    cookieStore.set('token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1h
      path: '/',
    });
    const storageData = {
      state: {
        user:safeUser
      },
    };
    cookieStore.set('refreshToken', refreshToken)
    cookieStore.set('auth-storage', JSON.stringify(storageData),{
      path: '/',
      maxAge: 60 * 60 * 24, // 1 ngày
      httpOnly: false,      // để client-side (và server) đều đọc được nếu cần
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
