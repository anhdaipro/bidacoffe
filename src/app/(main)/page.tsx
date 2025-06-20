"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { useAuthStore } from "../store/useUserStore";
import Dashboard from "./dashboard/page";
export default function Home() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token || !user) {
  //     // Nếu chưa đăng nhập, chuyển hướng về trang Login
  //     router.push('/login');
  //   }
  // }, [router]);
  return (
    <Dashboard/>
  );
}
