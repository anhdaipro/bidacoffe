'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useProducts, useUpdateStatusProduct } from '../../query/useProducts';
import { useControlStore } from '../../store/useStore';
import { CATEGORY_LABELS, STATUS_ACTIVE, STATUS_INACTIVE, STATUS_LABEL } from '@/form/product';
import { formatDate, formatNumber } from '../../helper';
import { useAuthStore } from '../../store/useUserStore';
import { ROLE_ADMIN } from '@/backend/BidaConst';

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Stack,
} from '@mui/material';

import Search from './Search';
import { ProductFormSearch } from '@/app/type/model/Product';

interface Product {
  id: number;
  name: string;
  price: number;
  status: number;
  image: string;
  categoryId: number;
  canUpdate: boolean;
  canDelete: boolean;
  createdAt: string;
  rUidLogin: { name: string };
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [formData, setFormData] = useState<ProductFormSearch>({
    status: '',
    categoryId: '',
    name: '',
    dateFrom: '',
    dateTo: '',
    uidLogin:'',
  });
  const { data, isLoading } = useProducts(currentPage, itemsPerPage, formData);
  const updateStore = useControlStore((state) => state.updateStore);
  const user = useAuthStore((state) => state.user);
  const { mutate: updateStatus } = useUpdateStatusProduct();

  if (isLoading || !user) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h6" color="primary">
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  const products = data.data;
  const totalPages = data.pagination.totalPages;

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: number) => {
    updateStore({
      isVisible: true,
      action: 'delete-product',
      id,
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
    });
  };

  const handleUpdate = (id: number, statusCurrent: number) => {
    const status = statusCurrent === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE;
    updateStatus({ id, status });
  };

  const setFormSearch = (data: ProductFormSearch) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <Box sx={{ backgroundColor: '#fff', p: 2, maxWidth:1200,mx:'auto' }}>
      {/* Search form */}
      <Box sx={{ marginBottom: 3 }}>
        <Search setFormSearch={setFormSearch} form={formData} />
      </Box>

      {/* Button Tạo mới */}
      {user?.roleId === ROLE_ADMIN && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <Button
            component={Link}
            href="/products/create"
            variant="contained"
            color="primary"
            size="large"
          >
            Tạo mới
          </Button>
        </Box>
      )}

      <Typography variant="h5" gutterBottom>
        Danh sách sản phẩm
      </Typography>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell align="right">Giá</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hình</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product: Product, index: number) => (
              <TableRow key={product.id}>
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{CATEGORY_LABELS[product.categoryId]}</TableCell>
                <TableCell align="right">{formatNumber(product.price)}</TableCell>
                <TableCell>{STATUS_LABEL[product.status]}</TableCell>
                <TableCell>
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell>
                  {formatDate(product.createdAt)}
                  <br />
                  {product.rUidLogin?.name}
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    {user.roleId === ROLE_ADMIN && (
                      <Button
                        component={Link}
                        href={`/products/update/${product.id}`}
                        variant="outlined"
                        size="small"
                      >
                        Chỉnh sửa
                      </Button>
                    )}
                    {user.roleId === ROLE_ADMIN && (
                      // Bạn có thể thêm confirm dialog cho nút này nếu cần
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleUpdate(product.id, product.status)}
                      >
                        Cập nhật trạng thái
                      </Button>
                    )}
                    {/* Nếu cần nút Xóa, bật lại phần này */}
                    {/* {user.roleId === ROLE_ADMIN && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(product.id)}
                      >
                        Xóa
                      </Button>
                    )} */}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 3,
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default Index;
