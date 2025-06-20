// app/products/page.tsx
'use client';
import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import { POSITION_LABELS,STATUS_LABELS } from '@/form/user';
import { formatDate, formatNumber } from '../../app/helper';
import { useAuthStore } from '../../app/store/useUserStore';
import { ROLE_ADMIN } from '@/backend/BidaConst';
import Search from './Search';
import {CustomerFormSearch } from '@/app/type/model/Customer';
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
    Grid,
    Stack,
    useTheme,
    useMediaQuery,
  } from '@mui/material';
import { Employee, EmployeeFormSearch, EmployeeIndex } from '@/app/type/model/Employee';
import { usegetAllEmployee } from '@/app/query/useEmployee';
import dayjs from 'dayjs';
import { useGetTimeSheets } from '@/app/query/useTimesheet';
import { TimeSheet, TimeSheetForm, TimeSheetFormSearch, TimeSheetIndex } from '@/app/type/model/TimeSheet';
import { usegetAllShift } from '@/app/query/useShift';
import { Shift } from '@/app/type/model/Shift';
const Index = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // Số sản phẩm trên mỗi trang
    const [formData, setFormData] = useState<TimeSheetFormSearch>({
        status:'',shiftId: '',dateFrom: '', dateTo:'',employeeId:''
        
    });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const { data, isLoading } = useGetTimeSheets(currentPage, itemsPerPage,formData);
    const {data:shifts, isLoading:isLoadingShift} = usegetAllShift()
    const user = useAuthStore(state=>state.user)
    
    if (isLoading || !user || isLoadingShift) {
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
    const aTimeSheet = data.data;
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
        <Search />

       
            <Box display="flex" justifyContent="space-between" alignItems={'center'} my={2}>
                <Typography variant="h2" gutterBottom>
                    Danh sách chấm công
                </Typography>
                {user?.roleId === ROLE_ADMIN && (
                <Button
                    component={Link}
                    href="/timesheet/create"
                    variant="contained"
                    color="primary"
                    size="large"
                >
                Tạo mới
            </Button>)}
            </Box>
        
        {isMobile ?
        <Grid container spacing={2}>
            {aTimeSheet.map((timesheet: TimeSheetIndex, index: number) => {
                const shift = shifts.find((item:Shift) => item.id == timesheet.shiftId)
                const nameShift = shift ? `${shift.name} ${shift.startTime} - ${shift.endTime}` : ''
                return (
                <Grid size={{xs:12, sm:6, md:6,lg:4}} key={timesheet.id}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Stack spacing={1}>
                    <Typography variant="subtitle2">STT: {index + 1}</Typography>
                    <Typography variant="subtitle2">Tên nhân viên: {timesheet?.rEmployee.name}</Typography>
                    <Typography variant="subtitle2">Chức vụ: {timesheet.rEmployee ? POSITION_LABELS[timesheet.rEmployee.roleId] : ''}</Typography>
                    <Typography variant="subtitle2">Checkin: {dayjs(timesheet.checkInTime).format('DD/MM/YYYY HH:ii')}</Typography>
                    <Typography variant="subtitle2">Checkout: {dayjs(timesheet.checkOutTime).format('DD/MM/YYYY HH:ii')}</Typography>
                    <Typography variant="subtitle2">Ca làm: {nameShift}</Typography>
                    <Typography variant="subtitle2">Số giờ làm thực tế: {timesheet.actualHours}</Typography>
                    <Typography variant="subtitle2">Ngày làm: {timesheet.date}</Typography>
                    
                    {user.roleId === ROLE_ADMIN && (
                        <Box mt={1}>
                        <Button
                            component={Link}
                            href={`/employee/update/${timesheet.id}`}
                            variant="outlined"
                            size="small"
                        >
                            Chỉnh sửa
                        </Button>
                        </Box>
                    )}
                    </Stack>
                </Paper>
                </Grid>
            )})
            }
        </Grid>
        :
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small">
        <TableHead>
            <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Tên Nhân viên</TableCell>
            <TableCell>Chức vụ</TableCell>
            <TableCell>Check in</TableCell>
            <TableCell>Check out</TableCell>
            <TableCell>Ca làm việc</TableCell>
            <TableCell>Số giờ làm thức tế</TableCell>
            <TableCell>Ngày làm việc</TableCell>
            <TableCell>Hành động</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {aTimeSheet.map((timesheet: TimeSheetIndex, index: number) => {
                const shift = shifts.find((item:Shift) => item.id == timesheet.shiftId)
                const nameShift = shift ? `${shift.name} ${shift.startTime} - ${shift.endTime}` : ''
                return (
                <TableRow key={timesheet.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{timesheet?.rEmployee.name}</TableCell>
                    <TableCell>{timesheet.rEmployee ? POSITION_LABELS[timesheet.rEmployee.roleId] : ''}</TableCell>
                    <TableCell>{dayjs(timesheet.checkInTime).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell>{dayjs(timesheet.checkOutTime).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell>{nameShift}</TableCell>
                    <TableCell>{timesheet.actualHours}</TableCell>
                    <TableCell>{dayjs(timesheet.date).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                    <Stack spacing={1} direction="column">
                        {user.roleId === ROLE_ADMIN && (
                        
                            <Button component={Link} href={`/employee/update/${timesheet.id}`} variant="outlined" size="small">Chỉnh sửa</Button>
                            
                        )}
                        {/* <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(customer.id)}>Xóa</Button> */}
                    </Stack>
                    </TableCell>
                </TableRow>
            )})}
        </TableBody>
        </Table>
        </TableContainer>
        }
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
