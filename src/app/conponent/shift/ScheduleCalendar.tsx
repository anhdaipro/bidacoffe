import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import weekday from 'dayjs/plugin/weekday';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetScheduleWeekly } from '@/app/query/useSchedule';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(weekday);
dayjs.locale('vi');
dayjs.extend(isoWeek);
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useScheduleStore } from '@/app/store/scheduleStore';
import { useShallow } from 'zustand/shallow';
import { STATUS_ACTIVE, STATUS_INACTIVE } from '@/form/shifth';
import { Employee } from '@/app/type/model/Employee';
import { useControlStore } from '@/app/store/useStore';
import FormSchedule from './FormSchedule';
import { Shift } from '@/app/type/model/Shift';
dayjs.extend(weekOfYear);
const ScheduleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    shiftId: number;
    employees: Employee[];
  } | null>(null);
  const [newEmployee, setNewEmployee] = useState('');
  const {employees, shifts} = useScheduleStore(useShallow((state) => ({ 
    employees: state.employees,
    shifts: state.shifts,
  })));
  // Lịch giả lập
  // const [scheduleData, setScheduleData] = useState([
  //   { date: '2025-05-26', shiftId: 1, employees: ['A', 'B'] },
  //   { date: '2025-05-27', shiftId: 1, employees: ['C'] },
  //   { date: '2025-05-28', shiftId: 2, employees: ['D', 'E'] },
  // ]);
  const updateStore = useControlStore(state=>state.updateStore);
  const startOfWeek = currentDate.startOf('isoWeek');
  const {data: scheduleData, isLoading} = useGetScheduleWeekly(startOfWeek.format('YYYY-MM-DD'))
  if(isLoading){
    return(
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6">Đang tải lịch...</Typography>
      </Box>
    )
  }
  const handleSlotClick = (date: string, shift: Shift, aEmployeeId: number[]) => {
    if(shift.status != STATUS_ACTIVE){
      return;
    }
    
    const aEmployee = [];
    for (const id of aEmployeeId) {
      const emp = employees.find(emp => emp.id == id);
      if (emp) aEmployee.push(emp);
    }
    const schedule = {
      workDate: date,
      shiftId: shift.id,
      employees: aEmployee,
    }
    updateStore({
        isVisible: true,
        action: "edit-schedule",
        id: 0,
        children: <FormSchedule schedule={schedule} />,
        title: "Cập nhật ca làm việc",

    })
  };

  return (
      <Box>
        {/* Header */}
        <DatePicker
            label="Chọn ngày bất kỳ"
            value={currentDate}
            onChange={(date: Dayjs | null) => date && setCurrentDate(date)}
            format='DD/MM/YYYY'
          />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
          <Button variant="outlined" onClick={() => setCurrentDate(prev => prev.subtract(7, 'day'))}>
            Tuần trước
          </Button>
          <Button variant="outlined" onClick={() => setCurrentDate(prev => prev.add(7, 'day'))}>
            Tuần sau
          </Button>
        </Box>

        {/* Lịch */}
        <Grid container spacing={2}>
          {/* Header ngày trong tuần */}
          <Grid  size={{xs:12}}>
            <Grid container spacing={1}>
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label, i) => {
                const date = startOfWeek.add(i, 'day');
                return (
                  <Grid >
                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: date.isSame(dayjs(), 'day') ? 'secondary.main' : 'primary.light' }}>
                      <Typography variant="subtitle2" color="white">{label}</Typography>
                      <Typography variant="body2" color="white">{date.format('D')}</Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          {/* Nội dung ca làm */}
          <Grid size={{xs:12}}>
            <Grid container spacing={1}>
              {shifts.map((shift) => (
                <React.Fragment key={shift.id}>
                  <Grid size={{xs:12, sm:1.5}} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography fontWeight="medium">{shift.name}</Typography>
                  </Grid>
                  {[0, 1, 2, 3, 4, 5, 6].map((d) => {
                    const date = startOfWeek.add(d, 'day');
                    const dateStr = date.format('YYYY-MM-DD');
                    const data = scheduleData.find((s:any) => s.workDate == dateStr && s.shiftId == shift.id);
                    const aEmployeeId = data? data.aEmployeeId : [];
                    return (
                      <Grid size={{xs:12, sm:1.5}} key={d}>
                        <Tooltip title={shift.status == STATUS_INACTIVE ? 'Ca không hoạt động' : 'Chi tiết'}>
                          <Paper
                            sx={{
                              height: 60,
                              p: 1,
                              bgcolor: shift.status == STATUS_INACTIVE ? 'grey.200' : 'white',
                              border: data ? '2px solid #2196f3' : '1px solid #ccc',
                              cursor: shift.status == STATUS_INACTIVE ? 'not-allowed' : 'pointer',
                            }}
                            onClick={() => handleSlotClick(dateStr, shift, aEmployeeId)}
                          >
                            <Typography variant="caption" fontWeight="bold">
                              {date.format('D/M')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {data ? `${data.numEmployee} người` : 'Trống'}
                            </Typography>
                          </Paper>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </Grid>

      </Box>
    
  );
};

export default ScheduleCalendar;
