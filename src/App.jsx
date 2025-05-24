import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';
import IdentifyPage from './pages/IdentifyPage';
import MapPage from './pages/MapPage';
import WasteDashboard from './pages/ReportPage';
import Navbar from './components/Main/Navbar';
import Footer from './components/Main/Footer';
import ChatBot from './components/ChatBot/ChatBot';
import { ToastContainer } from 'react-toastify';

// Main function to render all components
function App() {
  return (
    <Router>
      <div className="app-wrapper">
        {/* Ensure navigation bar is on every page */}
        <Navbar />
        
        <div className="page-wrapper">
          {/* Properly set routes to pages */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/identify" element={<IdentifyPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/report" element={<WasteDashboard />} />
          </Routes>
        </div>
        {/* Control Duration of pop up message */}
        <ToastContainer position="top-center" autoClose={5000} />
        {/* Add ChatBot component */}
        <ChatBot />
        {/* Ensure citation details is on every page */}
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;