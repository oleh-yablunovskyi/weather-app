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
  providerName: string;
  data: {
    weatherOverview: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
  };
}

export interface WeatherReport {
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
