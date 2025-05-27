import React, { useState, useTransition } from 'react';
import { useTableStore } from '@/app/store/useTableStore';
import { useProductsSearch } from '@/app/query/useProducts';
import { formatNumber, normalizeString } from '@/app/helper';
import { useOrderTableSession } from '@/app/query/useTableSession';
import { useToastStore } from '@/app/store/toastStore';
import { v4 as uuidv4 } from 'uuid';
import { OrderDetail, OrderForm, TableSession } from '@/app/type/model/TableSession';
import { Table } from '@/app/type/model/Table';
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
import { Product } from '@/app/type/model/Product';
interface OrderTabProps {
  selectedSession?: TableSession;
  tableSessions: TableSession[];
  selectedTable: Table;
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 400,
}));

const StickyHeaderCell = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1,
  fontWeight: 'bold'
}));

const QuantityInputContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
});

const OrderTab: React.FC<OrderTabProps> = ({ selectedSession, tableSessions, selectedTable }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { data: menu, isLoading } = useProductsSearch();
  const [productSearch, setProductSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const { mutate: orderProduct } = useOrderTableSession();
  const addToast = useToastStore(state => state.addToast);
  const setTableSession = useTableStore(state => state.setTableSession);
  
  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm<OrderForm>({
    values: {
      orders: selectedSession?.orders || [],
    }
  });
  
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'orders',
  });
  
  const orders = watch('orders');

  if (isLoading || !selectedSession) {
    return null;
  }

  const addProductToDetails = (product: Product) => {
    const exists = orders.find(d => d.productId === product.id);
    if (exists) {
      addToast({
        id: uuidv4(),
        message: 'Sản phẩm đã được thêm vào đơn hàng',
        type: 'warning',
      });
      return;
    }
    
    append({
      productId: product.id,
      categoryId: product.categoryId,
      quantity: 1,
      price: product.price,
    });
    
    setProductSearch('');
  };

  const removeDetail = (index: number) => {
    remove(index);
  };

  const totalAmount = orders.reduce((acc, detail) => {
    return acc + (detail.price * detail.quantity);
  }, 0);

  const filteredProducts = menu.filter((p: Product) =>
    normalizeString(p.name).includes(normalizeString(productSearch))
  );

  const handleOrder = () => {
    const payload = orders;
    orderProduct({ id: selectedSession.id, payload }, {
      onSuccess: (data) => {
        addToast({
          id: uuidv4(),
          message: 'Thêm món thành công',
          type: 'success',
        });
        const tableSessionsUpdate = tableSessions.map(item => {
          if (item.id == selectedSession.id) {
            return { ...item, orders: data };
          }
          return { ...item };
        });
        setTableSession(tableSessionsUpdate);
      },
      onError: (error: any) => {

        addToast({
          id: uuidv4(),
          message: error.response.data.message,
          type: 'error',
        });
      },
    });
  };

  const headers = ['STT', 'Tên món', 'Đơn giá', 'Số lượng', 'Thành tiền', 'Thao tác'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Autocomplete
        freeSolo
        options={filteredProducts}
        getOptionLabel={(option) => (option as Product).name || ''}
        inputValue={productSearch}
        onInputChange={(_, newValue) => setProductSearch(newValue)}
        onChange={(_, newValue) => {
          if (newValue && typeof newValue !== 'string') {
            addProductToDetails(newValue as Product);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tìm sản phẩm"
            variant="outlined"
            fullWidth
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={(option as Product).id}>
            {(option as Product).name}
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
            {orders.map((detail, index) => {
              const product = menu.find((p: Product) => p.id === detail.productId);
              if (!product) return null;

              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{formatNumber(product.price)}</TableCell>
                  <TableCell>
                    <Controller
                      name={`orders.${index}.quantity`}
                      control={control}
                      rules={{
                        required: 'Số lượng không hợp lệ',
                        validate: (value) => value > 0 || 'Số lượng phải lớn hơn 0',
                      }}
                      render={({ field: { onChange, value } }) => (
                        <QuantityInputContainer>
                          <IconButton
                            size="small"
                            onClick={() => onChange(Math.max(1, value - 1))}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            size="small"
                            value={value}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/,/g, '');
                              const numeric = Number(raw);
                              onChange(isNaN(numeric) ? 0 : numeric);
                            }}
                            error={!!errors.orders?.[index]?.quantity}
                            helperText={errors.orders?.[index]?.quantity?.message}
                            sx={{ width: '60px' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => onChange(Math.min(100, value + 1))}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </QuantityInputContainer>
                      )}
                    />
                  </TableCell>
                  <TableCell>{formatNumber(detail.price * detail.quantity)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => removeDetail(index)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>Tổng tiền</TableCell>
              <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                {formatNumber(totalAmount)}
              </TableCell>
            </TableRow>
          </TableBody>
        </MuiTable>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit(handleOrder)}
        sx={{ alignSelf: 'flex-end', mt: 2 }}
        size={isSmallScreen ? 'small' : 'medium'}
      >
        Xác nhận
      </Button>
    </Box>
  );
};

export default OrderTab;