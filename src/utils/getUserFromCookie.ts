import { cookies } from 'next/headers';

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth-storage');
  if (!userCookie?.value) return null;
  try {
    const parsed = JSON.parse(userCookie.value);
    return parsed?.state?.user || null;
  } catch (e) {
    console.error('Không parse được cookie:', e);
    return null;
  }
}