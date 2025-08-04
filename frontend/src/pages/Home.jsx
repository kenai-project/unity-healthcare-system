import React from 'react';
import { hospitalData } from '../data/hospital';
import Doctors from '../components/Doctors';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <>
      {/* Add padding top to offset fixed header */}
      <div style={{ paddingTop: '80px' }}></div>
      <main>
        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="hero-bg"></div>
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Welcome to {hospitalData.hospitalInfo.name}</h1>
              <p className="hero-subtitle">
                Your Health, Our Priority - Providing exceptional healthcare services with advanced medical technology and compassionate care.
              </p>
              <div className="hero-buttons">
                {/* Buttons can be linked to appointment page */}
                <a href="/appointment" className="btn btn--primary btn--lg">Book Appointment</a>
                <a href="#about" className="btn btn--outline btn--lg">Learn More</a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services" id="services">
          <div className="container">
            <h2 className="section-title">Our Services</h2>
            <div className="services-grid">
              {hospitalData.hospitalInfo.services.map((service, index) => (
                <div className="service-card" key={index}>
                  <div className="service-icon">
                    {/* Icons can be mapped or hardcoded */}
                    <i className="fas fa-ambulance"></i>
                  </div>
                  <h3>{service}</h3>
                  <p>Description for {service}.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about" id="about">
          <div className="container">
            <h2 className="section-title">About {hospitalData.hospitalInfo.name}</h2>
            <div className="about-content">
              <div className="about-text">
                <p>Unity Hospital has been serving the community with excellence in healthcare for over two decades. We combine cutting-edge medical technology with compassionate care to provide the best possible treatment outcomes.</p>
                <p>Our mission is to deliver comprehensive healthcare services that meet the diverse needs of our patients while maintaining the highest standards of medical excellence and patient safety.</p>
              </div>
              <div className="about-stats">
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Emergency Care</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Expert Doctors</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Happy Patients</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section className="doctors-section" id="doctors">
          <div className="container">
            <h2 className="section-title">Our Medical Team</h2>
            <Doctors doctors={hospitalData.doctors} />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials">
          <div className="container">
            <h2 className="section-title">What Our Patients Say</h2>
            <Testimonials testimonials={hospitalData.testimonials} />
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact" id="contact">
          <div className="container">
            <h2 className="section-title">Contact Us</h2>
            <div className="contact-content">
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h4>Email</h4>
                    <p>{hospitalData.hospitalInfo.email}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <h4>Phone</h4>
                    <p>{hospitalData.hospitalInfo.phone}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <h4>Hours</h4>
                    <p>Mon-Sat: {hospitalData.hospitalInfo.hours.mondaySaturday}<br />Sun: {hospitalData.hospitalInfo.hours.sunday}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-calendar-alt"></i>
                  <div>
                    <h4>Appointment Hours</h4>
                    <p>{hospitalData.hospitalInfo.appointmentHours}</p>
                  </div>
                </div>
              </div>
              <div className="contact-form">
                <h3>Send us a Message</h3>
                <form>
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <input type="email" className="form-control" placeholder="Your Email" required />
                  </div>
                  <div className="form-group">
                    <textarea className="form-control" rows="5" placeholder="Your Message" required></textarea>
                  </div>
                  <button type="submit" className="btn btn--primary btn--full-width">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
