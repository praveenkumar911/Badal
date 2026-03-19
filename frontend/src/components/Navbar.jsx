import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from "./icons/RCTS.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('');
  const navigate = useNavigate();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/badal");
  };
   
  return (
    <nav className="nav">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="hamburger" onClick={handleMobileMenuToggle}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        <Link
          to="/ngos"
          className={`menu-item ${activeMenuItem === 'ngo' ? 'menu-item-active' : ''}`}
          onClick={() => handleMenuItemClick('ngo')}
        >
          NGO
        </Link>
        <Link
          to="/teams"
          className={`menu-item ${activeMenuItem === 'teams' ? 'menu-item-active' : ''}`}
          onClick={() => handleMenuItemClick('teams')}
        >
          Teams
        </Link>
        <Link
          to="/companies"
          className={`menu-item ${activeMenuItem === 'companies' ? 'menu-item-active' : ''}`}
          onClick={() => handleMenuItemClick('companies')}
        >
          Companies
        </Link>
        <Link
          to="/projects"
          className={`menu-item ${activeMenuItem === 'projects' ? 'menu-item-active' : ''}`}
          onClick={() => handleMenuItemClick('projects')}
        >
          Projects
        </Link>
        <Link
          to="/dashboard"
          className={`menu-item ${activeMenuItem === 'dashboard' ? 'menu-item-active' : ''}`}
          onClick={() => handleMenuItemClick('dashboard')}
        >
          Dashboard
        </Link>
        <Link
          to="/profile"
          className={`menu-item ${activeMenuItem === 'profile' ? 'menu-item-active' : ''}`}
          onClick={() => handleMenuItemClick('profile')}
        >
          <FontAwesomeIcon icon={faUser} />
        </Link>
        <div
          className={`menu-item ${activeMenuItem === 'logout' ? 'menu-item-active' : ''}`}
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
