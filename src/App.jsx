import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WasteDashboard from './pages/WasteDashboard';
import IdentifyPage from './pages/IdentifyPage';
import MapPage from './pages/MapPage';
import Navbar from './components/HomePage/Navbar';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        
        <div className="page-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<WasteDashboard />} />
            <Route path="/identify" element={<IdentifyPage />} />
            <Route path="/map" element={<MapPage />} />
          </Routes>
        </div>
        {/* Control Duration of pop up message */}
        <ToastContainer position="top-center" autoClose={5000} />
      </div>
    </Router>
  );
}

export default App;