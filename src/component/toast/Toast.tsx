import React, { ReactNode, useEffect, useState } from 'react';
import { Snackbar, Alert, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
  content?: ReactNode;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, content }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      onClose();
    }, 5000); // Tự động đóng toast sau 5 giây

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    onClose();
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={5000}
    >
      <Alert
        severity={type}
        variant="filled"
        sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Box sx={{ flexGrow: 1 }}>
          {message}
          {content && <Box sx={{ mt: 1 }}>{content}</Box>}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default Toast;
