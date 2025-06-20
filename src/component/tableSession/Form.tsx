'use client';
import React, { useState, memo } from 'react';
import { useForm, SubmitHandler, useFieldArray, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DateTimePicker } from '@mui/x-date-pickers';
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
  IconButton,
  Paper,
  Autocomplete,
  CircularProgress,
  FormControl,
  InputLabel,
  FormHelperText,
  useMediaQuery,
  Stack,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { Product } from '@/app/type/model/Product';
import { RequiredLable } from '../Icon';
interface Props {
  tableSession: TableSessionForm;
}

const headers = ['STT', 'Tên sản phẩm', 'Giá', 'Số lượng', 'Tiền', 'Action'];

const FormTableSession: React.FC<Props> = ({ tableSession }) => {
  const { data: products, isLoading } = useProductsSearch();
  const { data: tables, isLoading: isLoadingTable } = useBilliardTables();
  const { mutate: addTransaction, isPending: isPendingCreate, isSuccess: 
 isSuccessCreate} = useCreateTableSession();
  const { mutate: updateTransaction, isPending: isPendingUpdate, isSuccess: 
 isSuccessUpdate} = useUpdateTableSession();
  const isPending = isPendingCreate || isPendingUpdate
  const isSuccess = isSuccessCreate || isSuccessUpdate
  const addToast = useToastStore((state) => state.addToast);
  const [searchInput, setSearchInput] = useState('');
  const [product, setProduct] = React.useState<Product | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<TableSessionForm>({
    values: tableSession,
  });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'orders',
  });
  const {tableId,status,paymentMethod,startTime,endTime} = watch()
  const details = watch('orders');
  const amountOrder = details.reduce((acc, detail) => acc + detail.price * detail.quantity, 0);

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
    const payload = { ...data, amountOrder };
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
            router.push('/tableSession');
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
          router.push('/tableSession');
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
      price: product.price,
    });
    // Reset the Autocomplete input
    setSearchInput('');
  };

  const title = tableSession.id ? 'Cập nhật' : 'Tạo mới';

  return (
    
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
                <InputLabel>Trạng thái <RequiredLable required /></InputLabel>
                <Select value={status} {...register('status', { required: 'Trạng thái không để trống',
                  validate: (value) => (Number(value) > 0 ? true : 'Trạng thái không để trống'),
                 })} label="Trạng thái">
                  <MenuItem value="0"> Chọn trạng thái</MenuItem>
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
                <Select value={paymentMethod} 
                {...register('paymentMethod', {})}
                label="Phương thức thanh toán"
                >
                  <MenuItem value="0"> Chọn phương thức thanh toán</MenuItem>
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
                <InputLabel>Bàn số <RequiredLable required /></InputLabel>
                <Select value={tableId} {...register('tableId', { required: 'Bàn không để trống' })} label="Bàn số">
                  
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
                  <DateTimePicker
                  
                    label={
                      <span>
                        Bắt đầu <RequiredLable required />
                      </span>
                    }
                    format='DD/MM/YYYY HH:mm'
                    value={startTime ? dayjs(startTime) : null}
                    onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD HH:mm') : '')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                    timeSteps={{ minutes: 1 }}  // Quan trọng
                    ampm={false} // 👈 Bắt buộc để dùng định dạng 24 giờ
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
                  <DateTimePicker
                  
                    label="Kết thúc"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD HH:mm') : '')}
                    format='DD/MM/YYYY HH:mm'
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                    timeSteps={{ minutes: 1 }}  // Quan trọng
                    ampm={false} // 👈 Bắt buộc để dùng định dạng 24 giờ
                    
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
                value={product}
                onChange={(_event, newValue) => {
                  setProduct(newValue);
                  if (newValue) {
                    addProductToDetails(newValue);
                  }
                }}
                inputValue={searchInput}
                onInputChange={(_event, newInput, reason) => {
                  if (reason === 'input') {
                    setSearchInput(newInput);
                  } else if (reason === 'clear') {
                    setSearchInput('');
                    setProduct(null);
                  }
                }}
              onClose={(_event, reason) => {
              
                  setSearchInput('');  // reset khi mất focus
                  setProduct(null);
                
              }}
              renderInput={(params) => (
                <TextField {...params} label="Tìm sản phẩm..." placeholder="Tìm sản phẩm..." fullWidth />
              )}
            />
            </Grid>
          </Grid>

          {/* Product Details Table */}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            Order sản phẩm
          </Typography>
          {isSmallScreen ? <Stack spacing={2} sx={{ mt: 2 }}>
            {details.map((detail, index) => {
              const product = products.find((p: Product) => p.id === detail.productId);
              if (!product) return null;
        
              return (
                <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={1}>
                    <Grid size={{xs:12}}>
                      <Typography fontWeight="bold">
                        {index + 1}. {product.name}
                      </Typography>
                    </Grid>
        
                    {/* Price */}
                    <Grid size={{xs:12}} container alignItems={'center'} justifyContent={'space-between'}>
                      <Typography variant="body2" color="text.secondary">
                        Giá
                      </Typography>
                      <Controller
                        name={`orders.${index}.price`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            style={{ width: 120 }}
                            value={formatNumber(field.value)}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/,/g, '');
                              const numeric = Number(raw);
                              field.onChange(isNaN(numeric) ? 0 : numeric);
                            }}
                            error={!!errors.orders?.[index]?.price}
                            helperText={errors.orders?.[index]?.price?.message}
                          />
                        )}
                      />
                    </Grid>
        
                    {/* Quantity */}
                    <Grid size={{xs:12}} container alignItems={'center'} justifyContent={'space-between'}>
                      <Typography variant="body2" color="text.secondary">
                        Số lượng
                      </Typography>
                      <Controller
                        name={`orders.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            style={{ width: 120 }}
                            value={formatNumber(field.value)}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/,/g, '');
                              const numeric = Number(raw);
                              field.onChange(isNaN(numeric) ? 0 : numeric);
                            }}
                            error={!!errors.orders?.[index]?.quantity}
                            helperText={errors.orders?.[index]?.quantity?.message}
                          />
                        )}
                      />
                    </Grid>
        
                    <Grid size={{xs:6}}>
                      <Typography fontWeight="bold">Thành tiền:</Typography>
                    </Grid>
                    <Grid size={{xs:6}} textAlign="right">
                      <Typography fontWeight="bold">
                        {formatNumber(detail.price * detail.quantity)}
                      </Typography>
                    </Grid>
        
                    <Grid size={{xs:12}} textAlign="right" sx={{ mt: 1 }}>
                      <IconButton 
                        onClick={() => remove(index)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
        
            {/* Total */}
            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Grid container>
                <Grid size={{xs:6}}>
                  <Typography fontWeight="bold">Tổng tiền:</Typography>
                </Grid>
                <Grid size={{xs:6}} textAlign="right">
                  <Typography fontWeight="bold">
                    {formatNumber(amountOrder)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack> :
          <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell sx={{ width: '150px' }}>Giá</TableCell>
                    <TableCell sx={{ width: '150px' }}>Số lượng</TableCell>
                    <TableCell>Tiền</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.map((detail, index) => {
                    const product = products.find((p: Product) => p.id === detail.productId);
                    if (!product) return null;

                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        
                        {/* Price */}
                        <TableCell>
                          <Controller
                            name={`orders.${index}.price`}
                            control={control}
                            rules={{
                              required: 'Giá không hợp lệ',
                              validate: (value) => value > 0 || 'Giá phải lớn hơn 0',
                            }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                fullWidth
                                value={formatNumber(field.value)}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/,/g, '');
                                  const numeric = Number(raw);
                                  field.onChange(isNaN(numeric) ? 0 : numeric);
                                }}
                                error={!!errors.orders?.[index]?.price}
                                helperText={errors.orders?.[index]?.price?.message}
                              />
                            )}
                          />
                        </TableCell>

                        {/* Quantity */}
                        <TableCell>
                          <Controller
                            name={`orders.${index}.quantity`}
                            control={control}
                            rules={{
                              required: 'Số lượng không hợp lệ',
                              validate: (value) => value > 0 || 'Số lượng phải lớn hơn 0',
                            }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                fullWidth
                                value={formatNumber(field.value)}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/,/g, '');
                                  const numeric = Number(raw);
                                  field.onChange(isNaN(numeric) ? 0 : numeric);
                                }}
                                error={!!errors.orders?.[index]?.quantity}
                                helperText={errors.orders?.[index]?.quantity?.message}
                              />
                            )}
                          />
                        </TableCell>

                        <TableCell>{formatNumber(detail.price * detail.quantity)}</TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={() => remove(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <Typography fontWeight="bold">Tổng tiền</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">
                        {formatNumber(amountOrder)}
                      </Typography>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </TableContainer>}

          {/* Submit Button */}
          <Button variant="contained" color="primary" disabled={isPending || isSuccess} type="submit" sx={{ mt: 2, alignSelf: 'flex-end' }}>
            {title}
          </Button>
        </Box>
      </Box>
    
  );
};

export default FormTableSession;