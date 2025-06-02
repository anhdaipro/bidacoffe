"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "./QueryProvider"; // Import QueryProvider
import Header from "./conponent/Menu";
import '../app/css/loading.css'
import Modal from "./conponent/Modal";
import React from 'react';
import ToastContainer from "./conponent/toast/ToastContainer";
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./type/theme";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LoginPage from "./login/page";
import ResponsiveDrawer from "./conponent/ResponsiveDrawer";
import { Box, AppBar, Toolbar, IconButton, Container, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const drawerWidth = 200; // Chiều rộng tiêu chuẩn của Drawer trong Material-UI
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login'
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        
        <QueryProvider>
          {!isLoginPage ?
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* Mobile Drawer - Ẩn trên desktop */}
          <Box
            component="nav"
            sx={{ 
              zIndex: 100, // Đảm bảo Drawer nằm trên AppBar
              width: { sm: 0 }, // Ẩn hoàn toàn trên desktop
              flexShrink: { sm: 0 } 
            }}
          >
            <ResponsiveDrawer 
              mobileOpen={mobileOpen} 
              handleDrawerToggle={handleDrawerToggle}
            />
          </Box>

          {/* Main Content Area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { sm: `calc(100% - ${drawerWidth}px)` }, // Quan trọng: trừ đi chiều rộng drawer
              
              marginLeft: {sm:0 ,md: `${drawerWidth}px` }, // Đẩy nội dung sang phải
            }}
          >
            {/* Header với menu button cho mobile */}
            <AppBar position="fixed">
              <Toolbar>
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Header />
              </Toolbar>
            </AppBar>

            {/* Content Area - Thêm padding để tránh bị AppBar che */}
            <Box sx={{ mt: { xs: 7, sm: 8 },p:0 }}>
                      <Container sx={{p:{xs:0}}}  maxWidth="xl">
                        {children}
                      </Container>
                    </Box>
          </Box>
        </Box>
          : <LoginPage/>}
          <Modal/>
          <ToastContainer />
        </QueryProvider>
        </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
