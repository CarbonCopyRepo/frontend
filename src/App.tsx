import './App.css';
import NavBar from './components/NavBar'; // Adjust path if different
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';
import type { Position } from './types/types';
import AnalyticsPage from './routes/Analytics';
import HomePage from './routes/HomePage';

const defaultPos: Position = { lat: 40.015, lng: -105.2705 };

export const CoordinatesContext = createContext(defaultPos);

function App() {
  const [coordinates, setCoordinates] = useState(defaultPos);

  return (
    <Router>
      <CoordinatesContext.Provider value={{ coordinates, setCoordinates }}>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </CoordinatesContext.Provider>
    </Router>
  );
}

export default App;
