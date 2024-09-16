import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;

  constructor(temperature: number, description: string, humidity: number, windSpeed: number) {
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private city: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.city = '';
  }

  // Fetch location data for the city
  private async fetchLocationData(query: string): Promise<any> {
    const url = this.buildGeocodeQuery(query);
    const response = await fetch(url);
    return response.json();
  }

  // Destructure latitude and longitude from location data
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon
    };
  }

  // Build query string for geocode API
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
  }

  // Build query string for weather API
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // Fetch and destructure location data into coordinates
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.city);
    return this.destructureLocationData(locationData);
  }

  // Fetch weather data for the coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    return response.json();
  }

  // Parse weather response into a Weather object
  private parseCurrentWeather(response: any): Weather {
    const { main, weather, wind } = response;
    return new Weather(main.temp, weather[0].description, main.humidity, wind.speed);
  }

  // Build forecast array (this can be extended later if necessary)
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    // This method can be expanded to handle forecast data.
    return [currentWeather];
  }

  // Fetch weather data for the given city
  public async getWeatherForCity(city: string): Promise<Weather[]> {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, weatherData);
  }
}

export default new WeatherService();




