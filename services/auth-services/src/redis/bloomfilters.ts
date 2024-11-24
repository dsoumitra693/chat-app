import crypto from 'crypto';
import Redis from 'ioredis';

export class BloomFilter {
  private bitArraySize;
  private hashCount;
  private filterKey;
  private populationSize;
  private redisClient;

  constructor({
    populationSize = 1e7,
    fpRate = 0.001,
    filterKey,
  }: {
    populationSize?: number;
    fpRate?: number;
    filterKey: string;
  }) {
    this.populationSize = populationSize;
    this.bitArraySize = Math.ceil(-populationSize * Math.log(fpRate) * 2.0813);
    this.hashCount = ~~((this.bitArraySize / populationSize) * 0.693);
    this.filterKey = filterKey;
    this.redisClient = new Redis(process.env.REDIS_SERVICE_URL!);
  }

  getHashes(input: string) {
    const hashes = [];
    for (let i = 0; i < this.hashCount; i++) {
      const hash = crypto
        .createHash('sha256')
        .update(input + i)
        .digest('hex');
      const index = parseInt(hash, 16) % this.populationSize;
      hashes.push(index);
    }
    return hashes;
  }

  async add(data: string) {
    const indexes = this.getHashes(data);
    const pipeline = this.redisClient.pipeline();

    for (let index of indexes) {
      pipeline.bitfield(this.filterKey, 'INCRBY', 'u8', index, 1);
    }

    await pipeline.exec();
  }

  async check(data: string) {
    const indexes = this.getHashes(data);
    const pipeline = this.redisClient.pipeline();

    // Collect all bitfield GET commands in a single pipeline
    for (let index of indexes) {
      pipeline.bitfield(this.filterKey, 'GET', 'u8', index);
    }

    const results = (await pipeline.exec()) as any;

    // Check if any counter is 0, indicating absence
    for (const [err, count] of results) {
      if (err || (count as number[])[0] === 0) return false;
    }
    return true;
  }

  async delete(data: string) {
    const indexes = this.getHashes(data);
    const pipeline = this.redisClient.pipeline();

    // Collect bitfield GET commands to check values
    for (let index of indexes) {
      pipeline.bitfield(this.filterKey, 'GET', 'u8', index);
    }

    const counts = (await pipeline.exec()) as any;

    // Collect INCRBY commands to decrement counters only if they are > 0
    for (let i = 0; i < indexes.length; i++) {
      const count = (counts[i][1] as number[])[0];
      if (count && count > 0) {
        pipeline.bitfield(this.filterKey, 'INCRBY', 'u8', indexes[i], -1);
      }
    }

    await pipeline.exec();
  }
}

export const bloomFilter = new BloomFilter({
  filterKey: 'ACCOUNT_BLOOM_FLITER_KEY',
});
