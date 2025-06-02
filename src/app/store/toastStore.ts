// store/toastStore.ts
import { ReactNode } from 'react';
import { create } from 'zustand'

export type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
  content?: ReactNode;
}

type ToastState = {
  toasts: Toast[]
  addToast: (toast: Toast) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (toast) =>
    set({
      toasts: [{ ...toast}],
    }),
  removeToast: (id) =>
    set({
      toasts: get().toasts.filter((t) => t.id !== id),
    }),
}))
