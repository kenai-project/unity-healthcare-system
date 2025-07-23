
import React, { useState } from 'react';
import api from '../api';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    // Updated regex to allow valid emails like test@gmail.com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) newErrors.role = 'Please select an account type';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
const response = await api.post('/auth/register', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });

        if (response.status === 201 || response.status === 200) {
          alert('Registration successful! Please login with your credentials.');
          window.location.href = '/login';
        } else if (response.status === 400) {
          setErrors({ form: response.data.message || 'Email is already registered' });
        } else {
          setErrors({ form: response.data.message || 'Registration failed' });
        }
      } catch (error) {
        setErrors({ form: error.response?.data?.message || 'Server error. Please try again later.' });
      }
    }
  };

  return (
    <section className="page active" id="registerPage">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Your Account</h2>
          <form onSubmit={handleSubmit} id="registerForm">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="registerFirstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="registerFirstName"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="registerLastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="registerLastName"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="registerEmail" className="form-label">Email Address</label>
              <input
                type="email"
                id="registerEmail"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="registerPassword" className="form-label">Password</label>
              <input
                type="password"
                id="registerPassword"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="registerConfirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="registerConfirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="registerRole" className="form-label">Account Type</label>
              <select
                id="registerRole"
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
              {errors.role && <div className="error-message">{errors.role}</div>}
            </div>
            <div className="form-group">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="acceptTerms">I agree to the Terms & Conditions</label>
              </div>
              {errors.acceptTerms && <div className="error-message">{errors.acceptTerms}</div>}
            </div>
            <button type="submit" className="btn btn--primary btn--full-width">Register</button>
          </form>
          <div className="auth-links">
            <p>Already have an account? <a href="/login">Login here</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}
