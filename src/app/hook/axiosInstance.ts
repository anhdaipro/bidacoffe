import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: '/api', // Đặt base URL của API
});

// Hàm kiểm tra token hết hạn
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)
    return decoded.exp < currentTime; // Token đã hết hạn
  } catch (error) {
    return true; // Token không hợp lệ
  }
};

// Interceptor để kiểm tra và refresh token
// Interceptor để kiểm tra và refresh token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Nếu accessToken hết hạn
    if (token && isTokenExpired(token)) {
      // Nếu refreshToken còn hạn thì cố gắng refresh
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          const response = await axios.post('/api/refresh', { refreshToken });
          const { accessToken } = response.data;

          localStorage.setItem('token', accessToken);
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          console.error('Làm mới token thất bại:', error);
        }
      } else {
        // Nếu refresh token cũng hết hạn → đăng xuất
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
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

export default axiosInstance;