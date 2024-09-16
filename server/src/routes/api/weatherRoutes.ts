import { Router, Request, Response } from 'express';
const router = Router();

// Import the services
import WeatherService from '../../service/weatherService';
import HistoryService from '../../service/historyService';

// POST request to retrieve weather data based on city name
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ message: 'City name is required' });
    }

    // Get weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Save the city to search history
    await HistoryService.saveCity(city);

    // Return the weather data
    return res.status(200).json(weatherData);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch weather data', error });
  }
});

// GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getHistory();
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch search history', error });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await HistoryService.deleteCityById(id);

    if (!deleted) {
      return res.status(404).json({ message: 'City not found in history' });
    }

    return res.status(200).json({ message: 'City deleted from history' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete city from history', error });
  }
});

export default router;
