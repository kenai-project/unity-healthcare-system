import React from 'react';

export default function Dashboard({ currentUser }) {
  if (!currentUser) {
    return (
      <section className="page active" id="dashboardPage">
        <div className="dashboard-container">
          <p>Please login to access dashboard.</p>
        </div>
      </section>
    );
  }

  if (currentUser.role === 'patient') {
    return (
      <section className="page active" id="dashboardPage">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2>Dashboard</h2>
            <div className="user-info">
              <span id="dashboardUserName">Welcome back, {currentUser.firstName}!</span>
              <span id="dashboardUserRole" className="user-role">Patient</span>
            </div>
          </div>
          {/* Patient dashboard content can be added here */}
          <p>Patient dashboard content coming soon.</p>
        </div>
      </section>
    );
  } else if (currentUser.role === 'doctor') {
    return (
      <section className="page active" id="dashboardPage">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2>Dashboard</h2>
            <div className="user-info">
              <span id="dashboardUserName">Welcome back, Dr. {currentUser.lastName}!</span>
              <span id="dashboardUserRole" className="user-role">Doctor</span>
            </div>
          </div>
          {/* Doctor dashboard content can be added here */}
          <p>Doctor dashboard content coming soon.</p>
        </div>
      </section>
    );
  } else {
    return null;
  }
}
