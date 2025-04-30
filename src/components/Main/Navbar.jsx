import { Link } from 'react-router-dom';
import './Navbar.css';
import cpLogo from '../../assets/cp_logo.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">
          <Link to="/">
            <img src={cpLogo} alt="Carbon Patrol Logo" className="logo-image" />
          </Link>
        </div>
        <div className="nav-links">
        <Link to="/walkthrough" className="nav-link">WALKTHROUGH</Link>
          <Link to="/identify" className="nav-link">IDENTIFY</Link>
          <Link to="/map" className="nav-link">MAP</Link>
          <Link to="/report" className="nav-link">REPORT</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;