'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  Container,
  Box,
  Divider,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import TableChartIcon from '@mui/icons-material/TableChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useReportRevenueWeek } from '../query/useReport';
import { calHourPlay, formatNumber } from '../helper';
import { DashBoard } from '../type/report';

const drawerWidth = 240;

const sidebarItems = [
  { text: 'Trang chủ', icon: <SportsEsportsIcon /> },
  { text: 'Bàn chơi', icon: <TableChartIcon /> },
  { text: 'Hóa đơn', icon: <ReceiptIcon /> },
  { text: 'Doanh thu', icon: <MonetizationOnIcon /> },
];

// Ví dụ dữ liệu tĩnh (thay bằng API thật)
const dashboardStats = {
  tablesPlaying: 12,
  totalTables: 30,
  billsToday: 25,
  revenueToday: 10500000,
};

const tablesPlayingData = [
  { id: 1, name: 'Bàn 1', status: 'Đang chơi', playingTime: '00:45', players: 'A, B' },
  { id: 2, name: 'Bàn 3', status: 'Đang chơi', playingTime: '01:20', players: 'C' },
  { id: 3, name: 'Bàn 7', status: 'Đang chơi', playingTime: '00:10', players: 'D, E' },
];

// Dữ liệu biểu đồ doanh thu 7 ngày
const revenueData = [
  { date: '15/05', revenue: 1500000 },
  { date: '16/05', revenue: 2000000 },
  { date: '17/05', revenue: 1000000 },
  { date: '18/05', revenue: 2500000 },
  { date: '19/05', revenue: 3000000 },
  { date: '20/05', revenue: 2800000 },
  { date: '21/05', revenue: 3500000 },
];

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const {data,isLoading} = useReportRevenueWeek() as {
    data:DashBoard; 
    isLoading:boolean;
  }
  if (isLoading) {
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
  const {weekData, countTable, countInvoice, aTablePlaying,todayRevenue} = data
  const countTablePlaying = aTablePlaying.length
  // const drawer = (
  //   <div>
  //     <Toolbar>
  //       <Typography variant="h6" noWrap component="div">
  //         Bida Management
  //       </Typography>
  //     </Toolbar>
  //     <Divider />
  //     <List>
  //       {sidebarItems.map(({ text, icon }) => (
  //         <ListItem  key={text}>
  //           <ListItemIcon>{icon}</ListItemIcon>
  //           <ListItemText primary={text} />
  //         </ListItem>
  //       ))}
  //     </List>
  //   </div>
  // );

  // Hàm format tiền Việt
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <Container maxWidth="md"
    sx={{
      mt: 4,
      mb: 4,
      bgcolor: '#fff',
      p: 3,
      borderRadius: 2,
      
      fontFamily: 'Arial, sans-serif',
    }}>
     
      {/* AppBar */}
      
      
          <Typography variant="h2" noWrap component="div">
            Dashboard
          </Typography>
        
     

      {/* Drawer */}
      

      {/* Main content */}
      <Box
        component="main"
        sx={{
          
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 2,
        }}
      >
        {/* Tổng quan */}
        <Grid container spacing={3} mb={4}>
  {/* Số bàn đang chơi */}
  <Grid size={{xs:12, sm:6, md:4}}>
    <Paper 
      sx={{ 
        p: 2, 
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }} 
      elevation={4}
    >
      <SportsEsportsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
      <Typography variant="subtitle1" gutterBottom>
        Bàn đang chơi
      </Typography>
      <Typography variant="h4" color="secondary" fontWeight="bold">
        {countTablePlaying}
      </Typography>
    </Paper>
  </Grid>

  {/* Tổng số bàn */}
  <Grid size={{xs:12, sm:6, md:4}}>
    <Paper 
      sx={{ 
        p: 2, 
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }} 
      elevation={4}
    >
      <TableChartIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
      <Typography variant="subtitle1" gutterBottom>
        Tổng số bàn
      </Typography>
      <Typography variant="h4" color="secondary" fontWeight="bold">
        {countTable}
      </Typography>
    </Paper>
  </Grid>

  {/* Hóa đơn hôm nay */}
  <Grid size={{xs:12, sm:6, md:4}}>
    <Paper 
      sx={{ 
        p: 2, 
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }} 
      elevation={4}
    >
      <ReceiptIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
      <Typography variant="subtitle1" gutterBottom>
        Hóa đơn hôm nay
      </Typography>
      <Typography variant="h4" color="secondary" fontWeight="bold">
        {countInvoice}
      </Typography>
    </Paper>
  </Grid>

  {/* Doanh thu hôm nay */}
  <Grid size={{xs:12, sm:6, md:4}}>
    <Paper 
      sx={{ 
        p: 2, 
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }} 
      elevation={4}
    >
      <MonetizationOnIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
      <Typography variant="subtitle1" gutterBottom>
        Doanh thu hôm nay
      </Typography>
      <Typography variant="h4" color="secondary" fontWeight="bold">
        {formatNumber(todayRevenue)}
      </Typography>
    </Paper>
  </Grid>
</Grid>

        {/* Bảng bàn đang chơi */}
        <Typography variant="h6" mb={2}>
          Danh sách bàn đang chơi
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bàn</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thời gian chơi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aTablePlaying.map(({ id, tableNumber, status, playedMinutes }) => (
                <TableRow key={id}>
                  <TableCell>Bàn {tableNumber}</TableCell>
                  <TableCell>Đang chơi</TableCell>
                  <TableCell>{calHourPlay(playedMinutes)}</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Biểu đồ doanh thu */}
        <Typography variant="h6" mb={2}>
          Biểu đồ doanh thu 7 ngày qua
        </Typography>
        <Paper sx={{ p: 2, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(value) =>
                  value >= 1000000 ? `${value / 1000000}M` : value.toLocaleString()
                }
              />
              <Tooltip
                formatter={(value: number) => [formatNumber(value), 'Doanh thu']}
                labelFormatter={(label) => `Ngày ${label}`}
              />
              <Line type="monotone" dataKey="revenue" stroke="#1976d2" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Container>
  );
}
