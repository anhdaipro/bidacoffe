import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import User from '@/backend/models/User';
import redisClient from '@/backend/redisClient';

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

 // ✅ Bắt buộc nếu dùng Sequelize

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

   

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

    const existingToken = await redisClient.get(`user:${user.id}`);
    if (existingToken) {
      return NextResponse.json(
        { message: 'Tài khoản đang được sử dụng ở thiết bị khác' },
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
    await redisClient.set(`user:${user.id}`, accessToken);
    const response = NextResponse.json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      user: (() => {
        const { password, hashedPassword, createdAt, updatedAt, ...safeUser } = user.toJSON();
        return safeUser;
      })(),
    });

    // ✅ Set cookie HTTPOnly
    response.cookies.set('token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1h
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
