import React, { useState, useEffect } from "react"; // Make sure to import useEffect
import { getWeather } from "../api";
import WeatherCard from "../components/WeatherCard";

function Weather() {
  // 1. State for the *active* search (what's being displayed)
  const [place, setPlace] = useState("New Delhi");
  // 2. State for what the user is *typing* in the box
  const [searchQuery, setSearchQuery] = useState("New Delhi");

  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // This function will be called to fetch data
  const fetchWeatherForPlace = async (location) => {
    setError(null);
    setWeatherData(null); // Clear old data
    if (!location) {
      setError("Please enter a location.");
      return;
    }
    try {
      const res = await getWeather(location);
      setWeatherData(res.data);
    } catch (err) {
      setError("Could not find location. Please try again.");
      console.error(err);
    }
  };

  // 3. Fetch data on initial component load
  useEffect(() => {
    fetchWeatherForPlace(place);
  }, []); // The empty array [] means this runs only ONCE when the page loads

  // 4. This function is for the search button click
  const handleSearchClick = () => {
    setPlace(searchQuery); // Set the "active" place
    fetchWeatherForPlace(searchQuery);
  };

  // 5. Allow pressing Enter to search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const today = weatherData?.currentWeather;
  const forecast = weatherData?.values?.slice(1, 8); // Next 7 days

  return (
    <div className="weather-page">
      <h1>☀️ Weather Forecast</h1>
      <div className="weather-search">
        <input
          type="text"
          value={searchQuery} // Input box uses the temporary query state
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress} // Add Enter key functionality
          placeholder="Enter city or zip code"
        />
        <button onClick={handleSearchClick}>Search</button>
      </div>

      {error && (
        <div
          className="error-box"
          style={{ maxWidth: "400px", margin: "auto" }}
        >
          {error}
        </div>
      )}

      {weatherData && (
        <>
          <div className="today-weather">
            <h2>Today's Weather in {weatherData.location}</h2>
            <div className="today-weather-details">
              <p>
                <strong>Temperature:</strong> {today.temp}°C
              </p>
              <p>
                <strong>Feels Like:</strong> {today.feelslike}°C
              </p>
              <p>
                <strong>Conditions:</strong> {today.conditions}
              </p>
              <p>
                <strong>Humidity:</strong> {today.humidity}%
              </p>
              <p>
                <strong>Precipitation:</strong> {today.precip}%
              </p>
              <p>
                <strong>Wind Speed:</strong> {today.wspd} km/h
              </p>
            </div>
          </div>

          <h3>Next 7-Day Forecast</h3>
          <div className="forecast-container">
            {forecast.map((day) => (
              <WeatherCard key={day.datetime} day={day} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Weather;
