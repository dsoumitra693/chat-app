import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables from a .env file into process.env
dotenv.config();

// Create a new Redis client using the provided service URL from environment variables
const redisClient = new Redis(process.env.REDIS_SERVICE_URL!);

// Optional: Handle connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis'); // Log a message when connected
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err); // Log any connection errors
});

/**
 * The Redis client instance for interacting with the Redis database.
 * 
 * @remarks 
 * This client can be used for caching, pub/sub messaging, and other data storage 
 * functionalities provided by Redis.
 */
export default redisClient;
