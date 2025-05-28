import {
    Box,
    Button,
    Table,
    TableContainer,
    Paper,
    TableHead,
    TableCell,
    TableRow,
    Typography,
    TableBody,
    Avatar,
    MenuItem,
    Select,
    TextField,

} from '@mui/material';
import React,{useState} from 'react'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import {Save} from '@mui/icons-material'
import { useGetEmployeeSchedule } from '@/app/query/useEmployee';
import { Employee } from '@/app/type/model/Employee';
import { usegetAllShift } from '@/app/query/useShift';
import { Shift } from '@/app/type/model/Shift';
const AssignmentPanel = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const {data:employees, isLoading,error} = useGetEmployeeSchedule();
    const {data:shifts,isLoading:isLoadingShift,error:errorShif} = usegetAllShift();
    if(isLoading || error || isLoadingShift || errorShif){ 
      return (
        <div className="loading-container">
          <svg
            className="loading-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#007bff"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset="75"
              className="loading-circle"
            />
          </svg>
          <p className="loading-text">Đang tải dữ liệu...</p>
        </div>
      );
    }
    console.log(shifts)
    // const [employees, setEmployees] = useState([
    //   { id: 1, name: 'Nguyễn Văn A', shifts: { '2023-11-20': 'Ca sáng' } },
    //   { id: 2, name: 'Trần Thị B', shifts: { '2023-11-20': 'Ca chiều' } }
    // ]);
  
    return (
      <Box>
        <Button variant="contained" startIcon={<Save />}>
            Lưu phân công
          </Button>
        <Box sx={{ mb: 3, mt:3 }}>
          <DatePicker
            label="Chọn ngày"
            value={selectedDate ? dayjs(selectedDate) : null}
            onChange={(date) => setSelectedDate(date ? date.format('YYYY-MM-DD') : '')}
            format='DD/MM/YYYY'
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </Box>
  
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nhân viên</TableCell>
                <TableCell align="center">Ca làm việc</TableCell>
                <TableCell align="center">Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee:Employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                        {employee.name.charAt(0)}
                      </Avatar>
                      <Typography>{employee.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Select
                      size="small"
                      defaultValue={''}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value={0}>-- Chọn ca --</MenuItem>
                      {shifts.map((shift:Shift) => (
                        <MenuItem key={shift.id} value={shift.id}>
                          {shift.name} {shift.startTime} - {shift.endTime}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <TextField size="small" placeholder="Ghi chú" fullWidth />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
  export default AssignmentPanel