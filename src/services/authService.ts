import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User  from '@backend/models/User'; // Sequelize/Prisma/... tùy bạn
const JWT_SECRET = process.env.JWT_SECRET!;
export async function getUserServerSide() {
    const cookieStore = await cookies(); // ✅ không có await
    const token = cookieStore.get('token')?.value; // ✅ có .value vì get() trả object
    if (!token) throw new Error('Không có token');
    const payload = jwt.verify(token, JWT_SECRET) as { id: number };
    const user = await User.findByPk(payload.id); // ✅ cần await
    if (!user) throw new Error('Không tìm thấy user');
    return user;
  }