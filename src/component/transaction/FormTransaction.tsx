'use client';
import { formatNumber, normalizeString } from '@/app/helper';
import { useProductsSearch } from '@/app/query/useProducts';
import { TRANSACTION_TYPE_LABELS } from '@/form/transaction';
import React, { useState, useEffect, memo } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Autocomplete, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  IconButton,
  Paper,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Link as MuiLink,
  Alert,
  FormHelperText,
  useTheme,
  useMediaQuery,
  Stack,
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useForm, SubmitHandler, useFieldArray, Controller } from 'react-hook-form';
import { useCreateTransaction, useUpdateTransaction } from '@/app/query/useTransaction';
import { useControlStore } from '@/app/store/useStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToastStore } from '../../app/store/toastStore';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import { Transaction, TransactionDetailForm, TransactionForm } from '@/app/type/model/Transaction';
import { Product } from '@/app/type/model/Product';
import { RequiredLable } from '../Icon';

interface Props {
  transaction: TransactionForm;
}

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.mode === 'light' ? '#ccc' : '#555'}`,
  borderRadius: theme.shape.borderRadius,
  '&:focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
  },
}));

const FormProductTransaction: React.FC<Props> = ({ transaction }) => {
  const { data: products, isLoading } = useProductsSearch();
  const [productSearch, setProductSearch] = useState('');
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    control, 
    setValue, 
    watch 
  } = useForm<TransactionForm>({
    values: {
      ...transaction
    }
  });
  const [product, setProduct] = React.useState<Product | null>(null);

  const { mutate: addTransaction, isPending: isPendingCreate, isSuccess: 
 isSuccessCreate} = useCreateTransaction();
  const { mutate: updateTransaction, isPending: isPendingUpdate, isSuccess: 
 isSuccessUpdate} = useUpdateTransaction();
  const router = useRouter();
  const isPending = isPendingCreate || isPendingUpdate
  const isSuccess = isSuccessCreate || isSuccessUpdate
  const addToast = useToastStore(state => state.addToast);
  const [searchInput, setSearchInput] = useState('');
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'details',
  });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const details = watch('details');
  const type = watch('type');
  const dateDelivery = watch('dateDelivery');

  const handleDetailChange = (index: number, field: keyof TransactionDetailForm, value: any) => {
    const newDetails = [...details];
    newDetails[index][field] = Number(value);
    setValue('details', newDetails);
  };

  const addProductToDetails = (product: Product) => {
    const exists = details.find(d => d.productId === product.id);
    if (exists) {
      addToast({
        id: uuidv4(),
        message: 'Sản phẩm này đã thêm rồi!',
        type: 'warning',
      });
      return;
    }

    append({
      productId: product.id,
      categoryId: product.categoryId,
      quantity: 1,
      price: 0,
    });
    setProductSearch('');
  };

  const removeDetail = (index: number) => {
    remove(index);
  };

  const totalAmount = details.reduce((acc, detail) => {
    return acc + (detail.price * detail.quantity);
  }, 0);

  const sendData = async (data: TransactionForm) => {
    const payload = {
      ...data,
      totalAmount: totalAmount,
    };
    handleRequest(payload);
  };

  const handleRequest = (payload: TransactionForm) => {
    if (transaction.id) {
      const id = transaction.id;
      updateTransaction({ id, payload }, {
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
          });
        },
      });
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
          });
        },
      });
    }
  };

  const title = transaction.id ? 'Cập nhật' : 'Tạo mới';

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" ml={2}>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <MuiLink 
          component={Link} 
          href="/transaction" 
          sx={{ 
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold',
            px: 3,
            py: 1,
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'white',
            }
          }}
        >
          Danh sách giao dịch
        </MuiLink>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" textAlign="center" mb={4}>
          {title} giao dịch sản phẩm
        </Typography>

        <Grid container spacing={3} component="form">
          <Grid size={{xs:12, md:6}}>
            <FormControl fullWidth error={!!errors.type} >
              <InputLabel id="transaction-type-label">Loại giao dịch <RequiredLable required /></InputLabel>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Loại giao dịch không để trống',
                  validate: (value) => Number(value) > 0 || 'Loại giao dịch không để trống',
                 }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={type}
                    labelId="transaction-type-label"
                    label="Loại giao dịch *"
                    error={!!errors.type}
                    renderValue={(selected:any) =>
                      selected == 0 ? (
                        <span style={{ color: errors.type ? 'red' : 'inherit' }}>Loại giao dịch</span>
                      ) : (
                        TRANSACTION_TYPE_LABELS[selected]
                      )
                    }
                  >
                    <MenuItem value="0">Loại giao dịch</MenuItem>
                    {Object.entries(TRANSACTION_TYPE_LABELS).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.type?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <FormControl fullWidth>
              <Box>
                <Controller
                  name="dateDelivery"
                  control={control}
                  rules={{required:'Ngày giao dịch không để trống'}}
                  render={({ field, fieldState: { error }}) => (
                    <DatePicker
                    className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-fullWidth"
                    value={dateDelivery ? dayjs(dateDelivery) : null}
                    onChange={(date) => {
                      setValue('dateDelivery', dayjs(date).format('YYYY-MM-DD'))
                    }}
                    maxDate={dayjs().add(40, 'day')}
                    minDate={dayjs().add(-10, 'day')}
                    
                    label={
                      <span>
                        Ngày giao dịch <RequiredLable required />
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

          <Grid size={{xs:12}}>
            <Typography variant="subtitle1" gutterBottom>
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

          <Grid size={{xs:12}}>
            {isSmallScreen ?
            <Stack spacing={2} sx={{ mt: 2 }}>
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
                        name={`details.${index}.price`}
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
                            error={!!errors.details?.[index]?.price}
                            helperText={errors.details?.[index]?.price?.message}
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
                        name={`details.${index}.quantity`}
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
                            error={!!errors.details?.[index]?.quantity}
                            helperText={errors.details?.[index]?.quantity?.message}
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
                        onClick={() => removeDetail(index)}
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
                    {formatNumber(totalAmount)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>:
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
                        name={`details.${index}.price`}
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
                            error={!!errors.details?.[index]?.price}
                            helperText={errors.details?.[index]?.price?.message}
                          />
                        )}
                      />
                    </TableCell>

                    {/* Quantity */}
                    <TableCell>
                      <Controller
                        name={`details.${index}.quantity`}
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
                            error={!!errors.details?.[index]?.quantity}
                            helperText={errors.details?.[index]?.quantity?.message}
                          />
                        )}
                      />
                    </TableCell>

                    <TableCell>{formatNumber(detail.price * detail.quantity)}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => removeDetail(index)}
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
                    {formatNumber(totalAmount)}
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
            }
            
          </Grid>

          <Grid size={{xs:12}}>
            <Button 
              disabled={isPending || isSuccess}
              variant="contained" 
              size="large" 
              fullWidth
              onClick={handleSubmit(sendData)}
              sx={{
    ...(isPending && {
      cursor: 'not-allowed',
    }),
  }}
            >
              {title}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default memo(FormProductTransaction);