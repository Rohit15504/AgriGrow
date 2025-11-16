import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = 8000;

// --- Middleware ---
app.use(cors()); // Allow requests from your React frontend
app.use(express.json()); // Allow server to read JSON from requests

// Define the base URL for your Python AI service
const AI_API_URL = "http://127.0.0.1:5000";

// --- API Routes ---

// 1. Crop Recommendation Route
app.post("/api/recommend-crop", async (req, res) => {
  try {
    // Forward the request body directly to the Flask server
    const response = await axios.post(`${AI_API_URL}/predict_crop`, req.body);
    // Send the response from Flask back to the React client
    res.json(response.data);
  } catch (error) {
    console.error("Error in /api/recommend-crop:", error.message);
    res.status(500).json({ error: "Error predicting crop" });
  }
});

// 2. Fertilizer Recommendation Route
app.post("/api/recommend-fertilizer", async (req, res) => {
  try {
    const response = await axios.post(
      `${AI_API_URL}/predict_fertilizer`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error in /api/recommend-fertilizer:", error.message);
    res.status(500).json({ error: "Error recommending fertilizer" });
  }
});

// 3. Crop Yield Prediction Route
app.post("/api/predict-yield", async (req, res) => {
  try {
    const response = await axios.post(`${AI_API_URL}/predict_yield`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Error in /api/predict-yield:", error.message);
    res.status(500).json({ error: "Error predicting yield" });
  }
});

// 4. Weather API Route
app.get("/api/weather", async (req, res) => {
  try {
    // Get the 'place' from the query (e.g., /api/weather?place=Seoul)
    const { place } = req.query;
    if (!place) {
      return res.status(400).json({ error: "Location (place) is required" });
    }

    const options = {
      method: "GET",
      url: "https://visual-crossing-weather.p.rapidapi.com/forecast",
      params: {
        aggregateHours: "24",
        location: place,
        contentType: "json",
        unitGroup: "metric",
        shortColumnNames: 0,
      },
      headers: {
        "X-RapidAPI-Key": process.env.WEATHER_API_KEY, // Get key from .env
        "X-RapidAPI-Host": "visual-crossing-weather.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const thisData = Object.values(response.data.locations)[0];

    // Send the clean weather data back to React
    res.json({
      location: thisData.address,
      values: thisData.values,
      currentWeather: thisData.values[0],
    });
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

// Helper route to get dropdown values from Flask
app.get("/api/dropdown-data", async (req, res) => {
  try {
    const response = await axios.get(`${AI_API_URL}/get_dropdown_data`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching dropdown data:", error.message);
    res.status(500).json({ error: "Error fetching dropdown data" });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(
    `[INFO] Node.js backend server running on http://127.0.0.1:${PORT}`
  );
  console.log(`[INFO] AI-Service API is expected at ${AI_API_URL}`);
});
