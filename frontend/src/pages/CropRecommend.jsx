import React, { useState } from "react";
import { recommendCrop } from "../api";

function CropRecommend() {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const res = await recommendCrop(formData);
      setResult(res.data.prediction_text);
    } catch (err) {
      setError("An error occurred. Please check your inputs.");
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1>🌱 Crop Recommendation</h1>
      <p className="page-description">
        Enter your soil and environmental parameters to receive a tailored crop
        suggestion.
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nitrogen (N) (kg/ha):</label>
          <input
            type="number"
            name="N"
            placeholder="e.g., 90"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phosphorous (P) (kg/ha):</label>
          <input
            type="number"
            name="P"
            placeholder="e.g., 42"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Potassium (K) (kg/ha):</label>
          <input
            type="number"
            name="K"
            placeholder="e.g., 43"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Temperature (°C):</label>
          <input
            type="number"
            step="any"
            name="temperature"
            placeholder="e.g., 20.8"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Humidity (%):</label>
          <input
            type="number"
            step="any"
            name="humidity"
            placeholder="e.g., 82.1"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>pH Value:</label>
          <input
            type="number"
            step="any"
            name="ph"
            placeholder="e.g., 6.5"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Rainfall (mm):</label>
          <input
            type="number"
            step="any"
            name="rainfall"
            placeholder="e.g., 202.9"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="form-button"
          style={{ gridColumn: "1 / -1" }}
        >
          Recommend Crop
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}
      {result && (
        <div className="result-box result-box-success">
          <p>Recommended Crop:</p>
          <h2>{result}</h2>
        </div>
      )}
    </div>
  );
}

export default CropRecommend;
