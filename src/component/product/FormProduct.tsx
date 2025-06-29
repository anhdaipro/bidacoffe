'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCreateProduct, useUpdateProduct } from '@/app/query/useProducts';
import { CATEGORY_LABELS, maxSizeBytes, maxSizeMB, STATUS_LABEL } from '@/form/product';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { formatNumber, uploadImageToCloudinary } from '../../app/helper';
import { useToastStore } from '../../app/store/toastStore';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Stack,
  IconButton,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import { Product, ProductForm } from '@/app/type/model/Product';
import { RequiredLable } from '../Icon';

interface Props {
  product: Product;
}

const Form: React.FC<Props> = ({ product }) => {
  const { mutate: addProduct, error: errorCreate, isPending: isPendingCreate, isSuccess: isSuccessCreate } = useCreateProduct();
  const { mutate: updateProduct, error: errorUpdate, isPending: isPendingUpdate, isSuccess: isSuccessUpdate} = useUpdateProduct();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductForm>({
    values: { ...product },
  });

  const [showPending, setShowPending] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  useEffect(() => {
    if (product.image) {
      setPreview(product.image);
    }
    console.log('product', product);
  },[product.image])
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > maxSizeBytes) {
        addToast({
          id: uuidv4(),
          message: `File quá lớn! Dung lượng tối đa là ${maxSizeMB}MB.`,
          type: 'error',
        });
        return;
      }
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const sendData: SubmitHandler<ProductForm> = async (data) => {
    const payload = {
      ...data
    }
    if (image){
      const {public_id, secure_url} = await uploadImageToCloudinary(image, 'product')
      Object.assign(payload,{image:secure_url, public_image:public_id})
    };
    handleRequest(payload);
  };

  const handleRequest = (payload: ProductForm) => {
    if (product.id) {
      const id = product.id;
      updateProduct(
        { id, payload },
        {
          onSuccess: () => {
            addToast({
              id: uuidv4(),
              message: 'Cập nhật thành công',
              type: 'success',
            });
            router.push('/products');
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
      addProduct(payload, {
        onSuccess: () => {
          addToast({
            id: uuidv4(),
            message: 'Thêm mới thành công',
            type: 'success',
          });
          router.push('/products');
        },
        onError: (error: any) => {
          alert(`Error: ${error.message}`);
        },
      });
    }
  };

  const handleDeleteFile = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = value ? formatNumber(Number(value)) : '';
    setValue('price', value ? Number(value) : 0);
  };

  // useEffect(() => {
  //   let timeout: ReturnType<typeof setTimeout> | undefined;

  //   if (isPendingCreate || isPendingUpdate) {
  //     timeout = setTimeout(() => {
  //       setShowPending(true);
  //     }, 300);
  //   } else {
  //     if (timeout) clearTimeout(timeout);
  //     setShowPending(false);
  //   }

  //   return () => clearTimeout(timeout);
  // }, [isPendingCreate, isPendingUpdate]);
  const isPending = isPendingCreate || isPendingUpdate
  const isSuccess = isSuccessCreate || isSuccessUpdate
  const price = watch('price');
  const title = product.id ? 'Cập nhật' : 'Tạo mới';

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box mb={2}>
        
          <Button variant="outlined" size="small" component={Link} href="/products">
            Danh sách
          </Button>
        
      </Box>
      <Typography variant="h5" component="h1" gutterBottom>
        {title} sản phẩm
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(sendData)}>
        {/* Name */}
        <TextField
          label={
            <span>
              Tên sản phẩm <RequiredLable required />
            </span>
          }
          fullWidth
          margin="normal"
          {...register('name', {
            required: 'Tên không để trống',
            minLength: { value: 5, message: 'Tên tối thiểu 5 ký tự' },
            maxLength: { value: 50, message: 'Tên tối đa 50 ký tự' },
            setValueAs: (value) => value.trim(),
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        {/* Price */}
        <TextField
          label={
            <span>
              Giá sản phẩm <RequiredLable required />
            </span>
          }
          fullWidth
          margin="normal"
          value={formatNumber(price)}
          {...register('price', {
            required: 'Giá không hợp lệ',
            setValueAs: (value) => {
              return value ? Number(String(value).replace(/,/g, '')) : 0;
            },
            validate: (value) => value > 0 || 'Giá phải lớn hơn 0',
          })}
          onChange={handlePriceChange}
          error={!!errors.price}
          helperText={errors.price?.message}
        />

        {/* Category */}
        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.categoryId}
        >
          <InputLabel id="category-label">Loại sản phẩm <RequiredLable required/></InputLabel>
          <Select
            labelId="category-label"
            label={'Loại sản phẩm'
            }
            defaultValue={product.categoryId}
            {...register('categoryId', { required: 'Vui lòng chọn loại sản phẩm',
              validate: (value) => (Number(value) > 0 ? true : 'Vui lòng chọn loại sản phẩm'),
             })}
            onChange={(e) => setValue('categoryId', e.target.value)}
          >
            <MenuItem value="0">
              Chọn loại
            </MenuItem>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.categoryId?.message}</FormHelperText>
        </FormControl>

        {/* Status */}
        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.status}
          
        >
          <InputLabel>Trạng thái <RequiredLable required/></InputLabel>
          <Select
            labelId="status-label"
            label={'Trạng thái'}
            defaultValue={product.status || ''}
            {...register('status', { required: 'Vui lòng chọn trạng thái',
              validate: (value) => (Number(value) > 0 ? true : 'Vui lòng chọn trạng thái'),
            })}
            onChange={(e) => setValue('status', Number(e.target.value))}
          >
            <MenuItem value="0">
              <em>Chọn trạng thái</em>
            </MenuItem>
            {Object.entries(STATUS_LABEL).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.status?.message}</FormHelperText>
        </FormControl>

        {/* Image upload */}
        <Box mt={2} mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            Hình ảnh sản phẩm
          </Typography>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button variant="contained" onClick={() => fileInputRef.current?.click()}>
            Chọn file
          </Button>

          {preview && (
            <Box mt={2} display="flex" alignItems="center" gap={2}>
              <Box
                component="img"
                src={preview}
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
                onClick={handleDeleteFile}
                aria-label="Xóa file"
                size="large"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Stack direction="row" justifyContent="flex-end" mt={3}>
          <Button variant="contained" disabled={isPending || isSuccess} type="submit">
            {title}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Form;
