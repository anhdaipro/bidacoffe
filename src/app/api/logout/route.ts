import UserSession from "@/backend/models/UserSession";
import redisClient from "@/backend/redisClient";
import { authenticateJWT } from "@/midleware";
import { cookies } from "next/headers";
import { NextResponse,NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await authenticateJWT()
        if (user instanceof NextResponse) return user;
        // await redisClient.del(`user:${user.id}`);
        const cookieStore  = await cookies()
        cookieStore.delete('token')
        cookieStore.delete('auth-storage')
        cookieStore.delete('refreshToken')
        await UserSession.destroy({
          where:{userId:user.id}
        })
        return NextResponse.json({message: 'Đăng xuất thành công'},{status:200})
    } catch (error) {
      console.error('Login error:', error);
      return NextResponse.json({ message: 'Lỗi máy chủ' }, { status: 500 });
    }
  }