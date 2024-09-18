import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object

// this is what your weather class is
// dayjs is an npm library for dates
interface IWeather {
    city: string;
    date: Dayjs | string;
    tempF: number;
    windSpeed: number; //response.wind.speed,
    humidity: number;
    icon: string;
    iconDescription: string;
}

class Weather implements IWeather {
    constructor(
        city: string,
        date: Dayjs | string, //MM/DD/YYYY 
        tempF: number,
        windSpeed: number,
        humidity: number,
        icon: string,
        iconDescription: string
    ) {
        this.city = city;
    }
}

interface WeatherService {
    getWeatherForCity(city: string): Weather[]; //this is an async function
}

// NOTE - the route returns the Weather[] 

const result = [];


const filteredDays = result.filter((day) => {
    return day.date.contains("12:00")
})

const weatherArr = filteredDays.map((day) => {
    return new Weather(
        this.day.cityName
    )
})
    async getWeatherForCity(city: string) {
        
    }


export default new WeatherService();
