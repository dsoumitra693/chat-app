import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables from a .env file into process.env
dotenv.config();

// Create a new Redis client using the provided service URL from environment variables
const pub = new Redis(process.env.REDIS_SERVICE_URL!);
const sub = new Redis(process.env.REDIS_SERVICE_URL!);
const redisKV = new Redis(process.env.REDIS_SERVICE_URL!);

/**
 * The `pub` Redis client instance for publishing messages.
 *
 * @remarks
 * This client is used specifically for publishing messages in a pub/sub model.
 * It connects to the Redis instance using the service URL provided in the environment variables.
 */
export { pub };

/**
 * The `sub` Redis client instance for subscribing to messages.
 *
 * @remarks
 * This client listens for messages published to specific channels in the Redis instance.
 * It can be used to handle real-time message passing between services.
 */
export { sub };

/**
 * The `redisKV` Redis client instance for key-value storage.
 *
 * @remarks
 * This client is used to interact with Redis as a key-value store, allowing
 * for caching, session storage, and other Redis-based functionalities.
 */
export { redisKV };
