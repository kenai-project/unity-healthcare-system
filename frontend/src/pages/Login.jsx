
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    staySignedIn: false,
    showPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleShowPassword = () => {
    setFormData(prev => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        if (response.status === 200) {
          const { token, user } = response.data;
          login(user, token);
          toast.success('Login successful!');
          navigate('/dashboard');
        } else {
          toast.error('Login failed. Please check your credentials.');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="page active" id="loginPage">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Login to Your Account</h2>
          <form onSubmit={handleSubmit} id="loginForm">
            <div className="form-group">
              <label htmlFor="loginEmail" className="form-label">Email Address</label>
              <input
                type="email"
                id="loginEmail"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <input
                type={formData.showPassword ? 'text' : 'password'}
                id="loginPassword"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '35px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '1.2rem',
                  color: '#333',
                }}
                aria-label={formData.showPassword ? 'Hide password' : 'Show password'}
              >
                {formData.showPassword ? '🙈' : '👁️'}
              </button>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            <div className="form-group">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="staySignedIn"
                  name="staySignedIn"
                  checked={formData.staySignedIn}
                  onChange={handleChange}
                />
                <label htmlFor="staySignedIn">Stay signed in</label>
              </div>
            </div>
            <button type="submit" className="btn btn--primary btn--full-width" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="auth-links">
            <p>Don't have an account? <a href="/register">Register here</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}
