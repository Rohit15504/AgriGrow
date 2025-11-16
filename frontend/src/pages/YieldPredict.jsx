import React, { useState, useEffect } from "react";
import { predictYield, getDropdownData } from "../api";

function YieldPredict() {
  const [formData, setFormData] = useState({
    Crop_Year: "",
    Season: "",
    Crop: "",
    Area: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [seasons, setSeasons] = useState([]);
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const res = await getDropdownData();
        setSeasons(res.data.yield_seasons);
        setCrops(res.data.yield_crops);
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
      const res = await predictYield(formData);
      setResult(res.data);
    } catch (err) {
      setError("An error occurred. Please check your inputs.");
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1>🌾 Crop Yield Prediction</h1>
      <p className="page-description">
        Enter your crop, season, and area to get an accurate prediction of your
        potential yield.
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Crop Year:</label>
          <input
            type="number"
            name="Crop_Year"
            placeholder="e.g., 2012"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Area (Hectares):</label>
          <input
            type="number"
            step="any"
            name="Area"
            placeholder="e.g., 100"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Season:</label>
          <select name="Season" onChange={handleChange} required>
            <option value="">-- Select Season --</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Crop:</label>
          <select name="Crop" onChange={handleChange} required>
            <option value="">-- Select Crop --</option>
            {crops.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="form-button">
          Predict Yield
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}
      {result && (
        <div className="result-box result-box-success">
          <p>Estimated Total Production:</p>
          <h2>{result.total_production}</h2>
          <p style={{ marginTop: "1rem" }}>Estimated Yield per Hectare:</p>
          <h2>{result.yield_per_hectare}</h2>
        </div>
      )}
    </div>
  );
}

export default YieldPredict;
