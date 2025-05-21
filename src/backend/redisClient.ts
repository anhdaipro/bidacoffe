import Redis from 'ioredis';

// Tạo một Redis client
const redisClient = new Redis({
  host: 'localhost', // Địa chỉ Redis server (mặc định là localhost)
  port: 6379,        // Cổng Redis server (mặc định là 6379)
  password: 'anhdai123',      // Mật khẩu Redis (nếu có)
});

// Xử lý sự kiện kết nối
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redisClient;