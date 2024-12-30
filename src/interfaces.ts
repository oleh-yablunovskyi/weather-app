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
  provider: string;
  data: {
    weatherOverview: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
  };
}
