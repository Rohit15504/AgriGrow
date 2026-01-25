import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Chatbot from "./components/Chatbot";

// Pages
import Dashboard from "./pages/Dashboard";
import CropRecommend from "./pages/CropRecommend";
import FertilizerRecommend from "./pages/FertilizerRecommend";
import YieldPredict from "./pages/YieldPredict";
import Weather from "./pages/Weather";
import DiseasePredict from "./pages/DiseasePredict";

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
          <Route path="/disease-predict" element={<DiseasePredict />} />
        </Routes>
      </main>

      <Chatbot />
    </div>
  );
}

export default App;
