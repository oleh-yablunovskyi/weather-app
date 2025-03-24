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
      this.providers.map(async (provider) => {
        const data = await provider.getWeather(city);
        const providerName = provider.getProviderName();
        const temperature =
          tempUnit === TemperatureUnit.Fahrenheit
            ? this.convertCelsiusToFahrenheit(data.temperature)
            : data.temperature;

        const weatherReport: WeatherReport = {
          location: city,
          provider: providerName,
          weatherOverview: data.weatherOverview,
          temperature,
          humidity: data.humidity,
          windSpeed: data.windSpeed,
        };

        return weatherReport;
      })
    );
  
    return weatherResults;
  }
}
