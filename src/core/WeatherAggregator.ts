import { WeatherProvider } from "../providers/WeatherProvider.js";
import { WeatherReport, TemperatureUnit } from "../types/index.js";

export class WeatherAggregator {
  constructor(private readonly providers: WeatherProvider[]) {}

  private convertCelsiusToFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32;
  }

  public async getWeatherFromAllProviders(
    city: string, 
    tempUnit: TemperatureUnit = TemperatureUnit.Celsius,
  ): Promise<WeatherReport[]> {
    const weatherResults = await Promise.all(
      this.providers.map((provider) => provider.getWeather(city))
    );

    if (tempUnit === TemperatureUnit.Fahrenheit) {
      weatherResults.forEach((weatherData) => {
        weatherData.data.temperature = this.convertCelsiusToFahrenheit(weatherData.data.temperature);
      });
    }

    return weatherResults.map((weatherData) => ({
      provider: weatherData.providerName,
      weatherOverview: weatherData.data.weatherOverview,
      temperature: weatherData.data.temperature,
      humidity: weatherData.data.humidity,
      windSpeed: weatherData.data.windSpeed,
    }));
  }
}
