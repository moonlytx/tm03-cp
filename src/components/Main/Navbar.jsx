import { Link } from 'react-router-dom';
import './Navbar.css';
import cpLogo from '../../assets/cp_logo.png';

// Navigation Bar at the top for all pages
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">
          {/* Put logo on and link to HomePage */}
          <Link to="/">
            <img src={cpLogo} alt="Carbon Patrol Logo" className="logo-image" />
          </Link>
        </div>
        <div className="nav-links">
          {/* Ensure all buttons are linked properly to their pages */}
          <Link to="/identify" className="nav-link">IDENTIFY</Link>
          <Link to="/map" className="nav-link">MAP</Link>
          <Link to="/report" className="nav-link">REPORT</Link>
          <Link to="/guide" className="nav-link">GUIDE</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;