import { WeatherAggregator } from "../core/WeatherAggregator.js";
import { WeatherReport, TemperatureUnit } from "../types/index.js";

export class WeatherService {
  private static instance: WeatherService;
  private readonly weatherAggregator: WeatherAggregator;

  private constructor() {
    this.weatherAggregator = new WeatherAggregator();
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  public async getWeather(city: string): Promise<WeatherReport[]> {
    return this.weatherAggregator.getWeatherFromAllProviders(city, TemperatureUnit.Fahrenheit);
  }
}
