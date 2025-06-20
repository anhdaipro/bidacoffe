import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ message: 'Refresh token không hợp lệ' }, { status: 403 });
    }

    // Xác thực refresh token
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: number; roleId: number };

    // Tạo access token mới
    const newAccessToken = jwt.sign(
      { id: payload.id, roleId: payload.roleId },
      JWT_SECRET,
      { expiresIn: '1h' } // Access token mới hết hạn sau 1 giờ
    );

    return NextResponse.json({ accessToken: newAccessToken }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(errorMessage);
    return NextResponse.json({ message: 'Error refreshing token', error: errorMessage }, { status: 500 });
  }
}