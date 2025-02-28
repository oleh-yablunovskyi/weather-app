import { WeatherAggregator } from "../core/WeatherAggregator.js";
import { WeatherReport, TemperatureUnit } from "../types/index.js";
import redisClient from '../utils/redisClient.js';

export class WeatherService {
  constructor(private readonly weatherAggregator: WeatherAggregator) {}

  public async getWeather(city: string): Promise<WeatherReport[]> {
    const cacheKey = `weather:${city.toLowerCase()}`;

    // Check if the cache contains data for this city
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${city}`);
      return JSON.parse(cachedData);
    }

    console.log(`Cache miss for ${city}, fetching from providers...`);

    const weatherData = await this.weatherAggregator.getWeatherFromAllProviders(
      city,
      TemperatureUnit.Fahrenheit,
    );

    // Store the result in Redis with a TTL of 60 seconds
    await redisClient.set(cacheKey, JSON.stringify(weatherData), {
      EX: 60,
    });

    return weatherData;
  }
}
