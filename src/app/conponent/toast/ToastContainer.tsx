// ToastContainer.tsx
import React from 'react';
import Toast from './Toast';
import { useToastStore } from '@/app/store/toastStore';
import { useShallow } from 'zustand/shallow';
import { Box } from '@mui/material';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore(
    useShallow((state) => ({
      toasts: state.toasts,
      removeToast: state.removeToast,
    }))
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1400, // trên modal
        display: 'flex',
        flexDirection: 'column',
        gap: 1, // spacing giữa các toast
      }}
    >
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          content={toast.content}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </Box>
  );
};

export default ToastContainer;
