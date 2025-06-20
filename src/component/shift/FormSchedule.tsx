import React, { useState, useTransition } from 'react';
import { useForm, SubmitHandler, useFieldArray, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useScheduleStore } from '@/app/store/scheduleStore';
import { Employee } from '@/app/type/model/Employee';
import { ScheduleShiftForm } from '@/app/type/model/Schedule';
import { useToastStore } from '@/app/store/toastStore';
import { v4 as uuidv4 } from 'uuid';
import { POSITION_LABELS } from '@/form/user';
import { useCreateSchedules } from '@/app/query/useSchedule';
import dayjs from 'dayjs';
import { start } from 'repl';
const StickyHeaderCell = styled(TableCell)(({ theme }) => ({
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
    fontWeight: 'bold'
  }));
interface Props{
    schedule:ScheduleShiftForm;
} 
const headers = [
    'STT',
    'Tên nhân viên',
    'Chức vụ',
    'Hành động',
]
const FormSchedule:React.FC<Props> = ({schedule}) => {
    const employees = useScheduleStore((state) => state.employees);
    const [inputValue, setInputValue] = useState('');
    const [item,setItem] = useState<Employee|null>(null);
    const addToast = useToastStore(state => state.addToast);
    const {mutate: addSchedule } = useCreateSchedules();
    const theme = useTheme();
    const shifts = useScheduleStore((state) => state.shifts);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch,
      } = useForm<ScheduleShiftForm>({
        values: schedule,
      });
    
    const { fields, append, remove } = useFieldArray({
    control,
    name: 'employees',
    });
    const {workDate, shiftId} = watch();
    const addEmployee = (employee: Employee) => {
        const exists = watch('employees').find(d => d.id === employee.id);
        if (exists) {
          addToast({
            id: uuidv4(),
            message: 'Nhân viên đã có trong ca làm việc',
            type: 'warning',
          });
          return;
        }
        append(
            employee
        );
        
    };
    const removeDetail = (index: number) => {
        remove(index);
    };
    const handleUpdateSchedule: SubmitHandler<ScheduleShiftForm> = (data) => {
        const workDate = data.workDate;
        const shift = shifts.find(s => s.id === data.shiftId);
        if(!shift){
            return;
        }
        const records = data.employees.map(emp => ({
            employeeId: emp.id,
            status:0,
            shiftId: data.shiftId,
            note: '',
            startTime: shift.startTime,
            endTime: shift.endTime,
            salaryHour: shift.salaryHour,
        }));
        const payload={
            workDate,
            records,
        }
        addSchedule(payload, {
            onSuccess: (data) => {
              addToast({
                id: uuidv4(),
                message: 'Lưu phân công thành công',
                type: 'success',
              })
              console.log('Lưu phân công thành công:', data);
            },
            onError: (error) => {
              addToast({
                id: uuidv4(),
                message: 'Lỗi khi lưu phân công',
                type: 'error',
              })
              console.error('Lỗi khi lưu phân công:', error);
            },
          });
    }
    const checkdate = dayjs(workDate).isAfter(dayjs(),'day')
    return (
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2,p:2 }}>
            <Autocomplete
                freeSolo
                options={employees}
                getOptionLabel={(option) => (option as Employee).name || ''}
                inputValue={inputValue}
                value={item}
                onInputChange={(_, newValue) => setInputValue(newValue)}
                onChange={(_, newValue) => {
                if (newValue && typeof newValue !== 'string' && checkdate) {
                    addEmployee(newValue as Employee);
                }
                }}
                onClose={() => {
                    setInputValue('');
                    setItem(null);
                }}
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Tìm kiếm nhân viên"
                    variant="outlined"
                    fullWidth
                />
                )}
                renderOption={(props, option) => (
                <li {...props} key={(option as Employee).id}>
                    {(option as Employee).name}
                </li>
                )}
            />

        <TableContainer
            component={Paper}
            sx={{
                maxHeight: 400,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#bdbdbd',
                borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#9e9e9e',
                },
                scrollbarWidth: 'thin',
                scrollbarColor: '#bdbdbd #f1f1f1',
            }}
            >
            <MuiTable stickyHeader size={isSmallScreen ? 'small' : 'medium'}>
            <TableHead>
                <TableRow>
                {headers.map((header, index) => (
                    <StickyHeaderCell key={index}>{header}</StickyHeaderCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {watch('employees').map((employee, index) => {
                return (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{POSITION_LABELS[employee.roleId]}</TableCell>
                        <TableCell>
                            {checkdate && <IconButton onClick={() => removeDetail(index)} color="error">
                            <Delete fontSize="small" />
                            </IconButton>}
                        </TableCell>
                    </TableRow>
                );
                })}
            </TableBody>
            </MuiTable>
        </TableContainer>
        {checkdate && 
        <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(handleUpdateSchedule)}
            sx={{ alignSelf: 'flex-end', mt: 2 }}
            size={isSmallScreen ? 'small' : 'medium'}
        >
            Xác nhận
        </Button>}
    </Box>
    );
}
export default FormSchedule;