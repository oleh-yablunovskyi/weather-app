import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherService } from './WeatherService.js';
import { WeatherAggregator } from '../core/WeatherAggregator.js';
import { CacheService } from '../cache/CacheService.js';
import { WeatherReport, TemperatureUnit } from '../types/index.js';
import { CACHE_TTL_TIME_IN_SEC } from '../consts/index.js';

// Mocked dependencies
const mockWeatherReports: WeatherReport[] = [
  {
    location: 'Kyiv',
    provider: 'MockProvider1',
    weatherOverview: 'Sunny',
    temperature: 20,
    humidity: 50,
    windSpeed: 5,
  },
  {
    location: 'Kyiv',
    provider: 'MockProvider2',
    weatherOverview: 'Sunny',
    temperature: 21,
    humidity: 61,
    windSpeed: 6,
  },
];

describe('WeatherService', () => {
  const city = 'Kyiv';
  const cacheKey = `weather:${city.toLowerCase()}`;

  let weatherAggregator: WeatherAggregator;
  let cacheService: CacheService;
  let weatherService: WeatherService;

  beforeEach(() => {
    weatherAggregator = {
      getAggregatedWeather: vi.fn().mockResolvedValue(mockWeatherReports),
    } as unknown as WeatherAggregator;

    cacheService = {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue(undefined),
    };

    weatherService = new WeatherService(weatherAggregator, cacheService);
  });

  it('should return weather data from aggregator and set cache on cache miss', async () => {
    const results = await weatherService.getWeather(city);

    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(weatherAggregator.getAggregatedWeather).toHaveBeenCalledWith(
      city,
      TemperatureUnit.Celsius
    );
    expect(cacheService.set).toHaveBeenCalledWith(
      cacheKey,
      mockWeatherReports,
      CACHE_TTL_TIME_IN_SEC
    );
    expect(results).toEqual(mockWeatherReports);
  });

  it('should return cached weather data without calling aggregator on cache hit', async () => {
    vi.mocked(cacheService.get).mockResolvedValue(mockWeatherReports);
  
    const results = await weatherService.getWeather(city);
  
    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(weatherAggregator.getAggregatedWeather).not.toHaveBeenCalled();
    expect(cacheService.set).not.toHaveBeenCalled();
    expect(results).toEqual(mockWeatherReports);
  });
  
  it('should correctly handle aggregator errors on cache miss', async () => {
    vi.mocked(weatherAggregator.getAggregatedWeather).mockRejectedValue(
      new Error('Aggregator failed')
    );
  
    await expect(weatherService.getWeather(city)).rejects.toThrow('Aggregator failed');
  
    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(weatherAggregator.getAggregatedWeather).toHaveBeenCalled();
    expect(cacheService.set).not.toHaveBeenCalled();
  });
});
