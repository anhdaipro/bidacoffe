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
  useEffect(()=>{
    if(!user){
      router.push('/login')
    }
  }, [user])
  return (
    <Dashboard/>
  );
}
