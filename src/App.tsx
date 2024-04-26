import './App.css';
import NavBar from './NavBar'; // Adjust path if different
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnalyticsPage from './Analytics';
import HomePage from './HomePage';


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
