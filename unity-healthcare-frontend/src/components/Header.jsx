import React from 'react';

export default function Header({ currentUser, onLogout }) {
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

  return (
    <header className="header" id="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-hospital" aria-hidden="true"></i>
            <span>Unity Hospital</span>
          </div>
          <nav className="nav desktop-nav" aria-label="primary navigation">
            <a href="#home" className="nav-link" onClick={(e) => handleScroll(e, 'home')}>HOME</a>
            <a href="#services" className="nav-link" onClick={(e) => handleScroll(e, 'services')}>SERVICES</a>
            <a href="#about" className="nav-link" onClick={(e) => handleScroll(e, 'about')}>ABOUT US</a>
            <a href="#doctors" className="nav-link" onClick={(e) => handleScroll(e, 'doctors')}>DOCTORS</a>
            <a href="#contact" className="nav-link" onClick={(e) => handleScroll(e, 'contact')}>CONTACT US</a>
          </nav>
          <div className="auth-buttons" style={{ display: currentUser ? 'none' : 'flex' }}>
            <button className="btn btn--primary btn--sm" onClick={() => window.location.href = '/login'}>LOGIN</button>
            <button className="btn btn--primary btn--sm" onClick={() => window.location.href = '/register'}>REGISTRATION</button>
            <button className="btn btn--primary btn--sm" onClick={() => window.location.href = '/appointment'}>BOOK APPOINTMENT</button>
          </div>
          <div className="user-menu" style={{ display: currentUser ? 'flex' : 'none' }}>
            <button className="btn btn--outline btn--sm" onClick={() => window.location.href = '/dashboard'}>DASHBOARD</button>
            <button className="btn btn--secondary btn--sm" onClick={onLogout}>LOGOUT</button>
          </div>
          <button className="mobile-menu-toggle" id="mobileMenuToggle">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
