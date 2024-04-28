import './App.css';
import NavBar from './components/NavBar'; // Adjust path if different
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnalyticsPage from './routes/Analytics';
import HomePage from './routes/HomePage';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
