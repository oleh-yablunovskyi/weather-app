import { WeatherProvider } from "../WeatherProvider.js";
import { WeatherProviderFactory } from "../WeatherProviderFactory.js";
import { TomorrowIOProvider } from "./TomorrowIOProvider.js";

export class TomorrowIOFactory extends WeatherProviderFactory {
  createWeatherProvider(): WeatherProvider {
    return new TomorrowIOProvider();
  }
}
