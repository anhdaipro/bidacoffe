"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "./QueryProvider"; // Import QueryProvider
import Modal from "@component/Modal";
import React from 'react';
import ToastContainer from "@component/toast/ToastContainer";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./type/theme";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
            {children}
          <Modal/>
          <ToastContainer />
        </QueryProvider>
        </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
