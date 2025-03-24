export interface OpenWeatherMapResponse {
  weather: [
    {
      main: string;
    }
  ];
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
}

export interface TomorrowIOResponse {
  timelines: {
    minutely: [
      {
        values: {
          weatherCode: string;
          temperature: number;
          humidity: number;
          windSpeed: number;
        }
      }
    ]
  }
}

export interface WeatherData {
  weatherOverview: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export interface WeatherReport {
  location: string;
  provider: string;
  weatherOverview: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export enum TemperatureUnit {
  Celsius = 'celsius',
  Fahrenheit = 'fahrenheit'
}
