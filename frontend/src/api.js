import axios from "axios";

// Create an 'instance' of axios that points to our Node.js backend
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Your Node.js server address
});

// --- API Functions ---

// Fetch data for dropdowns
export const getDropdownData = () => api.get("/dropdown-data");

// Fetch weather data
export const getWeather = (place) => api.get(`/weather?place=${place}`);

// Send data to AI models
export const recommendCrop = (data) => api.post("/recommend-crop", data);
export const recommendFertilizer = (data) =>
  api.post("/recommend-fertilizer", data);
export const predictYield = (data) => api.post("/predict-yield", data);

export default api;
