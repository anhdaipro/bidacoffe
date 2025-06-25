import { create } from 'zustand';

import { persist } from 'zustand/middleware'
export interface User{
  name:string;
  id:number;
  roleId:number
}
interface Props {
  user: User | null;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<Props>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage', // 👈 tên key trong localStorage
    }
  )
);