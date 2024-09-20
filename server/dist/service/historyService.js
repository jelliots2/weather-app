import { promises as fs } from 'fs';
// import path from 'path';
// TODO: Define a City class with name and id properties
class City {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
// const __dirname = path.resolve();
// TODO: Complete the HistoryService class
class HistoryService {
    constructor() {
        // private filePath = path.join(__dirname, 'searchHistory.json');
        this.filePath = 'db/searchHistory.json';
    }
    // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error("Error reading searchHistory.json:", error);
            return [];
        }
    }
    // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        try {
            const data = JSON.stringify(cities, null, 2);
            await fs.writeFile(this.filePath, data, 'utf-8');
        }
        catch (error) {
            console.error("Error writing to searchHistory.json:", error);
        }
    }
    // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return await this.read();
    }
    // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(cityName) {
        const cities = await this.read();
        const newCity = new City((cities.length + 1).toString(), cityName);
        cities.push(newCity);
        await this.write(cities);
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        let cities = await this.read();
        cities = cities.filter(city => city.id !== id);
        await this.write(cities);
    }
}
export default new HistoryService();
