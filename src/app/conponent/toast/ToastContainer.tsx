// ToastContainer.tsx (Updated)
import React, { useState } from 'react';
import Toast from './Toast';
import { ToastContainerWrapper } from './styles';
import { useToastStore } from '@/app/store/toastStore';
import { useShallow } from 'zustand/shallow';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToastStore(useShallow((state) => ({
        toasts: state.toasts,
        removeToast: state.removeToast,
    })))
    return (
        <ToastContainerWrapper >
        {toasts.map((toast, index) => (
            <Toast key={index} message={toast.message} content={toast.content} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
        </ToastContainerWrapper>
    );
};

export default ToastContainer;
