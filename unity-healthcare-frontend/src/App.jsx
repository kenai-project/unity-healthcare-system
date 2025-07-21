import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Appointment from './pages/Appointment';
import Dashboard from './pages/Dashboard';
import './style.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('unityHospital_session'));
    if (session && session.userId) {
      const users = JSON.parse(localStorage.getItem('unityHospital_users')) || [];
      const user = users.find(u => u.id === session.userId);
      if (user) {
        setCurrentUser(user);
      }
    }
  }, []);

  // Update localStorage session on currentUser change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('unityHospital_session', JSON.stringify({ userId: currentUser.id }));
    } else {
      localStorage.setItem('unityHospital_session', JSON.stringify(null));
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointment" element={<Appointment currentUser={currentUser} />} />
        <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
