import { WeatherAggregator } from "../core/WeatherAggregator.js";
import { CacheService } from "../cache/CacheService.js";
import { WeatherReport, TemperatureUnit } from "../types/index.js";
import { CACHE_TTL_TIME_IN_SEC } from "../consts/index.js";

export class WeatherService {
  constructor(
    private readonly weatherAggregator: WeatherAggregator,
    private readonly cacheService: CacheService
  ) {}

  public async getWeather(city: string): Promise<WeatherReport[]> {
    const cacheKey = `weather:${city.toLowerCase()}`;

    const cachedData = await this.cacheService.get<WeatherReport[]>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${city}`);
      return cachedData;
    }

    console.log(`Cache miss for ${city}, fetching from providers...`);

    const weatherData = await this.weatherAggregator.getWeatherFromAllProviders(
      city,
      TemperatureUnit.Fahrenheit,
    );

    await this.cacheService.set(cacheKey, weatherData, CACHE_TTL_TIME_IN_SEC);

    return weatherData;
  }
}
