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
const AssignmentPanel = () => {
    const [selectedDate, setSelectedDate] = useState('');
    
    const [employees, setEmployees] = useState([
      { id: 1, name: 'Nguyễn Văn A', shifts: { '2023-11-20': 'Ca sáng' } },
      { id: 2, name: 'Trần Thị B', shifts: { '2023-11-20': 'Ca chiều' } }
    ]);
  
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
              {employees.map(employee => (
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
                      value={''}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="">-- Chọn ca --</MenuItem>
                      <MenuItem value="Ca sáng">Ca sáng (8h-12h)</MenuItem>
                      <MenuItem value="Ca chiều">Ca chiều (13h-17h)</MenuItem>
                      <MenuItem value="Ca tối">Ca tối (18h-22h)</MenuItem>
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