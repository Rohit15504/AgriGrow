import axios from "axios";

const api = axios.create({
  baseURL: "https://agrigrow-backend-v1zb.onrender.com/api",
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
