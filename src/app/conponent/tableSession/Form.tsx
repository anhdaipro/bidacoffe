'use client';
import React, { useState, memo } from 'react';
import { useForm, SubmitHandler, useFieldArray, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  CircularProgress,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useProductsSearch } from '@/app/query/useProducts';
import { useCreateTableSession, useUpdateTableSession } from '@/app/query/useTableSession';
import { useBilliardTables } from '@/app/query/useBilliardTable';
import { useControlStore } from '@/app/store/useStore';
import { useToastStore } from '@/app/store/toastStore';
import { v4 as uuidv4 } from 'uuid';
import { formatNumber, normalizeString } from '@/app/helper';
import { STATUS_SESSION_LABELS } from '@/form/billiardTable';
import { PAYMENT_METHOD_LABELS } from '@/form/payment';
import { TableSessionForm } from '@/app/type/model/TableSession';


interface Detail {
  productId: number;
  categoryId: number;
  quantity: number;
  price: number;
}

interface Product {
  id: number;
  name: string;
  categoryId: number;
}

interface Props {
  tableSession: TableSessionForm;
}

const headers = ['STT', 'Tên sản phẩm', 'Giá', 'Số lượng', 'Tiền', 'Action'];

const FormTableSession: React.FC<Props> = ({ tableSession }) => {
  const { data: products, isLoading } = useProductsSearch();
  const { data: tables, isLoading: isLoadingTable } = useBilliardTables();
  const { mutate: addTransaction } = useCreateTableSession();
  const { mutate: updateTransaction } = useUpdateTableSession();
  const setLoading = useControlStore((state) => state.setLoading);
  const [ignoreInputChange, setIgnoreInputChange] = useState(false);
  const addToast = useToastStore((state) => state.addToast);
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<TableSessionForm>({
    defaultValues: { ...tableSession },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'orders',
  });
  const {tableId,status,paymentMethod} = watch()
  const details = watch('orders');
  const totalAmount = details.reduce((acc, detail) => acc + detail.price * detail.quantity, 0);

  // Loading state
  if (isLoading || isLoadingTable) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  // Handle form submission
  const sendData: SubmitHandler<TableSessionForm> = async (data) => {
    const payload = { ...data, totalAmount };
    if (tableSession.id) {
      updateTransaction(
        { id: tableSession.id, payload },
        {
          onSuccess: () => {
            addToast({
              id: uuidv4(),
              message: 'Cập nhật thành công',
              type: 'success',
            });
            router.push('/transaction');
          },
          onError: (error: any) => {
            addToast({
              id: uuidv4(),
              message: error.response.data.message,
              type: 'error',
              content: (
                <Box>
                  {Object.entries(error.response.data.error).map(([key, value]) => (
                    <Typography key={key}>{value as string}</Typography>
                  ))}
                </Box>
              ),
            });
          },
        }
      );
    } else {
      addTransaction(payload, {
        onSuccess: () => {
          addToast({
            id: uuidv4(),
            message: 'Tạo mới thành công',
            type: 'success',
          });
          router.push('/transaction');
        },
        onError: (error: any) => {
          addToast({
            id: uuidv4(),
            message: error.response.data.message,
            type: 'error',
            content: (
              <Box>
                {Object.entries(error.response.data.error).map(([key, value]) => (
                  <Typography key={key}>{value as string}</Typography>
                ))}
              </Box>
            ),
          });
        },
      });
    }
  };

  // Add product to details
  const addProductToDetails = (product: Product | null) => {
    if (!product) return;
    const exists = details.find((d) => d.productId === product.id);
    if (exists) {
      alert('Sản phẩm này đã thêm rồi!');
      return;
    }
    append({
      productId: product.id,
      categoryId: product.categoryId,
      quantity: 1,
      price: 0,
    });
    // Reset the Autocomplete input
    setSearchInput('');
  };

  const title = tableSession.id ? 'Cập nhật' : 'Tạo mới';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 }, bgcolor: 'background.paper', borderRadius: 2 }}>
        {/* Back Link */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button component={Link} href="/tableSession" variant="outlined" color="primary">
            Danh sách giao dịch
          </Button>
        </Box>

        {/* Title */}
        <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
          {title} giao dịch sản phẩm
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(sendData)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Grid container spacing={2} >
            {/* Player Name */}
            <Grid size={{xs:12, sm:6}}>
              <TextField
                fullWidth
                label="Tên người chơi"
                {...register('playerName')}
                error={!!errors.playerName}
                helperText={errors.playerName?.message}
                size='small'
              />
            </Grid>

            {/* Phone */}
            <Grid size={{xs:12, sm:6}}>
              <TextField
                fullWidth
                label="Số điện thoại"
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>

            {/* Status */}
            <Grid size={{xs:12, sm:6}}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Trạng thái</InputLabel>
                <Select value={status} {...register('status', { required: 'Trạng thái không để trống' })} label="Trạng thái">
                 
                  {Object.entries(STATUS_SESSION_LABELS).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Payment Method */}
            <Grid size={{xs:12, sm:6}}>
              <FormControl fullWidth error={!!errors.paymentMethod}>
                <InputLabel>Phương thức thanh toán</InputLabel>
                <Select value={paymentMethod} {...register('paymentMethod')} label="Phương thức thanh toán">
                  
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
                {errors.paymentMethod && <FormHelperText>{errors.paymentMethod.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Table Number */}
            <Grid size={{xs:12, sm:6}}>
              <FormControl fullWidth error={!!errors.tableId}>
                <InputLabel>Bàn số</InputLabel>
                <Select value={watch('tableId')} {...register('tableId', { required: 'Bàn không để trống' })} label="Bàn số">
                  
                  {tables.map((table: any) => (
                    <MenuItem key={table.id} value={table.id}>
                      Bàn số {table.tableNumber}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tableId && <FormHelperText>{errors.tableId.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Start Time */}
            <Grid size={{xs:12, sm:6}}>
              <Controller
                name="startTime"
                control={control}
                rules={{ required: 'Thời gian bắt đầu không để trống' }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Bắt đầu"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* End Time */}
            <Grid size={{xs:12, sm:6}}>
              <Controller
                name="endTime"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Kết thúc"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Note */}
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Ghi chú"
                multiline
                rows={4}
                {...register('note')}
                error={!!errors.note}
                helperText={errors.note?.message}
              />
            </Grid>

            {/* Product Search */}
            <Grid size={{xs:12}}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Thêm sản phẩm
              </Typography>
              <Autocomplete
                options={products}
                getOptionLabel={(option: Product) => option.name}
                inputValue={searchInput}
                onInputChange={(_event, newInputValue) => {
                  if (!ignoreInputChange) {
                    setSearchInput(newInputValue);
                  }
                  setIgnoreInputChange(false);
                }}
                onChange={(_event, value) => {
                  if (value) {
                    addProductToDetails(value);
                    setIgnoreInputChange(true);
                    setSearchInput('');
                  }
                }}
                componentsProps={{
                  clearIndicator: { sx: { display: 'none' } },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tìm sản phẩm..."
                    placeholder="Tìm sản phẩm..."
                    fullWidth
                  />
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    normalizeString(option.name).includes(normalizeString(inputValue))
                  )
                }
              />
            </Grid>
          </Grid>

          {/* Product Details Table */}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            Order sản phẩm
          </Typography>
          <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="product details table">
              <TableHead>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableCell key={index} sx={{ fontWeight: 'bold', textAlign: index === 2 || index === 3 || index === 4 ? 'right' : 'left' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((detail, index) => {
                  const product = products.find((p: Product) => p.id === detail.productId);
                  if (!product) return null;
                  return (
                    <TableRow key={index} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">
                        <Controller
                          name={`orders.${index}.price`}
                          control={control}
                          rules={{
                            required: 'Giá không hợp lệ',
                            validate: (value) => value > 0 || 'Giá phải lớn hơn 0',
                          }}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                              size="small"
                              value={formatNumber(value)}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/,/g, '');
                                const numeric = Number(raw);
                                onChange(isNaN(numeric) ? 0 : numeric);
                              }}
                              error={!!error}
                              helperText={error?.message}
                              sx={{ width: 100 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Controller
                          name={`orders.${index}.quantity`}
                          control={control}
                          rules={{
                            required: 'Số lượng không hợp lệ',
                            validate: (value) => value > 0 || 'Số lượng phải lớn hơn 0',
                          }}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                              size="small"
                              value={formatNumber(value)}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/,/g, '');
                                const numeric = Number(raw);
                                onChange(isNaN(numeric) ? 0 : numeric);
                              }}
                              error={!!error}
                              helperText={error?.message}
                              sx={{ width: 100 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="right">{formatNumber(detail.price * detail.quantity)}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="error" size="small" onClick={() => remove(index)}>
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                    Tổng tiền
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatNumber(totalAmount)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Submit Button */}
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2, alignSelf: 'flex-end' }}>
            {title}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default memo(FormTableSession);