'use client';
import React, { useState, useMemo, useRef } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel, Divider,TypographyProps } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { Table } from '@/app/type/model/Table';
import { TableSession } from '@/app/type/model/TableSession';
import { useTableStore } from '@/app/store/useTableStore';
import { useReactToPrint } from 'react-to-print';
import { useProductsSearch } from '@/app/query/useProducts';
import { Product } from '@/app/type/Model';
import { useCreatePayment } from '@/app/query/usePayment';
import { PAYMENT_METHOD } from '@/form/payment';
import { useToastStore } from '@/app/store/toastStore';
import { v4 as uuidv4 } from 'uuid';
import { useShallow } from 'zustand/shallow';
import { STATUS_AVAILABLE } from '@/form/billiardTable';
// components/PrintTypography.tsx

const PrintTypography: React.FC<TypographyProps> = ({ children, sx, ...props }) => {
  return (
    <Typography
      {...props}
      sx={{
        fontSize: '12px',
        '@media print': {
          fontSize: '10px',
        },
        lineHeight: 1.4,
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

export default PrintTypography;
export interface PaymentProps {
  selectedSession?: TableSession;
  tableSessions: TableSession[];
  table: Table;
  tables: Table[];
}

export const PaymentInvoice: React.FC<PaymentProps> = ({ table, selectedSession, tableSessions, tables }) => {
  if (!selectedSession) {
    return null;
  }

  const { data: menu, isLoading } = useProductsSearch();
  const { startTime, endTime, playedMinutes, customer, orders } = selectedSession;
  const [paidOnline, setPaidOnline] = useState(false);
  const [isUsePoint, setIsUsePoint] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { mutate: createPayment } = useCreatePayment();
  const { tableNumber, hourlyRate } = table;
  const orderTotal = orders.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const { setTableSession, setTables, setTable, closePopup } = useTableStore(
    useShallow((state) => ({
      setTableSession: state.setTableSession,
      setTables: state.setTables,
      setTable: state.selectTable,
      closePopup: state.closePopup,
    }))
  );
  const addToast = useToastStore((state) => state.addToast);

  const amountTable = (playedMinutes / 60) * hourlyRate;
  const roundedPrice = Math.round(amountTable / 1000) * 1000;
  const totalAmount = roundedPrice + orderTotal;

  const amountDiscount = useMemo(() => {
    if (!isUsePoint || !customer) {
      return 0;
    }
    let point = customer.point;
    let usablePoints = Math.floor(point / 10);
    let discountAmount = usablePoints * 1000;
    if (discountAmount > totalAmount) {
      usablePoints = Math.floor(totalAmount / 10000);
      discountAmount = usablePoints * 10000;
    }
    return discountAmount;
  }, [isUsePoint, totalAmount, customer]);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: 'Payment_Invoice',
    pageStyle: `
      @page {
        size: 78mm auto;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: 'Courier New', monospace;
      }
      .content-print {
        width: 78mm;
        padding: 3mm;
        font-size: 12px !important;
        overflow: visible;
        max-height: none;
        height: auto;
      }
    `,
  });

  const qrContent = `https://img.vietqr.io/image/VCB-0123456789-print.png?amount=${totalAmount-amountDiscount}&addInfo=Thanh+toan+bida`;

  const onConfirmPaid = () => {
    const payload = {
      totalAmount,
      sessionId: selectedSession.id,
      discount: amountDiscount,
      note: '',
      isUsePoint,
      method: paidOnline ? PAYMENT_METHOD.CASH : 0,
    };
    createPayment(
      { payload },
      {
        onSuccess: () => {
          addToast({
            id: uuidv4(),
            message: 'Thanh toán thành công',
            type: 'success',
          });
          const tableSessionsUpdate = tableSessions.filter((item) => item.id !== selectedSession.id);
          setTableSession(tableSessionsUpdate);
          const tablesUpdate = tables.map((item) => ({
            ...item,
            status: item.id === table.id ? STATUS_AVAILABLE : item.status,
          }));
          setTables(tablesUpdate);
          setTable({ ...table, status: STATUS_AVAILABLE });
          closePopup();
        },
        onError: (error: any) => {
          addToast({
            id: uuidv4(),
            message: error.response.data.message,
            type: 'error',
          });
        },
      }
    );
  };

  if (isLoading) {
    return null;
  }

  return (
    endTime && (
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: '400px', md: '500px' },
          mx: 'auto',
          p: { xs: 2, sm: 3 },
          fontFamily: '"Courier New", monospace',
        }}
      >
        <Box
          ref={contentRef}
          className="content-print"
          sx={{
            maxHeight: { xs: '400px', sm: 'none' },
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
            '@media print': {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '78mm',
              p: '3mm',
              fontSize: '12px !important',
              overflow: 'visible',
              maxHeight: 'none',
            },
          }}
        >
          <Typography variant="h6" align="center" fontWeight="bold" sx={{ fontSize: { xs: '14px', '@media print': '14px' } }}>
            HÓA ĐƠN THANH TOÁN
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: { xs: '10px', '@media print': '10px' } }}>
            <PrintTypography >Bàn:</PrintTypography>
            <PrintTypography fontWeight="bold" >{tableNumber}</PrintTypography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: { xs: '10px', '@media print': '10px' } }}>
            <PrintTypography >Bắt đầu:</PrintTypography>
            <PrintTypography >
              {new Date(startTime).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </PrintTypography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: { xs: '10px', '@media print': '10px' } }}>
            <PrintTypography >Kết thúc:</PrintTypography>
            <PrintTypography >
              {new Date(endTime).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </PrintTypography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: { xs: '10px', '@media print': '10px' } }}>
            <PrintTypography >Thời gian chơi:</PrintTypography>
            <PrintTypography >{playedMinutes} phút</PrintTypography>
          </Box>

          <Typography
            variant="h6"
            sx={{
              mt: 1,
              mb: 0.5,
              fontSize: { xs: '14px', '@media print': '14px' },
              fontWeight: 'bold',
              borderBottom: '1px solid #ccc',
              pb: 0.5,
            }}
          >
            Tiền bàn
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: { xs: '10px', '@media print': '10px' } }}>
            <PrintTypography >Bạn đã chơi:</PrintTypography>
            <PrintTypography  fontWeight="bold">{playedMinutes} phút</PrintTypography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: { xs: '10px', '@media print': '10px' } }}>
            <PrintTypography >Đơn giá:</PrintTypography>
            <PrintTypography  fontWeight="bold">{hourlyRate.toLocaleString()} VND/giờ</PrintTypography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: { xs: '10px', '@media print': '10px' } }}>
            <PrintTypography >Thành tiền:</PrintTypography>
            <PrintTypography  fontWeight="bold">{roundedPrice.toLocaleString()} VND</PrintTypography>
          </Box>

          {orders.length > 0 && (
            <>
              <Typography
                variant="h6"
                sx={{
                  mt: 1,
                  mb: 0.5,
                  fontSize: { xs: '14px', '@media print': '14px' },
                  fontWeight: 'bold',
                  borderBottom: '1px solid #ccc',
                  pb: 0.5,
                }}
              >
                Đặt món
              </Typography>
              {orders.map((item, idx) => {
                const product = menu.find((p: Product) => p.id === item.productId);
                return (
                  <Box
                    key={idx}
                    sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: { xs: '10px', '@media print': '10px' } }}
                  >
                    <PrintTypography >{product?.name} × {item.quantity}</PrintTypography>
                    <PrintTypography  fontWeight="bold">{(item.quantity * item.price).toLocaleString()} VND</PrintTypography>
                  </Box>
                );
              })}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: { xs: '10px', '@media print': '10px' } }}>
                <PrintTypography  fontWeight="bold">Tổng tiền món</PrintTypography>
                <PrintTypography  fontWeight="bold">{orderTotal.toLocaleString()} VND</PrintTypography>
              </Box>
            </>
          )}

          

          <Typography
            variant="h6"
            sx={{
              mt: 1,
              mb: 0.5,
              fontSize: { xs: '14px', '@media print': '14px' },
              fontWeight: 'bold',
              borderBottom: '1px solid #ccc',
              pb: 0.5,
            }}
          >
            TỔNG CỘNG
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: { xs: '10px', '@media print': '10px' } }}>
            <PrintTypography  fontWeight="bold">Giảm giá</PrintTypography>
            <PrintTypography  fontWeight="bold">{amountDiscount.toLocaleString()} VND</PrintTypography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: { xs: '10px', '@media print': '10px !important' } }}>
            <Typography  fontWeight="bold">Tổng thanh toán</Typography>
            <Typography  fontWeight="bold">{(totalAmount - amountDiscount).toLocaleString()} VND</Typography>
          </Box>

          <Box sx={{ mt: 2.5, textAlign: 'center' }}>
            <QRCodeSVG value={qrContent} size={128} />
            <Typography sx={{ mt: 1, fontSize: { xs: '12px', '@media print': '12px' } }}>Quét mã để thanh toán</Typography>
          </Box>

          <Typography align="center" sx={{ mt: 2, fontSize: { xs: '12px', '@media print': '12px' } }}>
            Cảm ơn bạn đã sử dụng dịch vụ!
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: { xs: 'column', sm: 'row' }, '@media print': { display: 'none' } }}>
          <FormControlLabel
            control={<Checkbox checked={paidOnline} onChange={() => setPaidOnline(!paidOnline)} />}
            label={<PrintTypography >Thanh toán online (QR/MOMO/VNPAY)</PrintTypography>}
          />
          <FormControlLabel
            control={<Checkbox checked={isUsePoint} onChange={() => setIsUsePoint(!isUsePoint)} />}
            label={<PrintTypography >Áp dụng điểm giảm giá</PrintTypography>}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap', '@media print': { display: 'none' } }}>
          <Button
            variant="contained"
            onClick={handlePrint}
            startIcon={<span>🖨️</span>}
            sx={{
              bgcolor: '#1976d2',
              '&:hover': { bgcolor: '#145ca8' },
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            In hóa đơn
          </Button>
          <Button
            variant="contained"
            onClick={onConfirmPaid}
            startIcon={<span>✅</span>}
            sx={{
              bgcolor: '#1976d2',
              '&:hover': { bgcolor: '#145ca8' },
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Đã thanh toán
          </Button>
        </Box>
      </Box>
    )
  );
};