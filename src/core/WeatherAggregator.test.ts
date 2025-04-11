import { describe, it, expect, beforeEach } from 'vitest';
import { WeatherAggregator } from './WeatherAggregator.js';
import { WeatherProvider } from '../providers/WeatherProvider.js';
import { WeatherData, TemperatureUnit } from '../types/index.js';

// Mocked dependencies
class MockWeatherProvider implements WeatherProvider {
  constructor(private readonly name: string, private readonly mockData: WeatherData) {}

  async getWeather(city: string): Promise<WeatherData> {
    return Promise.resolve(this.mockData);
  }

  getProviderName(): string {
    return this.name;
  }
}

describe('WeatherAggregator', () => {
  let weatherAggregator: WeatherAggregator;

  beforeEach(() => {
    const mockProviders = [
      new MockWeatherProvider('MockProvider1', {
        weatherOverview: 'Sunny',
        temperature: 20,
        humidity: 50,
        windSpeed: 5,
      }),
      new MockWeatherProvider('MockProvider2', {
        weatherOverview: 'Cloudy',
        temperature: 15,
        humidity: 60,
        windSpeed: 10,
      }),
    ];

    weatherAggregator = new WeatherAggregator(mockProviders);
  });

  it('should retrieve weather from all providers', async () => {
    const city = 'Kyiv';
    const reports = await weatherAggregator.getAggregatedWeather(city);

    expect(reports).toEqual([
      {
        location: city,
        provider: 'MockProvider1',
        weatherOverview: 'Sunny',
        temperature: 20,
        humidity: 50,
        windSpeed: 5,
      },
      {
        location: city,
        provider: 'MockProvider2',
        weatherOverview: 'Cloudy',
        temperature: 15,
        humidity: 60,
        windSpeed: 10,
      },
    ]);
  });

  it('should correctly convert temperature to Fahrenheit', async () => {
    const city = 'Vilnius';
    const reports = await weatherAggregator.getAggregatedWeather(city, TemperatureUnit.Fahrenheit);

    expect(reports).toEqual([
      {
        location: city,
        provider: 'MockProvider1',
        weatherOverview: 'Sunny',
        temperature: 68, // 20°C → 68°F
        humidity: 50,
        windSpeed: 5,
      },
      {
        location: city,
        provider: 'MockProvider2',
        weatherOverview: 'Cloudy',
        temperature: 59, // 15°C → 59°F
        humidity: 60,
        windSpeed: 10,
      },
    ]);
  });
});
