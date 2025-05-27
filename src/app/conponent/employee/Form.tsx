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
  IconButton,
  Link,
} from '@mui/material';
import { useAuthStore } from '@/app/store/useUserStore';
import { ROLE_ADMIN } from '@/backend/BidaConst';
import { STATUS_LABELS } from '@/form/user';
import React, { useEffect,useState,useRef } from 'react';
import { useForm,Controller } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { useCreateCustomer, useUpdateCustomer } from '@/app/query/useUser';
import { useToastStore } from '../../store/toastStore';
import { v4 as uuidv4 } from 'uuid'
import { EmployeeForm,Employee } from '@/app/type/model/Employee';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
interface Props{
  employee: Employee;
}
const Form: React.FC<Props> = ({ employee }) => {
    const user = useAuthStore(state=>state.user)
    const router = useRouter();
    const [images, setImages] = useState<{
        avatar?: { file?: File; preview?: string };
        cccdFront?: { file?: File; preview?: string };
        cccdBack?: { file?: File; preview?: string };
      }>({
        avatar: employee.avatar ? { preview: employee.avatar } : {},
        cccdFront: employee.cccdFront ? { preview: employee.cccdFront } : {},
        cccdBack: employee.cccdBack ? { preview: employee.cccdBack } : {},
      });
    const inputAvatarRef = useRef<HTMLInputElement | null>(null);
    const inputCccdFrontRef = useRef<HTMLInputElement | null>(null);
    const inputCccdBackRef = useRef<HTMLInputElement | null>(null);
    const addToast = useToastStore(state=>state.addToast)
    useEffect(()=>{
        if(user && user.roleId != ROLE_ADMIN){
        router.push('/employee')
        }
    },[user])  
    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        setValue,
        formState: { errors },
    } = useForm<EmployeeForm>({
        values: {
        ...employee, avatar: null, cccdFront: null, cccdBack: null,
        },
  });
  const handleImageChange = (
    key: keyof typeof images,
    file: File | null
  ) => {
    const preview = file ? URL.createObjectURL(file) : null;
    setImages((prev) => ({
      ...prev,
      [key]: { file, preview },
    }));
  };
  const { dateOfBirth,dateBeginJob,dateLeave,bankFullName,bankId,bankNo } = watch();
  const { mutate: addCustomer } = useCreateCustomer();
  const { mutate: updateCustomer } = useUpdateCustomer();
  const handleFormSubmit = (data: EmployeeForm) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('categoryId', data.categoryId.toString());
    formData.append('status', data.status.toString());
    formData.append('price', data.price.toString());
    if (image) formData.append('image', image);
    const payload = {
      ...data
    };
    if (employee.id) {
      const id = employee.id;
      updateCustomer({ id, payload }, {
        onSuccess: () => {
            addToast({
                id: uuidv4(),
                message: 'Cập nhật thành công',
                type: 'success',
                
              })
            window.location.href = '/employee';
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
            window.location.href = '/employee';
        },
        onError: (error: any) => {
          console.error('Error creating billiard table:', error);
        },
      });
    }
    
  };
  
  const title = employee.id ? 'Cập nhật' : 'Tạo mới';
  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        
        <Button variant="outlined" size="small" component={Link} href="/employee">
            Danh sách
          </Button>
        
      </Box>

      <Typography variant="h5" align="center" gutterBottom>
        {title} khách hàng
      </Typography>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <Grid container spacing={2}>
          {/* Tên */}
          <Grid size={{xs:12}}>
            <TextField
              fullWidth
              label="Tên"
              {...register('name')}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          </Grid>

          {/* Trạng thái */}
          <Grid size={{xs:12}}>
            <FormControl fullWidth error={Boolean(errors.status)}>
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                defaultValue=""
                {...register('status', {
                  required: 'Trạng thái là bắt buộc',
                  validate: (value) =>
                    Number(value) > 0 ? true : 'Trạng thái là bắt buộc',
                })}
              >
                <MenuItem value={0}>Chọn trạng thái</MenuItem>
                {Object.entries(STATUS_LABELS).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.status?.message}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Số điện thoại */}
          <Grid size={{xs:12}}>
            <TextField
              fullWidth
              label="Số điện thoại"
              {...register('phone', { required: 'SĐT không để trống' })}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
            />
          </Grid>
            {/* Ngày sinh */}
            <Grid size={{xs:12}}>
            <FormControl fullWidth>
              <Box>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  rules={{required:'Ngày sinh không để trống'}}
                  render={({ field }) => (
                    <DatePicker
                    className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-fullWidth"
                    value={dateOfBirth ? dayjs(dateOfBirth) : null}
                    onChange={(date) => {
                      setValue('dateOfBirth', dayjs(date).format('YYYY-MM-DD'))
                    }}
                    maxDate={dayjs().add(-16, 'y')}
                    minDate={dayjs().add(-60, 'y')}
                    label="Ngày sinh"
                    format='DD/MM/YYYY'
                    slotProps={{
                      textField: {
                        inputProps: {
                          onKeyDown: (e:any) => e.preventDefault(), // chặn nhập bàn phím
                        },
                      },
                    }}
                  />
                  
                  )}
                />
                {errors.dateOfBirth && (
                    <Typography color="error" variant="body2" mt={1}>
                      {errors.dateOfBirth.message}
                    </Typography>)}
              </Box>
            </FormControl>
            </Grid>

            {/* Ngày bắt đầu làm việc */}
            <Grid size={{xs:12}}>
            <FormControl fullWidth>
              <Box>
                <Controller
                  name="dateBeginJob"
                  control={control}
                  rules={{required:'Ngày bắt đầu làm không để trống'}}
                  render={({ field }) => (
                    <DatePicker
                    className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-fullWidth"
                    value={dateBeginJob ? dayjs(dateBeginJob) : null}
                    onChange={(date) => {
                      setValue('dateBeginJob', dayjs(date).format('YYYY-MM-DD'))
                    }}
                    maxDate={dayjs().add(-16, 'y')}
                    minDate={dayjs().add(-60, 'y')}
                    label="Ngày bắt đầu làm"
                    format='DD/MM/YYYY'
                    slotProps={{
                      textField: {
                        inputProps: {
                          onKeyDown: (e:any) => e.preventDefault(), // chặn nhập bàn phím
                        },
                      },
                    }}
                  />
                  
                  )}
                />
                {errors.dateBeginJob && (
                    <Typography color="error" variant="body2" mt={1}>
                      {errors.dateBeginJob.message}
                    </Typography>)}
              </Box>
            </FormControl>
            </Grid>

            {/* Ngày nghỉ việc */}
            <Grid size={{xs:12}}>
            <FormControl fullWidth>
              <Box>
                <Controller
                  name="dateLeave"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                    className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-fullWidth"
                    value={dateLeave ? dayjs(dateLeave) : null}
                    onChange={(date) => {
                      setValue('dateLeave', dayjs(date).format('YYYY-MM-DD'))
                    }}
                    maxDate={dayjs().add(-16, 'y')}
                    minDate={dayjs().add(-60, 'y')}
                    label="Ngày bắt đầu làm"
                    format='DD/MM/YYYY'
                    slotProps={{
                      textField: {
                        inputProps: {
                          onKeyDown: (e:any) => e.preventDefault(), // chặn nhập bàn phím
                        },
                      },
                    }}
                  />
                  
                  )}
                />
                {errors.dateLeave && (
                    <Typography color="error" variant="body2" mt={1}>
                      {errors.dateLeave.message}
                    </Typography>)}
              </Box>
            </FormControl>
            </Grid>

            {/* Vị trí */}
            <Grid size={{xs:12}}>
            <TextField
                fullWidth
                label="Vị trí"
                type="number"
                {...register('position', { required: 'Vị trí không được để trống' })}
                error={Boolean(errors.position)}
                helperText={errors.position?.message}
            />
            </Grid>

            {/* CCCD Mặt Trước */}
            <Grid size={{xs:12}}>
              <FormControl fullWidth>
                <Typography variant="subtitle1" gutterBottom>
                    CCDD Mặt Trước
                    </Typography>
                    <input
                    type="file"
                    accept="image/*"
                    ref={inputCccdFrontRef}
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) handleImageChange('cccdFront', file);
                      }}
                    />
                </FormControl>
                <Button variant="contained" onClick={() => inputCccdFrontRef.current?.click()}>
                  Chọn file
                </Button>
                {images.cccdFront?.preview && (
                <Box mt={2} display="flex" alignItems="center" gap={2}>
                <Box
                    component="img"
                    src={images.cccdFront.preview}
                    alt="Preview"
                    sx={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid #ccc',
                    }}
                />
                <IconButton
                    color="error"
                    onClick={()=>handleImageChange('cccdFront', null)}
                    aria-label="Xóa file"
                    size="large"
                >
                    <DeleteIcon />
                </IconButton>
                </Box>
                )}
            </Grid>

            {/* CCCD Mặt Sau */}
            <Grid size={{xs:12}}>
            
                <FormControl fullWidth>
                    <Typography variant="subtitle1" gutterBottom>
                    CCDD Mặt Sau
                    </Typography>
                    <input
                    type="file"
                    accept="image/*"
                    ref={inputCccdBackRef}
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) handleImageChange('cccdBack', file);
                      }}
                    />
                </FormControl>
                <Button variant="contained" onClick={() => inputCccdBackRef.current?.click()}>
                  Chọn file
                </Button>
                {images.cccdBack?.preview && (
                <Box mt={2} display="flex" alignItems="center" gap={2}>
                <Box
                    component="img"
                    src={images.cccdBack.preview}
                    alt="Preview"
                    sx={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid #ccc',
                    }}
                />
                <IconButton
                    color="error"
                    onClick={()=>handleImageChange('cccdBack', null)}
                    aria-label="Xóa file"
                    size="large"
                >
                    <DeleteIcon />
                </IconButton>
                </Box>
                )}
            
            </Grid>

            {/* Ảnh đại diện */}
            <Grid size={{xs:12}}>
                <FormControl fullWidth>
                    <Typography variant="subtitle1" gutterBottom>
                    Ảnh đại diện
                    </Typography>
                    <input
                    type="file"
                    accept="image/*"
                    ref={inputAvatarRef}
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) handleImageChange('avatar', file);
                      }}
                    />
                </FormControl>
                <Button variant="contained" onClick={() => inputAvatarRef.current?.click()}>
                  Chọn file
                </Button>
                {images.avatar?.preview && (
                <Box mt={2} display="flex" alignItems="center" gap={2}>
                <Box
                    component="img"
                    src={images.avatar.preview}
                    alt="Preview"
                    sx={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid #ccc',
                    }}
                />
                <IconButton
                    color="error"
                    onClick={()=>handleImageChange('avatar', null)}
                    aria-label="Xóa file"
                    size="large"
                >
                    <DeleteIcon />
                </IconButton>
                </Box>
                )}
            </Grid>

            {/* Ngân hàng */}
            <Grid size={{xs:12}}>
            <TextField
                fullWidth
                label="Mã ngân hàng"
                type="number"
                {...register('bankId',{ required: 'Mã ngân hàng không được để trống' })}
                helperText={errors.bankId?.message}
            />
            </Grid>

            <Grid size={{xs:12}}>
            <TextField
                fullWidth
                label="Tên chủ tài khoản"
                {...register('bankFullName', { required: 'Tên chủ tài khoản không được để trống' })}
                helperText={errors.bankFullName?.message}
            />
            </Grid>

            <Grid size={{xs:12}}>
            <TextField
                fullWidth
                label="Số tài khoản ngân hàng"
                {...register('bankNo', { required: 'Số tài khoản ngân hàng không được để trống' })}
                helperText={errors.bankNo?.message}
            />
            </Grid>
          {/* Nút Submit */}
          <Grid size={{xs:12}}>
            <Button type="submit" fullWidth variant="contained">
              {title}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Form;