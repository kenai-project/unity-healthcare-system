import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleScroll = (e, id) => {
    e.preventDefault();
    // If not on home page, navigate to home first
    if (window.location.pathname !== '/') {
      window.location.href = '/#' + id;
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const top = section.offsetTop - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header" id="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-link">
              <i className="fas fa-hospital" aria-hidden="true"></i>
              <span>Unity Hospital</span>
            </Link>
          </div>
          <nav className="nav desktop-nav" aria-label="primary navigation">
            <a href="#home" className="nav-link" onClick={(e) => handleScroll(e, 'home')}>HOME</a>
            <a href="#services" className="nav-link" onClick={(e) => handleScroll(e, 'services')}>SERVICES</a>
            <a href="#about" className="nav-link" onClick={(e) => handleScroll(e, 'about')}>ABOUT US</a>
            <a href="#doctors" className="nav-link" onClick={(e) => handleScroll(e, 'doctors')}>DOCTORS</a>
            <a href="#contact" className="nav-link" onClick={(e) => handleScroll(e, 'contact')}>CONTACT US</a>
          </nav>
          <div className="auth-buttons" style={{ display: currentUser ? 'none' : 'flex' }}>
            <button className="btn btn--primary btn--sm" onClick={() => navigate('/login')}>LOGIN</button>
            <button className="btn btn--primary btn--sm" onClick={() => navigate('/register')}>REGISTRATION</button>
            <button
              className="btn btn--primary btn--sm"
              onClick={() => {
                if (currentUser) {
                  navigate('/appointment');
                } else {
                  navigate('/login');
                  // Optionally, show a toast notification here to inform user to login first
                }
              }}
            >
              BOOK APPOINTMENT
            </button>
          </div>
          <div className="user-menu" style={{ display: currentUser ? 'flex' : 'none' }}>
            <button className="btn btn--primary btn--sm" onClick={() => navigate('/dashboard')}>DASHBOARD</button>
            <button className="btn btn--primary btn--sm" onClick={() => navigate('/appointment')}>BOOK APPOINTMENT</button>
            <button className="btn btn--danger btn--sm" onClick={handleLogout}>LOGOUT</button>
          </div>
          <button className="mobile-menu-toggle" id="mobileMenuToggle">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
