'use client';
import * as React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import DashboardIcon from '@mui/icons-material/Dashboard';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GroupIcon from '@mui/icons-material/Group';
import PunchClockIcon from '@mui/icons-material/PunchClock';
const drawerWidth = 200;

const menus = [
  { title: 'Quản lý bàn', url: '/table', icon: <TableRestaurantIcon /> },
  { title: 'Setup bàn', url: '/billiardTable', icon: <SettingsIcon /> },
  { title: 'Sản phẩm', url: '/products', icon: <InventoryIcon /> },
  { title: 'Phiên chơi', url: '/tableSession', icon: <ReceiptIcon /> },
  { title: 'Nhân viên', url: '/employee', icon: <PeopleIcon /> },
  { title: 'Lịch làm việc', url: '/schedule', icon: <CalendarMonthIcon /> },
  { title: 'Thống kê', url: '/dashboard', icon: <BarChartIcon /> },
  { title: 'Giao dịch', url: '/transaction', icon: <DashboardIcon /> },
  { title: 'Chấm công', url: '/timesheet', icon: <PunchClockIcon /> },
  { title: 'Khách hàng', url: '/customer', icon: <GroupIcon /> },
  { title: 'Cài đặt', url: '/setting', icon: <SettingsIcon /> },
];

export default function ResponsiveDrawer({ mobileOpen, handleDrawerToggle }: {
  mobileOpen: boolean,
  handleDrawerToggle: () => void
}) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawer = (
    <Box sx={{zIndex:100}}>
      <Toolbar />
      <List>
        {menus.map((item) => (
          <ListItem key={item.url} disablePadding>
          <ListItemButton
            component={Link}
            href={item.url}
            selected={pathname === item.url}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} 
           
            />
          </ListItemButton>
        </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
}
