// redisClient.ts
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = new Redis(process.env.REDIS_SERVICE_URL!);

// Optional: Handle connection events
redisClient.on('connect', () => {
  ('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redisClient;
