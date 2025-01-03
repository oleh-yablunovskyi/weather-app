import { OpenWeatherMapFactory } from "../providers/openweathermap/OpenWeatherMapFactory.js";
import { TomorrowIOFactory } from "../providers/tomorrowio/TomorrowIOFactory.js";
import { WeatherData } from "../types/index.js";

export class WeatherService {
  private static instance: WeatherService;
  private readonly factories = {
    OpenWeatherMap: new OpenWeatherMapFactory(),
    TomorrowIO: new TomorrowIOFactory()
  };

  private constructor() {}

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  public async getAllWeatherData(city: string): Promise<WeatherData[]> {
    const allFactories = Object.values(this.factories);
    
    const weatherPromises = allFactories.map(factory => {
      const provider = factory.createWeatherProvider();
      return provider.getWeather(city);
    });
  
    return Promise.all(weatherPromises);
  }
}
