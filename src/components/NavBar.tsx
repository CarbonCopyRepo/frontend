import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="navbar-brand" href="#">
          <img
            id="navbar_logo"
            src="images/favicon.svg"
            style={{ height: '30px', width: 'auto' }}
            alt="Logo"
          />
        </a>
        <h2 style={{ color: 'white' }}>EVI Hub</h2>

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
              <Link to="/emissions" className="nav-link">
                Emissions
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
