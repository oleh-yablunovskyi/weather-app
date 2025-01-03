import { WeatherData } from "../types/index.js";

export abstract class WeatherProvider {
  abstract getWeather(city: string): Promise<WeatherData>;
  abstract getProviderName(): string;
}
