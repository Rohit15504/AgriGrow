import React, { useState, useEffect } from "react";
import { recommendFertilizer, getDropdownData } from "../api";

function FertilizerRecommend() {
  const [formData, setFormData] = useState({
    Temperature: "",
    Humidity: "",
    Moisture: "",
    Soil_Type: "",
    Crop_Type: "",
    Nitrogen: "",
    Potassium: "",
    Phosphorous: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [soilTypes, setSoilTypes] = useState([]);
  const [cropTypes, setCropTypes] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const res = await getDropdownData();
        setSoilTypes(res.data.fert_soil_types);
        setCropTypes(res.data.fert_crop_types);
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      }
    };
    fetchDropdowns();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const res = await recommendFertilizer(formData);
      setResult(res.data.prediction_text);
    } catch (err) {
      setError("An error occurred. Please check your inputs.");
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1>🧪 Fertilizer Recommendation</h1>
      <p className="page-description">
        Provide your farm's conditions to get an intelligent fertilizer
        recommendation.
      </p>
      <form className="form" onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="form-group">
          <label>Temperature (°C):</label>
          <input
            type="number"
            name="Temperature"
            placeholder="e.g., 26"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Humidity (%):</label>
          <input
            type="number"
            name="Humidity"
            placeholder="e.g., 52"
            onChange={handleChange}
            required
          />
        </div>
        {/* Row 2 */}
        <div className="form-group">
          <label>Moisture (%):</label>
          <input
            type="number"
            name="Moisture"
            placeholder="e.g., 38"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nitrogen (N) (kg/ha):</label>
          <input
            type="number"
            name="Nitrogen"
            placeholder="e.g., 37"
            onChange={handleChange}
            required
          />
        </div>
        {/* Row 3 */}
        <div className="form-group">
          <label>Potassium (K) (kg/ha):</label>
          <input
            type="number"
            name="Potassium"
            placeholder="e.g., 0"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phosphorous (P) (kg/ha):</label>
          <input
            type="number"
            name="Phosphorous"
            placeholder="e.g., 0"
            onChange={handleChange}
            required
          />
        </div>
        {/* Row 4 - Dropdowns */}
        <div className="form-group">
          <label>Soil Type:</label>
          <select name="Soil_Type" onChange={handleChange} required>
            <option value="">-- Select Soil --</option>
            {soilTypes.map((soil) => (
              <option key={soil} value={soil}>
                {soil}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Crop Type:</label>
          <select name="Crop_Type" onChange={handleChange} required>
            <option value="">-- Select Crop --</option>
            {cropTypes.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="form-button">
          Recommend Fertilizer
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}
      {result && (
        <div className="result-box result-box-success">
          <p>Recommended Fertilizer:</p>
          <h2>{result}</h2>
        </div>
      )}
    </div>
  );
}

export default FertilizerRecommend;
