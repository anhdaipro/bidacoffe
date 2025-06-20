import redisClient from "@/backend/redisClient";
import { authenticateJWT } from "@/midleware";
import { NextResponse,NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await authenticateJWT(req)
        if (user instanceof NextResponse) return user;
        await redisClient.del(`user:${user.id}`);
        return NextResponse.json({message: 'Đăng xuất thành công'},{status:200})
    } catch (error) {
      console.error('Login error:', error);
      return NextResponse.json({ message: 'Lỗi máy chủ' }, { status: 500 });
    }
  }