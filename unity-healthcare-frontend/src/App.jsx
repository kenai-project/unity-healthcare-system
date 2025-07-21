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
import './style.css';
import './custom-fixes.css';

import { AuthProvider } from './context/AuthProvider';
import { AuthContext } from './context/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser } = React.useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" replace />;
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
              <PrivateRoute>
                <Appointment />
              </PrivateRoute>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointmentSchedule />} />
          <Route path="/patient/logs" element={<PatientLogs />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
