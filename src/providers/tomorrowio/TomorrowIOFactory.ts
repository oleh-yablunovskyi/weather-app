import { WeatherProvider } from "../WeatherProvider.js";
import { WeatherProviderFactory } from "../WeatherProviderFactory.js";
import { TomorrowIOProvider } from "./TomorrowIOProvider.js";

export class TomorrowIOFactory extends WeatherProviderFactory {
  constructor(private readonly apiKey: string) {
    super();
  }

  createWeatherProvider(): WeatherProvider {
    return new TomorrowIOProvider(this.apiKey);
  }
}
