import React, {useState} from 'react'
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  CircularProgress,
} from '@mui/material'
import {
  Edit,
  Delete,
} from '@mui/icons-material';
import { usegetAllShift } from '@/app/query/useShift';
import { Shift } from '@/app/type/model/Shift';
import { STATUS_ACTIVE } from '@/form/shifth';
import { useControlStore } from '@/app/store/useStore';
import FormShift from './FormShift';
import { formatNumber } from '@/app/helper';
const ShiftList = () => {
    const {data:shifts, isLoading, isError} = usegetAllShift();
    const updateStore = useControlStore(state => state.updateStore);
    const handleEdit = (shift:Shift) => {
      updateStore({ 
        isVisible: true,
        action: "edit-shift",
        id: shift.id,
        children: <FormShift shift={shift} />,
        title: "Cập nhật ca làm việc",
       });
    }
    if (isLoading || isError) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <CircularProgress color="primary" />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Đang tải dữ liệu...
          </Typography>
        </Box>
      );
    }
    return (
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell>Tên ca</TableCell>
                <TableCell align="center">Thời gian</TableCell>
                <TableCell align="center">Lương theo giờ</TableCell>
                <TableCell align="center">Số nhân viên</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shifts.map((shift:Shift) => (
                <TableRow key={shift.id}>
                  <TableCell>
                    <Typography fontWeight="medium">{shift.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    {shift.startTime} - {shift.endTime}
                  </TableCell>
                  <TableCell align="center">
                    {formatNumber(shift.salaryHour)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={shift.numEmployee} color="info" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={shift.status == STATUS_ACTIVE ? 'Hoạt động' : 'Ngừng'}
                      color={shift.status == STATUS_ACTIVE ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chỉnh sửa" onClick={() =>handleEdit(shift)}>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
export default ShiftList