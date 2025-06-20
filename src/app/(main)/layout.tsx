"use client"
import Header from "@component/Menu";
import React from 'react';
import ResponsiveDrawer from "@component/ResponsiveDrawer";
import { Box, AppBar, Toolbar, IconButton, Container, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 200; // Chiều rộng tiêu chuẩn của Drawer trong Material-UI
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    
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

  );
}
