import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';

import NavBar from './components/NavBar';
import AnalyticsPage from './routes/Analytics';
import HomePage from './routes/HomePage';
import Emissions from './routes/Emissions';

import type { Position } from './types/types';

import './App.css';

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
          <Route path="/emissions" element={<Emissions />} />
        </Routes>
      </CoordinatesContext.Provider>
    </Router>
  );
}

export default App;
