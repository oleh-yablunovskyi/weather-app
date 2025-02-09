import * as dotenv from 'dotenv';
import { WeatherService } from './services/WeatherService.js';
import { getCity } from './utils/getCity.js';

dotenv.config();

const main = async () => {
  try {
    const city = getCity();
    const weatherService = WeatherService.getInstance();
    const weatherData = await weatherService.getWeather(city);
    console.log(JSON.stringify(weatherData, null, 2));
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error occurred');
    process.exit(1);
  }
};

main();
