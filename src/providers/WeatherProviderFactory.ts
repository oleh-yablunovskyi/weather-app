import { WeatherProvider } from "./WeatherProvider.js";

export abstract class WeatherProviderFactory {
  abstract createWeatherProvider(): WeatherProvider;
}
