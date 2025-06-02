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
  TextareaAutosize,
} from '@mui/material';
import Link from 'next/link';
import { useAuthStore } from '@/app/store/useUserStore';
import { ROLE_ADMIN } from '@/backend/BidaConst';
import { BANK_LABELS, POSITION_LABELS, STATUS_LABELS, TYPE_EDUCATION_LABELS } from '@/form/user';
import React, { useEffect,useState,useRef } from 'react';
import { useForm,Controller } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { useToastStore } from '../../store/toastStore';
import { v4 as uuidv4 } from 'uuid'
import { EmployeeForm,Employee } from '@/app/type/model/Employee';
import {DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCreateEmployee, useUpdateEmployee } from '@/app/query/useEmployee';
import { formatNumber } from '@/app/helper';
import { RequiredLable } from '../Icon';
import { styled } from '@mui/system';
import { SHIFT_LABELS } from '@/form/shifth';
export const CustomTextarea = styled(TextareaAutosize)(
  ({ theme }) => ({
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    borderRadius: '8px',
    border: '1px solid #ccc',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    // minHeight: '100px',
    resize: 'vertical',

    '&:focus': {
      outline: 'none',
      borderWidth: '1.5px',
      borderColor: '#1976d2', // màu xanh MUI
      
    },

    '&::placeholder': {
      color: '#aaa',
    },
  })
);
interface Props{
  employee: Employee;
}

const Form: React.FC<Props> = ({ employee }) => {
  console.log(employee);
    const user = useAuthStore(state=>state.user)
    const router = useRouter();
    const [images, setImages] = useState<{
        avatar: { file?: File; preview?: string };
        cccdFront: { file?: File; preview?: string };
        cccdBack: { file?: File; preview?: string };
      }>({
        avatar: {},
        cccdFront: {},
        cccdBack: {},
      });
    useEffect(() => {
      setImages({
        avatar: employee.avatar ? { preview: employee.avatar } : {},
        cccdFront: employee.cccdFront ? { preview: employee.cccdFront } : {},
        cccdBack: employee.cccdBack ? { preview: employee.cccdBack } : {},
      });
    }, [employee.avatar, employee.cccdFront, employee.cccdBack]);
    const inputAvatarRef = useRef<HTMLInputElement | null>(null);
    const inputCccdFrontRef = useRef<HTMLInputElement | null>(null);
    const inputCccdBackRef = useRef<HTMLInputElement | null>(null);
    const addToast = useToastStore(state=>state.addToast)
    useEffect(() => {
      // Cleanup preview URLs when component unmounts or images change
      return () => {
        Object.values(images).forEach((imageObj) => {
          if (imageObj.preview) {
            URL.revokeObjectURL(imageObj.preview);
          }
        });
      };
    },[])
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
        clearErrors,
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
    setValue(key, file); // Cập nhật giá trị trong form
    if(file){
      clearErrors(key); // Xóa lỗi nếu có
    }
    const preview = file ? URL.createObjectURL(file) : null;
    setImages((prev) => ({
      ...prev,
      [key]: { file, preview },
    }));
  };
  console.log(errors.cccdFront);
  const { dateOfBirth,dateBeginJob,dateLeave,bankFullname,bankId,typeEducation,shiftId,baseSalary,status,roleId } = watch();
  const { mutate: addEmployee } = useCreateEmployee();
  const { mutate: updateEmployee } = useUpdateEmployee();
  const handleRequest = (formData: FormData) => {
    if (employee.id) {
      const id = employee.id;
      updateEmployee(
        { id, formData },
        {
          onSuccess: () => {
            addToast({
              id: uuidv4(),
              message: 'Cập nhật thành công',
              type: 'success',
            });
            router.push('/employee');
          },
          onError: (error: any) => {
            addToast({
              id: uuidv4(),
              message: error.response?.data?.message || 'Lỗi cập nhật',
              type: 'error',
            });
          },
        }
      );
    } else {
      addEmployee(formData, {
        onSuccess: () => {
          addToast({
            id: uuidv4(),
            message: 'Thêm mới thành công',
            type: 'success',
          });
          router.push('/employee');
        },
        onError: (error: any) => {
          addToast({
            id: uuidv4(),
            message: error.response?.data?.message,
            type: 'error',
          });
        },
      });
    }
  };
  const handleFormSubmit = (data: EmployeeForm) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // Nếu value là số thì convert sang string
      if (value) {
        formData.append(key, value.toString());
      }
    });
    // Object.entries(images).forEach(([key, imageObj]) => {
    //   if (imageObj.file) {
    //     formData.append(key, imageObj.file);
    //   }
    // });
    handleRequest(formData);
    
  };
  console.log(images)
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
          <Grid size={{xs:12,sm:6}}>
            {/* <InputLabel id="name" >Tên<span style={{ color: 'red' }}> * </span></InputLabel> */}
            <TextField
              fullWidth
              
              id='name-controlled'
              label={
                <span>
                  Tên<span style={{ color: 'red' }}> *</span>
                </span>
              }
              {...register('name',{required: 'Tên không để trống',})}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          </Grid>

          {/* Trạng thái */}
          <Grid size={{xs:12,sm:6}}>
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
                    value != '0' || 'Vui lòng chọn trạng thái',
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
          <Grid size={{xs:12,sm:6}}>
            <FormControl fullWidth error={Boolean(errors.roleId)}>
              <InputLabel id="typeEducation-label" >Chức vụ<RequiredLable required /></InputLabel>
              <Select
                labelId="typeEducation-label"
                id="typeEducation"
                label="Chức vụ"
                value={roleId}
                {...register('roleId', {
                  required: 'Chức vụ không để trống',
                  validate: (value) =>
                    Number(value) > 0 || 'Vui lòng chọn chức vụ',
                })}
              >
                <MenuItem value={0}>Chức vụ</MenuItem>
                {Object.entries(POSITION_LABELS).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.roleId?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={{xs:12,sm:6}}>
            <FormControl fullWidth error={Boolean(errors.shiftId)}>
              <InputLabel >Ca làm việc<RequiredLable required /></InputLabel>
              <Select
                id="shiftId"
                label="Ca làm việc"
                value={shiftId}
                {...register('shiftId', {
                  required: 'Vui lòng chọn ca làm việc',
                  validate: (value) =>
                    Number(value) > 0 || 'Vui lòng chọn ca làm việc',  
                })}
              >
                <MenuItem value={0}>Ca làm việc</MenuItem>
                {Object.entries(SHIFT_LABELS).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.shiftId?.message}</FormHelperText>
            </FormControl>
          </Grid>
          {/* Số điện thoại */}
          <Grid size={{xs:12,sm:6}}>
            <TextField
              fullWidth
              label={
                <span>
                  Số điện thoại<RequiredLable required />
                </span>
              }
              {...register('phone', { required: 'SĐT không để trống' })}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
            />
          </Grid>
            {/* Ngày sinh */}
            <Grid size={{xs:12,sm:6}}>
            <FormControl fullWidth>
              <Box>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  rules={{required:'Ngày sinh không để trống'}}
                  render={({ field,fieldState:{error} }) => (
                    <DatePicker
                    className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-fullWidth"
                    value={dateOfBirth ? dayjs(dateOfBirth) : null}
                    onChange={(date) => {
                      setValue('dateOfBirth', dayjs(date).format('YYYY-MM-DD'))
                    }}
                    maxDate={dayjs().add(-16, 'y')}
                    minDate={dayjs().add(-60, 'y')}
                    label={
                      <span>
                        Ngày sinh<RequiredLable required />
                      </span>
                    }
                    format='DD/MM/YYYY'
                    slotProps={{
                      textField: {
                        fullWidth: true, 
                        error: !!error,
                        helperText: error?.message,
                        inputProps: {
                          onKeyDown: (e:any) => e.preventDefault(), // chặn nhập bàn phím
                        },
                      },
                    }}
                  />
                  
                  )}
                />
              </Box>
            </FormControl>
            </Grid>

            {/* Ngày bắt đầu làm việc */}
            <Grid size={{xs:12,sm:6}}>
            <FormControl fullWidth>
              <Box>
                <Controller
                  name="dateBeginJob"
                  control={control}
                  rules={{required:'Ngày bắt đầu làm không để trống'}}
                  render={({ field,fieldState:{error} }) => (
                    <DatePicker
                    className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-fullWidth"
                    value={dateBeginJob ? dayjs(dateBeginJob) : null}
                    onChange={(date) => {
                      setValue('dateBeginJob', dayjs(date).format('YYYY-MM-DD'))
                    }}
                   
                    label={
                      <span>
                        Ngày bắt đầu làm việc<RequiredLable required />
                      </span>
                    }
                    format='DD/MM/YYYY'
                    slotProps={{
                      textField: {
                        fullWidth: true, 
                        error: !!error,
                        helperText: error?.message,
                        inputProps: {
                          
                          onKeyDown: (e:any) => e.preventDefault(), // chặn nhập bàn phím
                        },
                      },
                    }}
                  />
                  
                  )}
                />
              </Box>
            </FormControl>
            </Grid>

            {/* Ngày nghỉ việc */}
            <Grid size={{xs:12,sm:6}}>
            <FormControl fullWidth>
              <Box>
                <Controller
                  name="dateLeave"
                  control={control}
                  render={({ field, fieldState:{error} }) => (
                    <DatePicker
                    
                    value={dateLeave ? dayjs(dateLeave) : null}
                    onChange={(date) => {
                      setValue('dateLeave', dayjs(date).format('YYYY-MM-DD'))
                    }}
                    
                    label="Ngày nghỉ việc"
                    format='DD/MM/YYYY'
                    slotProps={{
                      textField: {
                        fullWidth: true, 
                        error: !!error,
                          helperText: error?.message,
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
            <Grid size={{xs:12,sm:6}}>
            <FormControl fullWidth error={Boolean(errors.typeEducation)}>
              <InputLabel id="typeEducation-label">Học vấn</InputLabel>
              <Select
                labelId="typeEducation-label"
                id="typeEducation"
                label="Học vấn"
                value={typeEducation}
                {...register('typeEducation', {
                })}
              >
                <MenuItem value={0}>Học vấn</MenuItem>
                {Object.entries(TYPE_EDUCATION_LABELS).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.typeEducation?.message}</FormHelperText>
            </FormControl>
            </Grid>
          {/* Ngân hàng */}
          <Grid size={{xs:12,sm:6}}>
          <FormControl fullWidth error={Boolean(errors.bankId)}>
              <InputLabel id="bank-label">Ngân hàng<RequiredLable required/></InputLabel>
              <Select
                labelId="bank-label"
                id="bank"
                label="Ngân hàng"
                value={bankId}
                {...register('bankId', {
                  required: 'Vui lòng chọn ngân hàng',
                  validate: (value) =>
                    Number(value) > 0 ? true : 'Vui lòng chọn ngân hàng',
                })}
              >
                <MenuItem value={0}>Chọn ngân hàng</MenuItem>
                {Object.entries(BANK_LABELS).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.bankId?.message}</FormHelperText>
            </FormControl>
            </Grid>

            <Grid size={{xs:12,sm:6}}>
            <TextField
                fullWidth
                label={
                  <span>
                    Tên chủ tài khoản ngân hàng<RequiredLable required />
                  </span>
                }
                {...register('bankFullname', { required: 'Tên chủ tài khoản không được để trống' })}
                error={Boolean(errors.bankFullname)}
                helperText={errors.bankFullname?.message}
            />
            </Grid>

            <Grid size={{xs:12,sm:6}}>
            <TextField
                fullWidth
                label={
                  <span>
                    Số tài khoản ngân hàng<RequiredLable required />
                  </span>
                }
                {...register('bankNo', { required: 'Số tài khoản ngân hàng không được để trống' })}
                error={Boolean(errors.bankNo)}
                helperText={errors.bankNo?.message}
            />
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              {/* Price */}
              <TextField
                label={
                  <span>
                    Lương cơ bản<RequiredLable required />
                  </span>
                }
                fullWidth
                value={formatNumber(baseSalary)}
                {...register('baseSalary', {
                  required: 'Lương cơ bản không hợp lệ',
                  setValueAs: (value) => {
                    return value ? Number(String(value).replace(/,/g, '')) : 0;
                  },
                  validate: (value) => value > 0 || 'Lương cơ bản lớn hơn 0',
                })}
                onChange={(e)=>{
                  const raw = e.target.value.replace(/,/g, '');
                  const numeric = Number(raw);
                  setValue('baseSalary',isNaN(numeric) ? 0 : numeric);
                }}
                error={!!errors.baseSalary}
                helperText={errors.baseSalary?.message}
              />
            </Grid>
            <Grid size={{xs:12,sm:12}}>
            
                <CustomTextarea minRows={3} {...register('note', {})}/>
            </Grid>
            {/* CCCD Mặt Trước */}
            <Grid size={{xs:6,sm:6}}>
              <FormControl fullWidth error={!!images.cccdFront.preview}>
                <Typography variant="subtitle1" gutterBottom>
                    CCDD Mặt Trước<RequiredLable required />
                    </Typography>
                    <input
                    type="file"
                    accept="image/*"
                    {...register('cccdFront', {
                      
                      validate: (value) =>
                        images.cccdFront.preview ? true : 'Vui lòng chọn ảnh mặt trước CCCD',
                    })}
                    ref={inputCccdFrontRef}
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) handleImageChange('cccdFront', file);
                      }}
                    />
                
                {!images.cccdFront.preview && <Button variant="contained" onClick={() => inputCccdFrontRef.current?.click()}>
                  Chọn file
                </Button>}
                {images.cccdFront?.preview && (
                <Box mt={2} 
                sx={{
                  width: '100%',
                  height:200,
                  '&:hover .delete-btn': { opacity: 1 } // 👈 hover mới hiện nút
                }}
                display="flex" alignItems="center" gap={2} position={'relative'}>
                <Box
                    component="img"
                    src={images.cccdFront.preview}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid #ccc',
                    }}
                />
                <IconButton
                    className="delete-btn"
                    onClick={() => {
                      handleImageChange('cccdFront', null)
                      
                    }}
                    aria-label="Xóa file"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,1)',
                      },
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  
                </Box>
                )}
                {errors.cccdFront?.message && (
                  <FormHelperText error>
                    {errors.cccdFront.message}
                  </FormHelperText>
                )}
                </FormControl>
            </Grid>

            {/* CCCD Mặt Sau */}
            <Grid size={{xs:6,sm:6}}>
            
                <FormControl fullWidth>
                    <Typography variant="subtitle1" gutterBottom>
                      CCDD Mặt Sau<RequiredLable required />
                    </Typography>
                    <input
                    type="file"
                    accept="image/*"
                    {...register('cccdBack', {
                      
                      validate: (value) =>
                        images.cccdBack.preview ? true : 'Vui lòng chọn ảnh mặt trước CCCD',
                    })}
                    ref={inputCccdBackRef}
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) handleImageChange('cccdBack', file);
                        
                      }}
                    />
                
                {!images.cccdBack.preview && <Button variant="contained" onClick={() => inputCccdBackRef.current?.click()}>
                  Chọn file
                </Button>}
                {images.cccdBack?.preview && (
                <Box mt={2} display="flex" 
                sx={{
                  width: '100%',
                  height: 200,
                  '&:hover .delete-btn': { opacity: 1 } // 👈 hover mới hiện nút
                }}
                 alignItems="center" gap={2} position="relative">
                  <Box
                      component="img"
                      src={images.cccdBack.preview}
                      alt="Preview"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: 1,
                        border: '1px solid #ccc',
                      }}
                  />
                  <IconButton
                    className="delete-btn"
                    onClick={() => {
                      handleImageChange('cccdBack', null)
                      
                    }}

                    aria-label="Xóa file"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,1)',
                      },
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                )}
              {errors.cccdBack?.message && (
                  <FormHelperText error>
                    {errors.cccdBack.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Ảnh đại diện */}
            <Grid size={{xs:6,sm:4}}>
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
                {!images.avatar.preview && <Button variant="contained" onClick={() => inputAvatarRef.current?.click()}>
                  Chọn file
                </Button>}
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
                    onClick={()=>{
                      handleImageChange('avatar', null)
                    }}
                    aria-label="Xóa file"
                    size="large"
                >
                    <DeleteIcon />
                </IconButton>
                </Box>
                )}
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