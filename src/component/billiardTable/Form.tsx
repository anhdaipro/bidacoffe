"use client"
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { formatNumber } from '@/app/helper';
import { useCreateBilliardTable, useUpdateBilliardTable } from '@/app/query/useBilliardTable';
import { useAuthStore } from '@/app/store/useUserStore';
import { ROLE_ADMIN } from '@/backend/BidaConst';
import { STATUS_LABELS, TYPE_LABELS } from '@/form/billiardTable';

import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Link,
  Stack,
} from '@mui/material';
import { BilliardTableForm } from '@/app/type/model/Table';
import { RequiredLable } from '../Icon';


interface Props{
  table: BilliardTableForm;
}

const Form: React.FC<Props> = ({ table }) => {
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  useEffect(() => {
    if(user && user.roleId !== ROLE_ADMIN){
      router.push('/billiardTable');
    }
  }, [user, router]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BilliardTableForm>({
    values: { ...table },
  });

  const { mutate: addBilliardTable,isPending: isPendingCreate, isSuccess: 
 isSuccessCreate} = useCreateBilliardTable();
  const { mutate: updateBilliardTable, isPending: isPendingUpdate, isSuccess: 
 isSuccessUpdate} = useUpdateBilliardTable();
  const isPending = isPendingCreate || isPendingUpdate
   const isSuccess = isSuccessCreate || isSuccessUpdate
  const handleFormSubmit = (data: BilliardTableForm) => {
    const payload = { ...data };
    if (table.id) {
      updateBilliardTable({ id: table.id, payload }, {
        onSuccess: () => router.push('/billiardTable'),
        onError: (error) => console.error('Error updating billiard table:', error),
      });
    } else {
      addBilliardTable(payload, {
        onSuccess: () => router.push('/billiardTable'),
        onError: (error) => console.error('Error creating billiard table:', error),
      });
    }
  };

  
  // Handle number input formatting
  const handleHourlyRateChange = (value: string) => {
    let numericValue = value.replace(/[^0-9]/g, '');
    setValue('hourlyRate', numericValue ? Number(numericValue) : 0, { shouldValidate: true });
  };

  const title = table.id ? 'Cập nhật' : 'Tạo mới';

  return (
    <Box
      sx={{
        backgroundColor: '#f9f9f9',
        p: 3,
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Stack direction="row" justifyContent="flex-end" mb={3}>
        <Link href="/billiardTable" underline="none" sx={{
          color: '#007bff',
          fontWeight: 'bold',
          p: '8px 12px',
          border: '1px solid #007bff',
          borderRadius: 1,
          '&:hover': {
            bgcolor: '#007bff',
            color: 'white',
          }
        }}>
          Danh sách
        </Link>
      </Stack>

      <Typography variant="h5" align="center" mb={3}>
        {title} bàn bida
      </Typography>

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {/* Table Number */}
        <Controller
          name="tableNumber"
          control={control}
          rules={{ required: 'Số bàn là bắt buộc' }}
          render={({ field }) => (
            <TextField
              {...field}
              label={
                <span>
                  Số bàn <RequiredLable required />
                </span>
              }
              fullWidth
              margin="normal"
              error={!!errors.tableNumber}
              helperText={errors.tableNumber?.message}
              type="number"
             
            />
          )}
        />

        {/* Status */}
        <Controller
          name="status"
          control={control}
          rules={{ required: 'Trạng thái là bắt buộc' ,
            validate: (value) => value > 0 || 'Trạng thái là bắt buộc',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              fullWidth
              margin="normal"
              error={!!errors.status}
              label={
                <span>
                  Trạng thái <RequiredLable required />
                </span>
              }
              helperText={errors.status?.message}
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
            >
              <MenuItem value="0">Chọn trạng thái</MenuItem>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <MenuItem key={key} value={Number(key)}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Type */}
        <Controller
          name="type"
          control={control}
          rules={{ required: 'Loại bàn là bắt buộc', validate: (value) => Number(value) > 0 || 'Loại bàn là bắt buộc', }}
          render={({ field }) => (
            <TextField
              {...field}
              label={
                <span>
                  Loại bàn <RequiredLable required />
                </span>
              }
              select
              fullWidth
              margin="normal"
              error={!!errors.type}
              helperText={errors.type?.message}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(Number(e.target.value))}
            >
              <MenuItem value="0">Chọn loại bàn</MenuItem>
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <MenuItem key={key} value={Number(key)}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Hourly Rate */}
        <Controller
          name="hourlyRate"
          control={control}
          rules={{
            required: 'Giá theo giờ là bắt buộc',
            validate: (value) => (value > 0 ? true : 'Giá theo giờ phải lớn hơn 0'),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label={
                <span>
                  Giá theo giờ <RequiredLable required />
                </span>
              }
              fullWidth
              margin="normal"
              error={!!errors.hourlyRate}
              helperText={errors.hourlyRate?.message}
              value={formatNumber(field.value)}
              onChange={(e) => handleHourlyRateChange(e.target.value)}
            />
          )}
        />

        <Button
          variant="contained"
          color="success"
          type="submit"
          disabled={isPending || isSuccess}
          fullWidth
          sx={{ mt: 3 }}
        >
          {title}
        </Button>
      </form>
    </Box>
  );
};

export default Form;
