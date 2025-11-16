import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import CropRecommend from "./pages/CropRecommend";
import FertilizerRecommend from "./pages/FertilizerRecommend";
import YieldPredict from "./pages/YieldPredict";
import Weather from "./pages/Weather";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crop-recommend" element={<CropRecommend />} />
          <Route
            path="/fertilizer-recommend"
            element={<FertilizerRecommend />}
          />
          <Route path="/yield-predict" element={<YieldPredict />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
