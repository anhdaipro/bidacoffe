import { create } from 'zustand';

import { createJSONStorage, persist } from 'zustand/middleware'
export interface User{
  name:string;
  id:number;
  roleId:number;
}
interface Props {
  user: User | null;
  setUser: (user: any) => void;
  logout: () => void;
  isHydrated:boolean;

}

export const useAuthStore = create<Props>()(
  persist(
    (set) => ({
      user: null,
      isHydrated:false,
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage', // 👈 tên key trong localStorage
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used

      onRehydrateStorage: (state) => {
        return () => state.isHydrated = true
      }
    }
  )
);