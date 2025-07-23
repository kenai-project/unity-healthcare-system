import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Appointment from './pages/Appointment';
import Dashboard from './pages/Dashboard';
import DoctorAppointmentSchedule from './pages/DoctorAppointmentSchedule';
import PatientLogs from './pages/PatientLogs';
import Profile from './pages/Profile';
import NotAuthorized from './pages/NotAuthorized';
import './style.css';
import './custom-fixes.css';

import { AuthProvider } from './context/AuthProvider';
import { AuthContext } from './context/AuthContext';

function PrivateRoute({ children, role }) {
  const { currentUser } = React.useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/appointment"
            element={
              <PrivateRoute role="patient">
                <Appointment />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <PrivateRoute role="doctor">
                <DoctorAppointmentSchedule />
              </PrivateRoute>
            }
          />
          <Route
            path="/patient/logs"
            element={
              <PrivateRoute role="patient">
                <PatientLogs />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
