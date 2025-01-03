import { OpenWeatherMapFactory } from "../providers/openweathermap/OpenWeatherMapFactory.js";
import { TomorrowIOFactory } from "../providers/tomorrowio/TomorrowIOFactory.js";
import { WeatherData } from "../types/index.js";

export class WeatherProviderFacade {
  private readonly factories = {
    OpenWeatherMap: new OpenWeatherMapFactory(),
    TomorrowIO: new TomorrowIOFactory()
  };

  public async getWeatherFromAllProviders(city: string): Promise<WeatherData[]> {
    const allFactories = Object.values(this.factories);

    const weatherPromises = allFactories.map((factory) => {
      const provider = factory.createWeatherProvider();
      return provider.getWeather(city);
    });

    const results = await Promise.all(weatherPromises);

    return results;
  }
}
