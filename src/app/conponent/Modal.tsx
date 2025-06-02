"use client";

import React from 'react';
import { useControlStore } from '../store/useStore';
import { useDeleteTransaction } from '../query/useTransaction';
import { useDeleteProduct } from '../query/useProducts';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const Modal: React.FC = () => {
  const { isVisible, setVisible, action, children, title, id } = useControlStore();
  const { mutate: deleteTransaction } = useDeleteTransaction();
  const { mutate: deleteProduct } = useDeleteProduct();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleConfirm = async () => {
    switch (action) {
      case 'delete-transaction':
        deleteTransaction(id, {
          onSuccess: () => {
            // Optional: show toast, invalidate query, etc.
          }
        });
        break;
      case 'delete-product':
        deleteProduct(id);
        break;
      default:
        break;
    }
    setVisible(false);
  };

  return (
    <Dialog
      open={isVisible}
      onClose={() => setVisible(false)}
      // fullScreen={fullScreen}
      
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: { xs: '90vw', sm: 600 },
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper',
        },
      }}
    >
      {/* Close Button */}
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton size="small" onClick={() => setVisible(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ maxHeight: '80vh', overflowY: 'auto',  }}>
        {children && (
          <Typography component='div' variant="body1">
            {children}
          </Typography>
        )}
      </DialogContent>
      {!children && 
      <DialogActions>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
        >
          Xác nhận
        </Button>
        <Button
          onClick={() => setVisible(false)}
          variant="outlined"
          color="inherit"
        >
          Hủy
        </Button>
      </DialogActions>}
    </Dialog>
  );
};

export default Modal;
