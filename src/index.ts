import * as dotenv from 'dotenv';
import { OpenWeatherMapResponse, TomorrowIOResponse, WeatherData } from './interfaces.js';

dotenv.config();

// Abstract Product
abstract class WeatherProvider {
  abstract getWeather(city: string): Promise<WeatherData>;
  abstract getProviderName(): string;
}

// Concrete Product A
class OpenWeatherMapProvider extends WeatherProvider {
  private readonly apiKey: string;

  constructor() {
    super();

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeatherMap API key is missing in .env file');
    }
    this.apiKey = apiKey;
  }

  public async getWeather(city: string): Promise<WeatherData> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${this.apiKey}`;

    const response = await fetch(url);
    const weatherData = await response.json() as OpenWeatherMapResponse;

    return {
      provider: this.getProviderName(),
      data: {
        weatherOverview: weatherData.weather[0].main,
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
      }
    };
  }

  public getProviderName(): string {
    return 'OpenWeatherMap';
  }
}

// Concrete Product B
class TomorrowIOProvider extends WeatherProvider {
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
      provider: this.getProviderName(),
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

// Abstract Creator
abstract class WeatherProviderFactory {
  abstract createWeatherProvider(): WeatherProvider;
}

// Concrete Creator A
class OpenWeatherMapFactory extends WeatherProviderFactory {
  createWeatherProvider(): WeatherProvider {
    return new OpenWeatherMapProvider();
  }
}

// Concrete Creator B
class TomorrowIOFactory extends WeatherProviderFactory {
  createWeatherProvider(): WeatherProvider {
    return new TomorrowIOProvider();
  }
}

// Client Code
class WeatherService {
  private static instance: WeatherService;
  private readonly factories = {
    OpenWeatherMap: new OpenWeatherMapFactory(),
    TomorrowIO: new TomorrowIOFactory()
  };

  private constructor() {}

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  public async getAllWeatherData(city: string): Promise<WeatherData[]> {
    const allFactories = Object.values(this.factories);
    
    const weatherPromises = allFactories.map(factory => {
      const provider = factory.createWeatherProvider();
      return provider.getWeather(city);
    });
  
    return Promise.all(weatherPromises);
  }
}

// Utility funcs
const getCity = (): string => {
  const city = process.argv[2];

  if (!city) {
    console.error('Please provide a city name as an argument');
    console.error('Example: "npm start Kyiv" or "npm run dev Kyiv"');
    process.exit(1);
  }

  return city;
};

// Main app
const main = async () => {
  try {
    const city = getCity();
    const weatherService = WeatherService.getInstance();
    const weatherData = await weatherService.getAllWeatherData(city);
    console.log(JSON.stringify(weatherData, null, 2));
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error occurred');
    process.exit(1);
  }
};

main();
