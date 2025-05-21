import { create } from 'zustand';

interface Props{
    isLoading: boolean;
    setLoading:(value:boolean) =>void
    isVisible: boolean;
    children: React.ReactNode;
    setVisible:(value:boolean) =>void;
    action: string;
    updateStore: (data: any) => void;
    title:string;
    id: number;
}

export const useControlStore = create<Props>((set) => ({
    isLoading: true,
    isVisible: false,
    action: 'create',
    children: null,
    title:'',
    id:0,
    setLoading: (isLoading) => set({ isLoading }),
    setVisible: (isVisible) => set({ isVisible }),
    updateStore: (data) => set(data),
}))