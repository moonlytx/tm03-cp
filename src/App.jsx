import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Walkthrough from './pages/WalkthroughPage';
import IdentifyPage from './pages/IdentifyPage';
import MapPage from './pages/MapPage';
import WasteDashboard from './pages/ReportPage';
import Navbar from './components/Main/Navbar';
import Footer from './components/Main/Footer';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        
        <div className="page-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/walkthrough" element={<Walkthrough />} />
            <Route path="/identify" element={<IdentifyPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/report" element={<WasteDashboard />} />
          </Routes>
        </div>
        {/* Control Duration of pop up message */}
        <ToastContainer position="top-center" autoClose={5000} />
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;