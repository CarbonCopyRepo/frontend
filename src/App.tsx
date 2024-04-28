// Import necessary modules and components
import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';
import type { Position } from './types/types';
import AnalyticsPage from './routes/Analytics';
import HomePage from './routes/HomePage';
import Forecasts from './routes/Forecasts';

// Define default coordinates
const defaultPos: Position = { lat: 40.015, lng: -105.2705 };

// Create CoordinatesContext
export const CoordinatesContext = createContext<{
  coordinates: Position;
  setCoordinates: React.Dispatch<{ lat: number; lng: number }>;
}>({ coordinates: defaultPos, setCoordinates: () => {} });

function App() {
  const [coordinates, setCoordinates] = useState(defaultPos);

  return (
    <Router>
      <CoordinatesContext.Provider value={{ coordinates, setCoordinates }}>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/forecasts" element={<Forecasts />} /> {/* Add the Forecasts route */}
        </Routes>
      </CoordinatesContext.Provider>
    </Router>
  );
}

export default App;
