import Redis from 'ioredis';

export class JWTStore {
  private redisClient: Redis;
  
  constructor() {
    // Enable keep-alive and explicitly set a high retry strategy
    this.redisClient = new Redis(process.env.REDIS_SERVICE_URL!, {
      lazyConnect: true, // Connect only when a command is issued
      keepAlive: 10000,  // Keeps the connection alive longer
      retryStrategy: (times) => Math.min(times * 50, 2000), // Retry backoff
    });
  }
  public async store(jwt: string, data: string): Promise<void> {
    await this.redisClient.set(jwt, data);
  }

  /**
   * Read data associated with a JWT.
   * Use `pipeline` if multiple reads are required in batch.
   */
  public async read(jwt: string): Promise<string | null> {
    return this.redisClient.get(jwt);
  }

  /**
   * Delete a JWT entry.
   */
  public async delete(jwt: string): Promise<number> {
    return this.redisClient.del(jwt);
  }

  /**
   * Graceful shutdown to close Redis connection.
   */
  public async closeConnection(): Promise<void> {
    await this.redisClient.quit();
  }
}

export const jwtStore = new JWTStore();
