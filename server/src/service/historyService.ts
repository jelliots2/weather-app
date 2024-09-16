// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
import { promises as fs } from 'fs';
import path from 'path';

const historyFilePath = path.join(__dirname, '../data/searchHistory.json');

class HistoryService {
  // Helper method to read the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(historyFilePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      // If the file doesn't exist, return an empty array
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // Helper method to write updated cities array to searchHistory.json
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(historyFilePath, JSON.stringify(cities, null, 2), 'utf-8');
  }

  // Get all cities from the search history
  public async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Add a city to the search history
  public async addCity(cityName: string): Promise<void> {
    const cities = await this.read();

    // Create a new city with a unique id (you can use any method to generate unique ids, like UUID)
    const newCity = new City((Date.now()).toString(), cityName);

    cities.push(newCity);
    await this.write(cities);
  }

  // Remove a city from the search history by id
  public async removeCity(id: string): Promise<boolean> {
    const cities = await this.read();
    const filteredCities = cities.filter(city => city.id !== id);

    if (filteredCities.length === cities.length) {
      return false; // No city was removed (id not found)
    }


