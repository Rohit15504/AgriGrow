import React from "react";
import { Link } from "react-router-dom";

import cropImage from "../assets/crop_recommend.jpg";
import yieldImage from "../assets/yield.jpg";
import fertilizerImage from "../assets/fertilizer.jpeg";
import weatherImage from "../assets/weather.jpeg";
import diseaseImage from "../assets/disease.jpg";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Comprehensive Agricultural Solutions</h1>
        <p>
          Explore our cutting-edge tools designed to revolutionize your farming
          experience with AI-powered insights and predictions.
        </p>
      </div>

      <div className="card-container">
        {/* Crop Recommendation Card */}
        <Link to="/crop-recommend" className="card">
          <img
            src={cropImage}
            alt="Crop Recommendation"
            className="card-image"
          />
          <div className="card-content">
            <h2>Crop Recommendation</h2>
            <p>
              Find the best crop to cultivate based on your soil and weather
              conditions using advanced AI algorithms.
            </p>
            <span className="card-tag tag-ai">AI Powered</span>
          </div>
        </Link>

        {/* Yield Prediction Card */}
        <Link to="/yield-predict" className="card">
          <img
            src={yieldImage}
            alt="Crop Yield Prediction"
            className="card-image"
          />
          <div className="card-content">
            <h2>Yield Prediction</h2>
            <p>
              Predict the expected yield for different crops using advanced
              machine learning models and historical data.
            </p>
            <span className="card-tag tag-ml">ML Analytics</span>
          </div>
        </Link>

        {/* Fertilizer Recommendation Card */}
        <Link to="/fertilizer-recommend" className="card">
          <img
            src={fertilizerImage}
            alt="Fertilizer Recommendation"
            className="card-image"
          />
          <div className="card-content">
            <h2>Fertilizer Recommendation</h2>
            <p>
              Get smart fertilizer suggestions to optimize soil health and
              maximize your crop's nutritional intake.
            </p>
            <span className="card-tag tag-ai">AI Powered</span>
          </div>
        </Link>

        {/* Disease Prediction Card */}
        <Link to="/disease-predict" className="card">
          <img
            src={diseaseImage}
            alt="Disease Prediction"
            className="card-image"
          />
          <div className="card-content">
            <h2>Disease Detection</h2>
            <p>
              Upload leaf images to identify pests and diseases early before
              they spread.
            </p>
            <span className="card-tag tag-ai">CNN Powered</span>
          </div>
        </Link>

        {/* Weather Forecast Card */}
        <Link to="/weather" className="card">
          <img
            src={weatherImage}
            alt="Weather Forecast"
            className="card-image"
          />
          <div className="card-content">
            <h2>Weather Forecast</h2>
            <p>
              Check the current weather and 7-day forecast to plan your
              irrigation and farming activities effectively.
            </p>
            <span className="card-tag tag-weather">Real-Time Data</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
