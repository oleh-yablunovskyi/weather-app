import { OpenWeatherMapFactory } from "../providers/openweathermap/OpenWeatherMapFactory.js";
import { TomorrowIOFactory } from "../providers/tomorrowio/TomorrowIOFactory.js";
import { WeatherData, TemperatureUnit } from "../types/index.js";

export class WeatherAggregator {
  private readonly factories = {
    OpenWeatherMap: new OpenWeatherMapFactory(),
    TomorrowIO: new TomorrowIOFactory()
  };

  private convertCelsiusToFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32;
  }

  public async getWeatherFromAllProviders(
    city: string, 
    tempUnit: TemperatureUnit = TemperatureUnit.Celsius,
  ): Promise<WeatherData[]> {
    const allFactories = Object.values(this.factories);

    const weatherPromises = allFactories.map((factory) => {
      const provider = factory.createWeatherProvider();
      return provider.getWeather(city);
    });

    const results = await Promise.all(weatherPromises);

    if (tempUnit === TemperatureUnit.Fahrenheit) {
      return results.map((weatherData) => {
        weatherData.data.temperature = this.convertCelsiusToFahrenheit(
          weatherData.data.temperature
        );
        return weatherData;
      });
    }

    return results;
  }
}
