import { Router } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// TODO: POST Request with city name to retrieve weather data
router.post("/", (req, res) => {
  // TODO: GET weather data from city name
  const { cityName } = req.body;
  console.log(`city name: ${cityName}`);
  if (req.body) {
    WeatherService.getWeatherForCity(cityName)
      .then((weather) => {
        // Handle the weather data here
        // const weatherJsonString = JSON.stringify(weather);
        // Send the response or process the data
        res.json(weather);
      })
      .catch((error) => {
        // Handle any errors here
        res
          .status(500)
          .json({ error: `Failed to fetch weather data ${error.data}` });
      });
  }

  // TODO: save city to search history
  HistoryService.addCity(cityName);
});

// TODO: GET search history
router.get("/history", async (_req, res) => {
  try {
    const savedStates = await HistoryService.getCities();
    res.json(savedStates);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete("/history/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ msg: "City id is required" });
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: "City successfully removed from search history" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
