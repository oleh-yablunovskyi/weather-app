import { WeatherProvider } from "../WeatherProvider.js";
import { WeatherProviderFactory } from "../WeatherProviderFactory.js";
import { OpenWeatherMapProvider } from "./OpenWeatherMapProvider.js";

export class OpenWeatherMapFactory extends WeatherProviderFactory {
  constructor(private readonly apiKey: string) {
    super();
  }

  createWeatherProvider(): WeatherProvider {
    return new OpenWeatherMapProvider(this.apiKey);
  }
}
