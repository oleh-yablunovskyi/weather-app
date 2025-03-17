import { CacheService } from '../CacheService.js';
import redisClient from './redisClient.js';

export class RedisCacheService implements CacheService {
  async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) as T : null;
  }

  async set<T>(key: string, value: T, ttlInSeconds = 60): Promise<void> {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlInSeconds });
  }
}
