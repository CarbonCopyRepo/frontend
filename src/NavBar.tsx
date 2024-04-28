import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="#">
          <img
            id="navbar_logo"
            src="images/favicon.svg"
            style={{ height: '30px', width: 'auto' }}
            alt="Logo"
          />
        </a>

        <div className="links" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/analytics" className="nav-link">
                Analytics
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/forecasts" className="nav-link">
                Forecasts
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
