import { WeatherProvider } from "../providers/WeatherProvider.js";
import { WeatherReport, TemperatureUnit, WeatherData } from "../types/index.js";

export class WeatherAggregator {
  constructor(private readonly providers: WeatherProvider[]) {}

  public async getAggregatedWeather(
    city: string, 
    tempUnit: TemperatureUnit = TemperatureUnit.Celsius,
  ): Promise<WeatherReport[]> {
    const weatherData = await this.fetchWeatherFromAllProviders(city);

    return weatherData.map(({ providerName, data }) =>
      this.createWeatherReport(city, tempUnit, providerName, data)
    );
  }

  private async fetchWeatherFromAllProviders(city: string): Promise<{ providerName: string; data: WeatherData }[]> {
    return Promise.all(
      this.providers.map(async (provider) => {
        const providerName = provider.getProviderName();
        const data = await provider.getWeather(city);
        return { providerName, data };
      })
    );
  }

  private createWeatherReport(
    city: string,
    tempUnit: TemperatureUnit,
    providerName: string,
    data: WeatherData,
  ): WeatherReport {
    return {
      location: city,
      provider: providerName,
      weatherOverview: data.weatherOverview,
      temperature:
        tempUnit === TemperatureUnit.Fahrenheit
          ? this.convertCelsiusToFahrenheit(data.temperature)
          : data.temperature,
      humidity: data.humidity,
      windSpeed: data.windSpeed,
    };
  }

  private convertCelsiusToFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32;
  }
}
