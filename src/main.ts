import * as dotenv from 'dotenv';
import { WeatherService } from './services/WeatherService.js';
import { WeatherAggregator } from './core/WeatherAggregator.js';
import { OpenWeatherMapFactory } from './providers/openweathermap/OpenWeatherMapFactory.js';
import { TomorrowIOFactory } from './providers/tomorrowio/TomorrowIOFactory.js';
import { getCity } from './utils/getCity.js';

dotenv.config();

const main = async () => {
  try {
    const city = getCity();

    // Instantiate providers
    const openWeatherProvider = new OpenWeatherMapFactory().createWeatherProvider();
    const tomorrowIOProvider = new TomorrowIOFactory().createWeatherProvider();

    // Inject providers into aggregator
    const weatherAggregator = new WeatherAggregator([
      openWeatherProvider,
      tomorrowIOProvider,
    ]);

    // Inject aggregator into service
    const weatherService = new WeatherService(weatherAggregator);

    const weatherData = await weatherService.getWeather(city);
    console.log(JSON.stringify(weatherData, null, 2));
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error occurred');
    process.exit(1);
  }
};

main();
