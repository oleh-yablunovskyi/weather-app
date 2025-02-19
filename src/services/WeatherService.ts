import { WeatherAggregator } from "../core/WeatherAggregator.js";
import { WeatherReport, TemperatureUnit } from "../types/index.js";

export class WeatherService {
  constructor(private readonly weatherAggregator: WeatherAggregator) {}

  public async getWeather(city: string): Promise<WeatherReport[]> {
    return this.weatherAggregator.getWeatherFromAllProviders(city, TemperatureUnit.Fahrenheit);
  }
}
