"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './main.css';
import { useLogin } from '../query/useUser';
import { useAuthStore } from '../store/useUserStore';
import { useToastStore } from '../store/toastStore';
import { v4 as uuidv4 } from 'uuid'
const LoginPage: React.FC = () => {
  const user = useAuthStore(state=>state.user);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const addToast = useToastStore(state=>state.addToast)
  const router = useRouter();
  useEffect(()=>{
    if(user){
      router.push('/')
    }
  }, [user])
  const {mutate: login, isPending, isSuccess} = useLogin()
  const setUser = useAuthStore(state=>state.setUser)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {identifier,password};
    login(data, {
        onSuccess: (data) => {
            localStorage.setItem('token', data.accessToken); // Lưu token vào localStorage
            localStorage.setItem('refreshToken', data.refreshToken); // Lưu token vào localStorage
            router.push('/'); // Chuyển hướng đến trang Home
            setUser(data.user)
        },
        onError: (error: any) => {
          addToast({
            id: uuidv4(),
            message: error.response.data.message,
            type: 'error',
          });
        }
    });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        <input
          type="text"
          placeholder="Tên đăng nhập hoặc Số điện thoại"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isPending || isSuccess}>
          {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;