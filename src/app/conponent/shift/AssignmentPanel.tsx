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
    FormControl,
    InputLabel,
    Grid,

} from '@mui/material';
import React,{useEffect, useState} from 'react'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { DatePicker } from '@mui/x-date-pickers';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import {Save} from '@mui/icons-material'
import { Employee, EmployeeForm } from '@/app/type/model/Employee';
import { Shift } from '@/app/type/model/Shift';
import { STATUS_ACTIVE } from '@/form/shifth';
import {Controller, useForm,useFieldArray} from 'react-hook-form';
import { ScheduleForm, ScheduleFormMuti, ScheduleFormSearch,Schedule } from '@/app/type/model/Schedule';
import { useCreateSchedules, useGetSchedules } from '@/app/query/useSchedule';
import { useToastStore } from '@/app/store/toastStore';
import { styled } from '@mui/material/styles'
import { useScheduleStore } from '@/app/store/scheduleStore';
import { useShallow } from 'zustand/shallow';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { POSITION_LABELS, ROLE_ADMIN } from '@/form/user';
import { CustomTextarea } from '../employee/Form';
import { useAuthStore } from '@/app/store/useUserStore';
pdfMake.vfs = pdfFonts.vfs;
const CustomButton = styled(Button)(({ theme, disabled }) => ({
  ...(disabled && {
    cursor: 'not-allowed',
    
  }),
}))
const today = dayjs().format('YYYY-MM-DD');
const AssignmentPanel = () => {
    const {employees,shifts} = useScheduleStore(useShallow((state) => ({ 
        employees: state.employees,
        shifts: state.shifts,
    })));
    const {mutate: addSchedule } = useCreateSchedules();
    const [formData, setFormData] = useState<ScheduleFormSearch>({
      status: '',
      shiftId: '',
      employeeId: '',
      dateFrom: '',
      dateTo: '',
      roleId:''
    });
    const { data:schedules, isLoading:isLoadingSchedule,isSuccess,isFetching } = useGetSchedules(formData);
    const { control,watch,handleSubmit,setValue,register,formState:{errors} } = useForm<ScheduleFormMuti>({
      defaultValues: {
        workDate: '',
        records: [],
      },
    });
    const { fields, append, remove, update } = useFieldArray({
      control,
      name: 'records',
    });
    const {workDate,records} = watch();
    useEffect(() => { 
      if(isSuccess && !isFetching){
        
        let aRecordUpdate:ScheduleForm[] = [];
        for(const employee of employees){
          if(formData.roleId && employee.roleId != Number(formData.roleId)){
            continue;
          }
          const schedule = schedules.find((schedule:Schedule) => schedule.employeeId == employee.id);
          if(schedule){
            aRecordUpdate.push({
              employeeId: schedule.employeeId,
              shiftId: schedule.shiftId,
              note: schedule.note,
              status: schedule.status,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              salaryHour: schedule.salaryHour
            });
          }
          aRecordUpdate.push({
            employeeId: employee.id,
            shiftId: 0,
            note:'',
            status: STATUS_ACTIVE,
            startTime: '',
            endTime: '',
            salaryHour:0,
          });
        }
        // const aRecordUpdate = employees.filter(item=>item.roleId == Number(formData.roleId)).map((employee:Employee) => {
        //   const schedule = schedules.find((schedule:Schedule) => schedule.employeeId == employee.id);
        //   if(schedule){
        //     return {
        //       employeeId: schedule.employeeId,
        //       shiftId: schedule.shiftId,
        //       note: schedule.note,
        //       status: schedule.status,
        //       startTime: schedule.startTime,
        //       endTime: schedule.endTime,
        //       salaryHour: schedule.salaryHour
        //     };
        //   }
        //   return {
        //     employeeId: employee.id,
        //     shiftId: 0,
        //     note:'',
        //     status: STATUS_ACTIVE,
        //     startTime: '',
        //     endTime: '',
        //     salaryHour:0,
        //   };
        // })
        setValue('records', aRecordUpdate);
      }
    }, [isSuccess,isFetching, formData.roleId]);

    
    const user = useAuthStore(state => state.user);
    const addToast = useToastStore(state => state.addToast);
   
    if(isLoadingSchedule){ 
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
    
    // const [employees, setEmployees] = useState([
    //   { id: 1, name: 'Nguyễn Văn A', shifts: { '2023-11-20': 'Ca sáng' } },
    //   { id: 2, name: 'Trần Thị B', shifts: { '2023-11-20': 'Ca chiều' } }
    // ]);
    console.log(errors)
    const handleFormSubmit = (data:ScheduleFormMuti) => {
      console.log(errors)
      addSchedule(data, {
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
    const checkday = dayjs(workDate).isAfter(dayjs(today), 'day') || user?.roleId == ROLE_ADMIN;
    const generatePdf = () => {
      if(!schedules){
        return;
      }
      let i = 1
      let body = [
        [{text:'STT',alignment:'center', bold:true}, 
          {text:'Tên nhân viên', bold:true,alignment:'left'}, 
          {text:'Chức vụ', bold:true}, 
          {text:'Ca làm việc', bold:true},
        ],
      ];
      schedules.forEach((schedule:Schedule) => {
        const shift = shifts.find((shift:Shift) => shift.id == schedule.shiftId);
        const employee = employees.find((emp:Employee) => emp.id === schedule.employeeId);
        body.push([
          { text: (i++).toString(), bold: false, alignment: 'center' },
          { text: employee?.name || '', bold: false, alignment: 'left' },
          { text: employee ? POSITION_LABELS[employee.roleId] : '', bold:false },
          { text: shift ? `${shift.name} (${shift.startTime} - ${shift.endTime})` : '', bold: false,}
        ]);
      });
      const docDefinition:TDocumentDefinitions = {
        content: [
          { text: `Danh sách lịch làm việc ngày ${dayjs(workDate).format('DD/MM/YYYY')}`, style: 'title' },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto','auto'],
              body: body,
            },
            layout: 'default', // có border đầy đủ
            // alignment: 'center',      // Căn giữa bảng
            // margin: [20, 0, 20, 0], // Căn lề cho bảng
          },
        ],
        styles: {
          title: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 20]
          },
        },
        defaultStyle: {
          fontSize: 12
        }
      };
     
      pdfMake.createPdf(docDefinition).open();  // mở preview
    };
    return (
      <Box>
        <Box display={'flex'} gap={2}>
        <CustomButton disabled={!checkday} onClick={handleSubmit(handleFormSubmit)} variant="contained" startIcon={<Save />}>
          Lưu phân công
        </CustomButton>
        <Button 
         startIcon={<PictureAsPdfIcon />}
        variant="contained" color="error" onClick={() => generatePdf()}>Xuất PDF</Button>
        </Box>
        <Grid container spacing={2} sx={{ mb: 3, mt:3,gap:2 }}>
          <Grid size={6}>
          <FormControl fullWidth>
            <Box>
              <Controller
                name="workDate"
                control={control}
                rules={{required:'Ngày làm không để trống'}}
                render={({ field,fieldState:{error} }) => (
                  <DatePicker
                    label="Chọn ngày"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.format('YYYY-MM-DD') : '')
                        setFormData(prev => ({
                          ...prev,
                          dateFrom: date ? date.format('YYYY-MM-DD') : '',
                          dateTo: date ? date.format('YYYY-MM-DD') : ''
                        }));
                      }
                    }
                    format='DD/MM/YYYY'
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />

            </Box>
          </FormControl>
          </Grid>
          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel id="typeEducation-label" >Chức vụ</InputLabel>
              <Select
                labelId="typeEducation-label"
                id="typeEducation"
                label="Chức vụ"
                value={formData.roleId}
                onChange={(e)=>{
                  setFormData({...formData, roleId:e.target.value})
                  const roleId = e.target.value
                  
                }
                  
              }
              >
                <MenuItem value=''>Chức vụ</MenuItem>
                {Object.entries(POSITION_LABELS).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
  
        <TableContainer component={Paper} sx={{ overflowX: 'unset' }}>
          <Table 
          sx={{
            tableLayout: 'fixed',
            fontSize: '0.875rem',
            borderCollapse: 'collapse',
          }}
          >
            <TableHead 
            
            >
              <TableRow>
                <TableCell>Nhân viên</TableCell>
                <TableCell align="center">Ca làm việc</TableCell>
                <TableCell align="center">Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record:ScheduleForm,index) => {
              const employee = employees.find((emp:Employee) => emp.id === record.employeeId);
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                        {employee?.name.charAt(0)}
                      </Avatar>
                      <Typography component={'span'}>{employee?.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Controller
                      name={`records.${index}.shiftId`}
                      control={control}
                      // rules={{ required: 'Loại giao dịch không để trống',
                      // }}
                      render={({ field }) => (
                      <Select
                        size="small"
                        value={record.shiftId}
                        fullWidth
                        onChange={(e) => {      
                          field.onChange(e.target.value);
                          
                        }}
                      >
                        <MenuItem value={0}>-- Chọn ca --</MenuItem>
                        {shifts.filter((item:Shift) => item.status == STATUS_ACTIVE).map((shift:Shift) => (
                          <MenuItem key={shift.id} value={shift.id}>
                            {shift.name} {shift.startTime} - {shift.endTime}
                          </MenuItem>
                        ))}
                      </Select>
                      )}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Controller
                      name={`records.${index}.note`}
                      control={control}
                      render={({ field }) => (
                      <CustomTextarea placeholder='Ghi chú' minRows={3} />
                      )}
                    />
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
};
  export default AssignmentPanel