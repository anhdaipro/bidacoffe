'use client';
import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTableStore } from '@/app/store/useTableStore';
import { useShallow } from 'zustand/shallow';
import OrderTab from './OrderTab';
import InfoTab from './InfoTab';
import {PaymentInvoice} from './PaymentInvoice';
import RewardTab from './RewardTab';
import { STATUS_AVAILABLE, STATUS_PLAYING, STATUS_WAIT_PAID } from '@/form/billiardTable';

const TablePopup = () => {
  const { selectedTable, tableSessions, tables, closePopup } = useTableStore(
    useShallow((state) => ({
      selectedTable: state.selectedTable,
      tableSessions: state.tableSessions,
      tables: state.tables,
      closePopup: state.closePopup,
    }))
  );
  const [activeTab, setActiveTab] = useState<'order' | 'payment' | 'info' | 'reward'>('info');

  const selectedSession = useMemo(() => {
    return tableSessions.find((session) => session.tableId === selectedTable?.id);
  }, [tableSessions, selectedTable]);

  if (!selectedTable) return null;

  return (
    <Dialog
      open={!!selectedTable}
      onClose={closePopup}
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
      PaperProps={{
        sx: {
          transition: 'all 0.3s ease-in-out',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 6 }}>
        <Typography  sx={{ fontWeight: 'bold' }}>
          Bàn số {selectedTable.tableNumber}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={closePopup}
          sx={{ position: 'absolute', top: 8, right: 8, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ maxHeight: '80vh', overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_event, newValue) => setActiveTab(newValue)}
          aria-label="table management tabs"
          variant="scrollable"
          scrollButtons="auto"
          
        >
          <Tab label="Thông tin" value="info" />
          <Tab
            label="Gọi món"
            value="order"
            disabled={selectedTable.status === STATUS_AVAILABLE}
          />
          <Tab
            label="Tích điểm"
            value="reward"
            disabled={selectedTable.status !== STATUS_WAIT_PAID}
          />
          <Tab
            label="Thanh toán"
            value="payment"
            disabled={selectedTable.status !== STATUS_WAIT_PAID}
          />
        </Tabs>


        </Box>
        <Box sx={{ mt: 2 }}>
          {activeTab === 'order' && (
            <OrderTab
              tableSessions={tableSessions}
              selectedTable={selectedTable}
              selectedSession={selectedSession}
            />
          )}
          {activeTab === 'payment' && (
            <PaymentInvoice
              tables={tables}
              tableSessions={tableSessions}
              table={selectedTable}
              selectedSession={selectedSession}
            />
          )}
          {activeTab === 'info' && (
            <InfoTab
              tableSessions={tableSessions}
              selectedTable={selectedTable}
              selectedSession={selectedSession}
            />
          )}
          {activeTab === 'reward' && (
            <RewardTab tableSessions={tableSessions} selectedSession={selectedSession} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TablePopup;