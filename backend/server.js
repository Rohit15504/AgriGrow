import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
const upload = multer();
dotenv.config();

const app = express();
// UPDATED: Allow Render to inject its own port
const PORT = process.env.PORT || 8000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Hugging Face API URL
const AI_API_URL = "https://rohit7457-agrigrow-ai.hf.space";

// --- API Routes ---

// 1. Crop Recommendation Route
app.post("/api/recommend-crop", async (req, res) => {
  try {
    const response = await axios.post(`${AI_API_URL}/predict_crop`, req.body);
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
      req.body,
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
        "X-RapidAPI-Key": process.env.WEATHER_API_KEY, // Set this in Render!
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

//5. Crop Disease Detection
app.post("/api/predict-disease", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    // Convert the buffer to a Blob for axios to send as multipart/form-data
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append("file", blob, req.file.originalname);

    const response = await axios.post(
      `${AI_API_URL}/predict_disease`,
      formData,
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error in disease prediction:", error.message);
    res.status(500).json({ error: "Error detecting disease" });
  }
});

//6. ChatBot - Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure this key is added in your Render Environment Variables!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // We give the bot a "System Instruction" to act as an AgriGrow expert
    const prompt = `You are AgriGrow AI, a professional agricultural assistant. 
    Provide concise, helpful advice to farmers about crops, fertilizers, and plant health.
    User asks: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Chatbot is currently offline." });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`[INFO] Node.js backend server running on port ${PORT}`);
  console.log(`[INFO] AI-Service API is expected at ${AI_API_URL}`);
});
