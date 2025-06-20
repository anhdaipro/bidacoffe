import Redis from 'ioredis';

const globalForRedis = global as unknown as {
  redisClient?: Redis;
};

const redisClient =
  globalForRedis.redisClient ??
  new Redis({
    username: 'default',
    password: '7hu8bjxIYVjsZPyxZTYswVMXgwyECo4B',
    host: 'redis-11670.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com',
    port: 11670,
  });

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redisClient = redisClient;
}
export default redisClient