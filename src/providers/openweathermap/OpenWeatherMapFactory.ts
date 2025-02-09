import { WeatherProvider } from "../WeatherProvider.js";
import { WeatherProviderFactory } from "../WeatherProviderFactory.js";
import { OpenWeatherMapProvider } from "./OpenWeatherMapProvider.js";

export class OpenWeatherMapFactory extends WeatherProviderFactory {
  createWeatherProvider(): WeatherProvider {
    return new OpenWeatherMapProvider();
  }
}
