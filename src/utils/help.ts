
import UserSession from '@/backend/models/UserSession';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { getUserFromCookie } from './getUserFromCookie';
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)
    return decoded.exp < currentTime; // Token đã hết hạn
  } catch (error) {
    return true; // Token không hợp lệ
  }
};
export const logout = async () =>{
    const cookieStore  = await cookies()
    cookieStore.delete('token')
    cookieStore.delete('auth-storage')
    cookieStore.delete('refreshToken')
    const user = await getUserFromCookie()
    if(!user){
        return
    }
    await UserSession.destroy({
        where:{userId:user.id}
    })
}