import { OpenWeatherMapFactory } from "../providers/openweathermap/OpenWeatherMapFactory.js";
import { TomorrowIOFactory } from "../providers/tomorrowio/TomorrowIOFactory.js";
import { WeatherReport, TemperatureUnit } from "../types/index.js";

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
  ): Promise<WeatherReport[]> {
    const weatherProviders = Object.values(this.factories).map((factory) => factory.createWeatherProvider());

    const weatherResults = await Promise.all(
      weatherProviders.map((provider) => provider.getWeather(city))
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
