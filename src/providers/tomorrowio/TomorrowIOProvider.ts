import { WeatherProvider } from "../WeatherProvider.js";
import { TomorrowIOResponse, WeatherData } from "../../types/index.js";

export class TomorrowIOProvider extends WeatherProvider {
  private readonly apiKey: string;
  private readonly weatherCodeMapping: Record<string, string> = {
    "0": "Unknown",
    "1000": "Clear, Sunny",
    "1100": "Mostly Clear",
    "1101": "Partly Cloudy",
    "1102": "Mostly Cloudy",
    "1001": "Cloudy",
    "2000": "Fog",
    "2100": "Light Fog",
    "4000": "Drizzle",
    "4001": "Rain",
    "4200": "Light Rain",
    "4201": "Heavy Rain",
    "5000": "Snow",
    "5001": "Flurries",
    "5100": "Light Snow",
    "5101": "Heavy Snow",
    "6000": "Freezing Drizzle",
    "6001": "Freezing Rain",
    "6200": "Light Freezing Rain",
    "6201": "Heavy Freezing Rain",
    "7000": "Ice Pellets",
    "7101": "Heavy Ice Pellets",
    "7102": "Light Ice Pellets",
    "8000": "Thunderstorm"
  };

  constructor() {
    super();

    const apiKey = process.env.TOMORROW_IO_API_KEY;
    if (!apiKey) {
      throw new Error('Tomorrow.io API key is missing in .env file');
    }
    this.apiKey = apiKey;
  }

  public async getWeather(city: string): Promise<WeatherData> {
    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=${this.apiKey}`;

    const response = await fetch(url);
    const weatherData = await response.json() as TomorrowIOResponse;
    const currentData = weatherData.timelines.minutely[0].values;

    return {
      providerName: this.getProviderName(),
      data: {
        weatherOverview: this.weatherCodeMapping[currentData.weatherCode] || "Unknown",
        temperature: currentData.temperature,
        humidity: currentData.humidity,
        windSpeed: currentData.windSpeed,
      }
    };
  }

  public getProviderName(): string {
    return 'TomorrowIO';
  }
}
