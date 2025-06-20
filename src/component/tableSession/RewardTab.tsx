import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRewardTableSession } from '@/app/query/useTableSession';
import { useToastStore } from '@/app/store/toastStore';
import { useTableStore } from '@/app/store/useTableStore';
import { TableSession } from '@/app/type/model/TableSession';
import { useShallow } from 'zustand/shallow';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

interface RewardTabProps {
  tableSessions: TableSession[];
  selectedSession?: TableSession;
}

const RewardTab: React.FC<RewardTabProps> = ({ tableSessions, selectedSession }) => {
  if (!selectedSession) return null;

  const [phone, setPhone] = useState('');
  const customer = selectedSession.customer;
  const [isNew, setIsNew] = useState(false);
  const addToast = useToastStore((state) => state.addToast);
  const [pointsToUse, setPointsToUse] = useState(0);
  const { mutate: rewardPoint, isPending, isSuccess} = useRewardTableSession();
  const { setTableSession } = useTableStore(
    useShallow((state) => ({
      setTableSession: state.setTableSession,
    }))
  );

  const handleFind = () => {
    const id = selectedSession.id;
    rewardPoint(
      { phone: phone, id: id },
      {
        onSuccess: (data) => {
          setIsNew(false);
          const tableSessionsUpdate = tableSessions.map((item) => {
            if (item.id === selectedSession.id) {
              return { ...item, customer: data };
            }
            return { ...item };
          });
          setTableSession(tableSessionsUpdate);
          addToast({
            id: uuidv4(),
            message: 'Tích điểm thành công',
            type: 'success',
          });
        },
        onError: (error: any) => {
          addToast({
            id: uuidv4(),
            message: error.response?.data?.message || 'Lỗi hệ thống',
            type: 'error',
          });
        },
      }
    );
  };

  const handleUsePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value) || 0;
    if (val < 0) val = 0;
    if (customer && val > customer.point) val = customer.point;
    setPointsToUse(val);
  };

  const handleApplyPoints = () => {
    alert(`Đã sử dụng ${pointsToUse} điểm để giảm giá ${pointsToUse * 1000}đ`);
    // Xử lý logic giảm giá + cập nhật backend ở đây
  };

  return (
    <Box
      sx={{
        p: 2,
        maxWidth: 480,
        mx: 'auto',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: '#2c3e50' }}>
        🎁 Tích điểm thành viên
      </Typography>

      {!customer && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
          <TextField
            label="Nhập số điện thoại"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            size="small"
          />
          <Button variant="contained" disabled={isPending || isSuccess} onClick={handleFind} sx={{ minWidth: 120 }}>
            Tích điểm
          </Button>
        </Stack>
      )}

      {customer && (
        <Box
          sx={{
            bgcolor: '#f5f5f5',
            p: 2,
            borderRadius: 2,
            mt: 1,
          }}
        >
          <Typography>
            Khách hàng: <strong>{customer.phone}</strong>
          </Typography>
          <Typography>
            Điểm hiện tại: <strong>{customer.point}</strong>
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            mt={2}
          >
            <TextField
              label="Số điểm dùng"
              type="number"
              size="small"
              value={pointsToUse}
              onChange={handleUsePointsChange}
              inputProps={{
                min: 0,
                max: customer.point,
                step: 1,
              }}
              sx={{ width: { xs: '100%', sm: 100 } }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleApplyPoints}
              disabled={customer.point < 10 || pointsToUse <= 0}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Áp dụng điểm giảm giá
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default RewardTab;
