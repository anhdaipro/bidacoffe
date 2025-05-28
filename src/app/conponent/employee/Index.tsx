// app/products/page.tsx
'use client';
import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import { useControlStore } from '../../store/useStore';
import { POSITION_LABELS, ROLES_EMPLOYEE, STATUS_ACTIVE, STATUS_INACTIVE, STATUS_LABELS } from '@/form/user';
import { formatDate, formatNumber } from '../../helper';
import { useAuthStore } from '../../store/useUserStore';
import { ROLE_ADMIN } from '@/backend/BidaConst';
import { usegetAllUsers } from '@/app/query/useUser';
import Search from './Search';
import { Customer, CustomerFormSearch, CustomerIndex } from '@/app/type/model/Customer';
import {
    Box,
    Button,
    Link as MuiLink,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Pagination,
    Stack,
  } from '@mui/material';
import { Employee, EmployeeFormSearch, EmployeeIndex } from '@/app/type/model/Employee';
import { usegetAllEmployee } from '@/app/query/useEmployee';
import dayjs from 'dayjs';
const Index = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // Số sản phẩm trên mỗi trang
    const [formData, setFormData] = useState<EmployeeFormSearch>({
        status:'',phone: '',dateFrom: '', dateTo:'',
        uidLogin:'',
    });
    const { data, isLoading } = usegetAllEmployee(currentPage, itemsPerPage,formData);
    console.log(data);
    const user = useAuthStore(state=>state.user)
    
    if (isLoading || !user) {
        return (
        <div className="loading-container">
            <svg
            className="loading-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            >
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#007bff"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="75"
                className="loading-circle"
            />
            </svg>
            <p className="loading-text">Đang tải dữ liệu...</p>
        </div>
        );
    }
    const aEmployee = data.data;
    const totalPages = data.pagination.totalPages;
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        }
    };
    
    const setFormSearch = (data:CustomerFormSearch)=>{
        setFormData(prev => ({ ...prev, ...data }));
    }
    return (
        <Box className="product-container" sx={{ p: { xs: 2, md: 4 } }}>
        <Search setFormSearch={setFormSearch} form={formData} />

        {user?.roleId === ROLE_ADMIN && (
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                    component={Link}
                    href="/employee/create"
                    variant="contained"
                    color="primary"
                    size="large"
                >
                Tạo mới
            </Button>
            </Box>
        )}

        <Typography variant="h5" gutterBottom fontWeight={600}>
            Danh sách nhân viên
        </Typography>

        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table size="small">
            <TableHead>
                <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên Nhân viên</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Chức vụ</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Sinh nhật</TableCell>
                <TableCell>Hành động</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {aEmployee.map((customer: EmployeeIndex, index: number) => (
                <TableRow key={customer.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{STATUS_LABELS[customer.status]}</TableCell>
                    <TableCell>{POSITION_LABELS[customer.roleId]}</TableCell>
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
                    <TableCell>{dayjs(customer.dateOfBirth).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                    <Stack spacing={1} direction="column">
                        {user.roleId === ROLE_ADMIN && (
                        
                            <Button component={Link} href={`/employee/update/${customer.id}`} variant="outlined" size="small">Chỉnh sửa</Button>
                            
                        )}
                        {/* <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(customer.id)}>Xóa</Button> */}
                    </Stack>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>

        {/* Phân trang */}
        <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => handlePageChange(page)}
            color="primary"
            />
        </Box>
    </Box>
    );
};

export default Index;
