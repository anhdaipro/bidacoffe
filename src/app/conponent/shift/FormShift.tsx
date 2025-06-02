"use client"
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  Link,
} from '@mui/material';
import { STATUS_LABELS } from '@/form/user';
import React, { useEffect } from 'react';
import { useForm,Controller } from 'react-hook-form';
import { useToastStore } from '../../store/toastStore';
import { v4 as uuidv4 } from 'uuid'
import { RequiredLable } from '../Icon';
import { ShiftForm,Shift } from '@/app/type/model/Shift';
import { useCreateShift, useUpdateShift } from '@/app/query/useShift';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { CustomTextarea } from '../employee/Form';
import { formatNumber } from '@/app/helper';
interface Props{
  shift: Shift;
}
const FormShift: React.FC<Props> = ({ shift }) => {
    const addToast = useToastStore(state=>state.addToast)
  
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ShiftForm>({
        values: {
        ...shift
        },
    });
    const {name, status, startTime, endTime,salaryHour} = watch();
    const { mutate: addCustomer } = useCreateShift();
    const { mutate: updateCustomer } = useUpdateShift();
    const handleFormSubmit = (data: ShiftForm) => {
        const payload = {
        ...data
        };
        if (shift.id) {
        const id = shift.id;
        updateCustomer({ id, payload }, {
            onSuccess: () => {
                addToast({
                    id: uuidv4(),
                    message: 'Cập nhật thành công',
                    type: 'success',
                    
                })
            },
            onError: (error: any) => {
            console.error('Error updating billiard table:', error);
            },
        });
        } else {
            addCustomer(payload, {
            onSuccess: () => {
                addToast({
                    id: uuidv4(),
                    message: 'Thêm mới thành công',
                    type: 'success',
                    
                })
            },
            onError: (error: any) => {
            console.error('Error creating billiard table:', error);
            },
        });
        }
    
    };
  
    const title = shift.id ? 'Cập nhật' : 'Tạo mới';
    return (
   
        <Box   >
            <Grid container spacing={2}>
          {/* Tên */}
            <Grid size={{xs:12}}>
                <TextField
                sx={{ mt: 2 }}
                fullWidth
                label={
                    <span>
                    Tên ca<RequiredLable required />
                    </span>
                }
                {...register('name')}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                />
            </Grid>

            {/* Trạng thái */}
            <Grid size={{xs:12}}>
            <FormControl fullWidth error={Boolean(errors.status)}>
            <InputLabel id="typeEducation-label">Trạng thái<RequiredLable required/></InputLabel>
              <Select
                labelId="typeEducation-label"
                id="typeEducation"
                label="Trạng thái"
                value={status}
                {...register('status', {
                  required: 'Trạng thái không để trống',
                  validate: (value) =>
                    value != 0 || 'Vui lòng chọn trạng thái',
                })}
              >
                <MenuItem value='0'>Trạng thái</MenuItem>
                {Object.entries(STATUS_LABELS).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.status?.message}</FormHelperText>
            </FormControl>
            </Grid>
            
            {/* Thời gian bắt đầu */}
            <Grid size={{xs:12}}>
                <FormControl fullWidth>
                    <Box>
                        <Controller
                        name="startTime"
                        control={control}
                        rules={{required:'Thời gian bắt đầu không để trống'}}
                        render={({ field, fieldState: { error }}) => (
                            <TimePicker
                            label="Thời gian bắt đầu"
                            value={field.value ? dayjs(field.value, 'HH:mm') : null}
                            onChange={(date) =>
                                field.onChange(date ? date.format('HH:mm') : '')
                            }
                            format="HH:mm"
                            timeSteps={{ minutes: 1 }}  // Quan trọng
                            ampm={false} // 👈 Bắt buộc để dùng định dạng 24 giờ
                            slotProps={{
                                textField: {
                                fullWidth: true,
                                error: Boolean(errors.startTime),
                                helperText: errors.startTime?.message,
                                },
                            }}
                            />
                        )}
                        />
                    </Box>
                </FormControl>
            </Grid>
            <Grid size={{xs:12}}>
                <FormControl fullWidth>
                    <Box>
                        <Controller
                        name="endTime"
                        control={control}
                        rules={{required:'Thời gian kết thúc không để trống'}}
                        render={({ field, fieldState: { error }}) => (
                            <TimePicker
                            label="Thời gian kết thúc"
                            value={field.value ? dayjs(field.value, 'HH:mm') : null}
                            onChange={(date) =>
                                field.onChange(date ? date.format('HH:mm') : '')
                            }
                            timeSteps={{ minutes: 1 }}  // Quan trọng
                            ampm={false} // 👈 Bắt buộc để dùng định dạng 24 giờ
                            format="HH:mm"
                            slotProps={{
                                textField: {
                                fullWidth: true,
                                error: Boolean(errors.endTime),
                                helperText: errors.endTime?.message,
                                },
                            }}
                            />
                        )}
                        />
                    </Box>
                </FormControl>
            </Grid>
            {/* Số điện thoại */}
            <Grid size={{xs:12}}>
                <TextField
                    label={
                        <span>
                        Số nhân viên <RequiredLable required />
                        </span>
                    }
                    fullWidth
                    
                    {...register('numEmployee', {
                        required: 'Số nhân viên không hợp lệ',
                        setValueAs: (value) => {
                        return value ? Number(String(value).replace(/,/g, '')) : 0;
                        },
                        validate: (value) => value > 0 || 'Số phải lớn hơn 0',
                    })}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, '');
                        const numeric = Number(raw);
                        setValue('numEmployee', isNaN(numeric) ? 0 : numeric);
                    }}
                    error={!!errors.numEmployee}
                    helperText={errors.numEmployee?.message}
                />
            </Grid>
            <Grid size={{xs:12}}>
                <TextField
                    label={
                        <span>
                        Lương theo giờ
                        </span>
                    }
                    fullWidth
                    value={formatNumber(salaryHour)}
                    {...register('salaryHour', {
                        // required: 'Lương theo giờ không hợp lệ',
                        setValueAs: (value) => {
                        return value ? Number(String(value).replace(/,/g, '')) : 0;
                        },
                        // validate: (value) => value > 0 || 'Số phải lớn hơn 0',
                    })}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, '');
                        const numeric = Number(raw);
                        setValue('salaryHour', isNaN(numeric) ? 0 : numeric);
                    }}
                    error={!!errors.salaryHour}
                    helperText={errors.salaryHour?.message}
                />
            </Grid>
            <Grid size={{xs:12,sm:12}}>
            
                <CustomTextarea placeholder='Mô tả' minRows={3} {...register('description', {})}/>
            </Grid>
            {/* Nút Submit */}
            <Grid size={{xs:12}}>
                <Button onClick={handleSubmit(handleFormSubmit)} fullWidth variant="contained">
                {title}
                </Button>
            </Grid>
        </Grid>
    </Box>
    
  );
};

export default FormShift;