// Toast.tsx
import React, { ReactNode, useEffect } from 'react';
import { ToastWrapper,Message,CloseButton } from './styles';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  content:ReactNode;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose,content }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Tự động đóng toast sau 3 giây
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastWrapper className={type}>
      <Message>{message}</Message>
      <div>
        {content}
      </div>
      <CloseButton onClick={onClose}>×</CloseButton>
    </ToastWrapper>
  );
};

export default Toast;
