"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "./QueryProvider"; // Import QueryProvider
import Header from "./conponent/Menu";
import '../app/css/loading.css'
import Modal from "./conponent/Modal";
import React from 'react';
import styled from 'styled-components';
import Link from "next/link";
import StyledComponentsRegistry from "./lib/registry";
import { useControlStore } from "./store/useStore";
import ToastContainer from "./conponent/toast/ToastContainer";
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./type/theme";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAuthStore } from "./store/useUserStore";
import LoginPage from "./login/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  height: 100dvh;  
`;

const Sidebar = styled.div`
  width: 240px;
  background: #263238;
  color: white;
  display: flex;
  flex-direction: column;
`;
interface LinkProps {
  active?: number;
}
const SidebarItem = styled(Link)<LinkProps>`
  padding: 16px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? '#37474f' : 'transparent')};

  &:hover {
    background: #37474f;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  background: #f5f5f5;
  overflow-y: auto;
`;

const HeaderStyle = styled.div`
  height: 60px;
  background: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 20px;
`;
const menus = [
  {title: 'Quản lý bàn', url: '/table'},
  {title: 'Setup bàn', url: '/billiardTable'},
  {title: 'Sản phẩm', url: '/products'},
  {title: 'Phiên chơi', url: '/tableSession'},
  {title: 'Nhân viên', url: '/staff'},
  {title: 'Thống kế', url: '/dashboard'},
  {title: 'Giao dịch sản phẩm', url: '/transaction'},
  {title: 'Khách hàng', url: '/customer'},
  {title: 'Cài đặt', url: '/setting'},
]
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useAuthStore(state=>state.user)
  const pathname = usePathname();
  const isLoginPage = pathname === '/login'
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StyledComponentsRegistry>
        <QueryProvider>
          {!isLoginPage ?
          <Wrapper>
            <Sidebar>
              {menus.map(item =>
                
                <SidebarItem key={item.url} active={pathname === item.url ? 1 : 0} href={item.url}>{item.title}</SidebarItem>
               
              )}
            </Sidebar>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Header/>
              <ContentArea>
                {children}
              </ContentArea>
            </div>
          </Wrapper>: <LoginPage/>}
          <Modal/>
          <ToastContainer />
        </QueryProvider>
        </StyledComponentsRegistry>
        </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
