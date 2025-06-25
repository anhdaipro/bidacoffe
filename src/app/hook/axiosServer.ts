// lib/axiosServer.ts
import axios from 'axios';
import { cookies } from 'next/headers';
import { apiLogout } from '../api/apiUser';
import { isTokenExpired, logout } from '@/utils/help';
const baseURL = 'http://localhost:3000/api'
const axiosServer = axios.create({
  baseURL: baseURL, // Đặt base URL của API
  withCredentials: true,
});

axiosServer.interceptors.request.use( 
    async (config) => {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;
        // Nếu accessToken hết hạn
    if (token && isTokenExpired(token)) {
      // Nếu refreshToken còn hạn thì cố gắng refresh
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          const response = await axios.post(`${baseURL}/refresh`, { refreshToken });
          const { accessToken } = response.data;
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          console.error('Làm mới token thất bại:', error);
        }
      } else {
        // Nếu refresh token cũng hết hạn → đăng xuất
        await logout()
        return Promise.reject(new Error('Refresh token expired'));
      }
    } else if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosServer;