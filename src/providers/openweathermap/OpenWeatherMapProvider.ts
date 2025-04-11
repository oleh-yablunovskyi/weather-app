import { WeatherProvider } from "../WeatherProvider.js";
import { OpenWeatherMapResponse, WeatherData } from "../../types/index.js";

export class OpenWeatherMapProvider extends WeatherProvider {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    super();

    if (!apiKey) {
      throw new Error('OpenWeatherMap API key is missing');
    }
    this.apiKey = apiKey;
  }

  public async getWeather(city: string): Promise<WeatherData> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${this.apiKey}`;

    const response = await fetch(url);
    const weatherData = await response.json() as OpenWeatherMapResponse;

    return {
      weatherOverview: weatherData.weather[0].main,
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
    };
  }

  public getProviderName(): string {
    return 'OpenWeatherMap';
  }
}
