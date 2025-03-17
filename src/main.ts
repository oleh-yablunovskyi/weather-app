import * as dotenv from 'dotenv';
import { WeatherService } from './services/WeatherService.js';
import { WeatherAggregator } from './core/WeatherAggregator.js';
import { OpenWeatherMapFactory } from './providers/openweathermap/OpenWeatherMapFactory.js';
import { TomorrowIOFactory } from './providers/tomorrowio/TomorrowIOFactory.js';
import redisClient, { initializeRedis } from './cache/redis/redisClient.js';
import { RedisCacheService } from './cache/redis/RedisCacheService.js';
import { getCity } from './utils/getCity.js';

dotenv.config();

const main = async () => {
  try {
    await initializeRedis();

    const city = getCity();

    // Instantiate providers with API keys
    const openWeatherProvider = new OpenWeatherMapFactory(process.env.OPENWEATHER_API_KEY || '').createWeatherProvider();
    const tomorrowIOProvider = new TomorrowIOFactory(process.env.TOMORROW_IO_API_KEY || '').createWeatherProvider();

    // Inject providers into aggregator
    const weatherAggregator = new WeatherAggregator([
      openWeatherProvider,
      tomorrowIOProvider,
    ]);

    const cacheService = new RedisCacheService();

    const weatherService = new WeatherService(weatherAggregator, cacheService);

    const weatherData = await weatherService.getWeather(city);
    console.log(JSON.stringify(weatherData, null, 2));
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error occurred');
  } finally {
    // Attempt graceful shutdown by disconnecting from Redis
    try {
      await redisClient.disconnect();
      console.log('Redis connection closed gracefully.');
    } catch (disconnectError) {
      console.error('Error disconnecting Redis:', disconnectError);
    }
  }
};

main();
