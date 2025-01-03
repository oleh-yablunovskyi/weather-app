import { WeatherProviderFacade } from "../facades/WeatherProviderFacade.js";
import { WeatherData } from "../types/index.js";

export class WeatherService {
  private static instance: WeatherService;
  private readonly weatherAggregator: WeatherProviderFacade;

  private constructor() {
    this.weatherAggregator = new WeatherProviderFacade();
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  public async getWeather(city: string): Promise<WeatherData[]> {
    return this.weatherAggregator.getWeatherFromAllProviders(city);
  }
}
