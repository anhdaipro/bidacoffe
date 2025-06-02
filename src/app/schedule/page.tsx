"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  useMediaQuery,
  Stack,
  useTheme,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShiftManagement from "../conponent/shift/ShiftManagement";
const sampleShifts = [
  { id: 1, name: "Ca sáng", start: "08:00", end: "12:00" },
  { id: 2, name: "Ca chiều", start: "13:00", end: "17:00" },
  { id: 3, name: "Ca tối", start: "18:00", end: "22:00" },
];

const sampleEmployees = [
  { id: 1, name: "Nguyễn Văn A", phone: "0912345678", shiftId: 1, status: "Đang làm" },
  { id: 2, name: "Trần Thị B", phone: "0987654321", shiftId: 2, status: "Nghỉ" },
  { id: 3, name: "Lê Văn C", phone: "0901234567", shiftId: 3, status: "Đang làm" },
  { id: 4, name: "Phạm Thị D", phone: "0978123456", shiftId: 1, status: "Đang làm" },
];

function App() {
  return <ShiftManagement/>
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Tính số nhân viên theo ca
  const countEmployeesInShift = (shiftId:number) =>
    sampleEmployees.filter((e) => e.shiftId === shiftId && e.status === "Đang làm").length;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Quản Lý Ca & Nhân Viên Quán Bida</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        <Grid container spacing={3} direction={isSmallScreen ? "column" : "row"}>
          {/* Quản lý ca */}
          <Grid size={{xs:12, md:12,lg:12,xl:5}}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" mb={2}>
                Quản lý Ca
              </Typography>
              <TableContainer>
                <Table size="small" aria-label="shifts table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên ca</TableCell>
                      <TableCell>Giờ bắt đầu</TableCell>
                      <TableCell>Giờ kết thúc</TableCell>
                      <TableCell align="right">Số NV đang làm</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sampleShifts.map((shift) => (
                      <TableRow key={shift.id}>
                        <TableCell>{shift.name}</TableCell>
                        <TableCell>{shift.start}</TableCell>
                        <TableCell>{shift.end}</TableCell>
                        <TableCell align="right">{countEmployeesInShift(shift.id)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box mt={2}>
                <Button variant="contained" size="small">
                  Thêm ca mới
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Quản lý nhân viên */}
          <Grid  size={{xs:12, md:12, lg:12,xl:7}}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" mb={2}>
                Danh sách Nhân viên
              </Typography>
              <TableContainer>
                <Table size="small" aria-label="employees table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên</TableCell>
                      <TableCell>Số điện thoại</TableCell>
                      <TableCell>Ca làm</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sampleEmployees.map((emp) => {
                      const shift = sampleShifts.find((s) => s.id === emp.shiftId);
                      return (
                        <TableRow key={emp.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
  <TableCell>
    <Typography variant="body2" noWrap>
      {emp.name}
    </Typography>
  </TableCell>
  
  <TableCell>
    <Typography variant="body2" noWrap>
      {emp.phone}
    </Typography>
  </TableCell>
  
  <TableCell>
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      minWidth: { xs: 100, sm: 120 }
    }}>
      {shift ? (
        <Chip 
          label={shift.name} 
          size="small" 
          color="primary"
          sx={{ maxWidth: 120 }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Chưa phân ca
        </Typography>
      )}
    </Box>
  </TableCell>
  
  <TableCell>
    <Chip 
      label={emp.status} 
      size="small" 
      color={
        emp.status === 'Active' ? 'success' : 
        emp.status === 'Inactive' ? 'error' : 'default'
      }
    />
  </TableCell>
  
  <TableCell align="right">
    <Box sx={{ 
      display: 'flex',
      justifyContent: { xs: 'flex-start', sm: 'flex-end' },
      gap: 1,
      flexWrap: 'wrap'
    }}>
      <Tooltip title="Sửa">
        <IconButton size="small" color="primary">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Xóa">
        <IconButton size="small" color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  </TableCell>
</TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box mt={2}>
                <Button variant="contained" size="small">
                  Thêm nhân viên
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
       
      </Container>
    </>
  );
}

export default App;
