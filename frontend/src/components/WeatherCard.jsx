import React from "react";

function WeatherCard({ day }) {
  // Helper to get a shorter day name
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="forecast-card">
      <h4>{getDayName(day.datetime)}</h4>
      <p>
        <strong>{day.temp}°C</strong>
      </p>
      <p>{day.conditions}</p>
      <p>💧 {day.precip}%</p>
    </div>
  );
}

export default WeatherCard;
