import { Router } from 'express';
const router = Router();
// Import services
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// POST Request with cityName name to retrieve weather data
router.post('/', async (req, res) => {
    const { cityName } = req.body;
    console.log(cityName);
    try {
        // Validate cityName input
        if (!cityName) {
            return res.status(400).json({
                success: false,
                message: 'cityName name is required',
            });
        }
        // GET weather data from cityName name
        const weatherData = await WeatherService.getWeatherForCity(cityName);
        // Save cityName to search history
        await HistoryService.addCity(cityName);
        // Send back the weather data
        return res.status(200).json({
            success: true,
            weatherData,
        });
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve weather data',
        });
    }
});
// GET search history
router.get('/history', async (_, res) => {
    try {
        const cities = await HistoryService.getCities();
        return res.status(200).json({
            success: true,
            cities,
        });
    }
    catch (error) {
        console.error('Error fetching search history:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve search history',
        });
    }
});
// DELETE cityName from search history
router.delete('/history/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await HistoryService.removeCity(id);
        return res.status(200).json({
            success: true,
            message: `cityName with ID ${id} removed from history`,
        });
    }
    catch (error) {
        console.error('Error deleting cityName from history:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete cityName from history',
        });
    }
});
export default router;
