import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import User from '@/backend/models/User';
import UserSession from './backend/models/UserSession';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
export async function authenticateJWT(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: 'Token không được cung cấp' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userSesionExist = await UserSession.findOne({
      where:{
        userId: decoded.id
      }
    })
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 403 });
    }
    const check = user.checkRoleLoginMoreDevice()
    if ((!userSesionExist || userSesionExist.accessToken != token) && !check) {
      return NextResponse.json({ message: 'Token khác với token đã lưu' }, { status: 403 });
    }
    // Trả về thông tin user nếu thành công
    return user;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return NextResponse.json({ message: 'Token đã hết hạn' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Token không hợp lệ' }, { status: 403 });
  }
}
