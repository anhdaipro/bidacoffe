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
} from '@mui/material'
import {
  CalendarToday,
  ListAlt,
  Edit,
  Delete,
  People,
  Settings,
  Add,
  Refresh,
  FileDownload
} from '@mui/icons-material';
const ShiftList = () => {
    const [shifts, setShifts] = useState([
      { id: 1, name: 'Ca sáng', startTime: '08:00', endTime: '12:00', employees: 5, status: 'active' },
      { id: 2, name: 'Ca chiều', startTime: '13:00', endTime: '17:00', employees: 4, status: 'active' },
      { id: 3, name: 'Ca tối', startTime: '18:00', endTime: '22:00', employees: 3, status: 'active' },
      { id: 4, name: 'Ca đêm', startTime: '22:00', endTime: '06:00', employees: 2, status: 'inactive' }
    ]);
  
    return (
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell>Tên ca</TableCell>
                <TableCell align="center">Thời gian</TableCell>
                <TableCell align="center">Số nhân viên</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shifts.map(shift => (
                <TableRow key={shift.id}>
                  <TableCell>
                    <Typography fontWeight="medium">{shift.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    {shift.startTime} - {shift.endTime}
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={shift.employees} color="info" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={shift.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                      color={shift.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chỉnh sửa">
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