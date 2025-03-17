import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        // After 3 attempts stop retrying
        return new Error('Too many reconnection attempts');
      }
      // Wait for (retries * 1000) milliseconds before retrying
      return retries * 1000;
    },
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

export async function initializeRedis() {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully.');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
}

export default redisClient;
