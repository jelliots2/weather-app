import dotenv from 'dotenv';
dotenv.config();
// Weather class based on OpenWeatherMap API response
export class Weather {
    constructor(data) {
        this.coord = data.coord;
        this.weather = data.weather;
        this.base = data.base;
        this.main = data.main;
        this.visibility = data.visibility;
        this.wind = data.wind;
        this.clouds = data.clouds;
        this.rain = data.rain;
        this.snow = data.snow;
        this.dt = data.dt;
        this.sys = data.sys;
        this.timezone = data.timezone;
        this.id = data.id;
        this.name = data.name;
        this.cod = data.cod;
    }
}
// WeatherService class
class WeatherService {
    constructor(cityName = "Toronto") {
        this.baseURL = 'https://api.openweathermap.org/data/2.5';
        this.baseURLGeo = 'https://api.openweathermap.org/geo/1.0/direct';
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.cityName = cityName;
    }
    async fetchLocationData(city) {
        const cityName = city || this.cityName;
        const geocodeQuery = this.buildGeocodeQuery(cityName);
        console.log("Geocode query:", geocodeQuery);
        try {
            const response = await fetch(geocodeQuery);
            if (!response.ok) {
                throw new Error(`Error fetching location data: ${response.statusText}`);
            }
            const locationData = await response.json();
            console.log("Location data:", locationData);
            if (!locationData || locationData.length === 0) {
                throw new Error("No location data found for the specified city.");
            }
            return this.destructureLocationData(locationData[0]);
        }
        catch (error) {
            console.error("Fetch location error:", error);
            throw new Error("Unable to fetch location data.");
        }
    }
    destructureLocationData(locationData) {
        return {
            lat: locationData.lat,
            lon: locationData.lon,
        };
    }
    buildGeocodeQuery(query) {
        return `${this.baseURLGeo}?q=${query}&limit=1&appid=${this.apiKey}`;
    }
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
    }
    async fetchWeatherData(coordinates) {
        const weatherQuery = this.buildWeatherQuery(coordinates);
        console.log("Weather query:", weatherQuery);
        const forecastQuery = `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
        try {
            const weatherResponse = await fetch(weatherQuery);
            const currentWeather = await weatherResponse.json();
            //console.log("Current weather data:", currentWeather);
            const forecastResponse = await fetch(forecastQuery);
            const forecastData = await forecastResponse.json();
            console.log("Forecast data:", forecastData);
            const forecastArray = this.buildForecastArray(forecastData.list);
            return { currentWeather, forecastArray };
        }
        catch (error) {
            console.error("Error fetching weather data:", error);
            throw new Error("Unable to fetch weather data.");
        }
    }
    parseCurrentWeather(data) {
        return {
            city: data.name,
            date: new Date(data.dt * 1000).toLocaleDateString(),
            dt: data.dt,
            tempF: data.main.temp,
            windSpeed: data.wind.speed,
            humidity: data.main.humidity,
            icon: data.weather[0].icon,
            iconDescription: data.weather[0].description,
        };
    }
    buildForecastArray(forecastData) {
        const dailyForecast = [];
        forecastData.forEach((dataPoint) => {
            const nonISODate = new Date(dataPoint.dt * 1000);
            const hours = nonISODate.getUTCHours();
            const date = nonISODate.toDateString();
            if (hours === 18) {
                dailyForecast.push({
                    date: date,
                    icon: dataPoint.weather[0].icon,
                    iconDescription: dataPoint.weather[0].description,
                    tempF: Math.round(dataPoint.main.temp),
                    windSpeed: dataPoint.wind.speed,
                    humidity: dataPoint.main.humidity,
                });
            }
        });
        return dailyForecast;
    }
    async getWeatherForCity(city) {
        try {
            console.log("Fetching weather for city:", city);
            const coordinates = await this.fetchLocationData(city);
            console.log("Coordinates for the fetch request:", coordinates);
            const { currentWeather, forecastArray } = await this.fetchWeatherData(coordinates);
            if (!currentWeather) {
                throw new Error("Current weather data is undefined.");
            }
            console.log("Parsed current weather:", this.parseCurrentWeather(currentWeather));
            console.log("Parsed forecast array:", forecastArray);
            return {
                currentWeather: this.parseCurrentWeather(currentWeather),
                forecast: forecastArray,
            };
        }
        catch (error) {
            console.error("Error in getWeatherForCity:", error);
            throw new Error("Unable to get weather for the specified city.");
        }
    }
}
export default new WeatherService();
