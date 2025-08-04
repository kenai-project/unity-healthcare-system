
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function Profile() {
  const { currentUser, token, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await api.put(`/users/${currentUser.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      if (res.status === 200) {
        setMessage('Profile updated successfully');
        login({ ...currentUser, ...res.data }, token);
      } else {
        setMessage('Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.oldPassword) newErrors.oldPassword = 'Old password is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await api.put(`/users/${currentUser.id}/password`, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      if (res.status === 200) {
        setMessage('Password changed successfully');
        setFormData(prev => ({
          ...prev,
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        setMessage('Failed to change password');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  if (!currentUser) {
    return <p>Please login to view your profile.</p>;
  }

  return (
    <section>
      <h2>Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleProfileSubmit}>
        <h3>Profile Information</h3>
        <label>
          First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <span>{errors.firstName}</span>}
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <span>{errors.lastName}</span>}
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span>{errors.email}</span>}
        </label>
        <button type="submit">Save Profile</button>
      </form>

      <form onSubmit={handlePasswordSubmit}>
        <h3>Change Password</h3>
        <label>
          Old Password:
          <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
          {errors.oldPassword && <span>{errors.oldPassword}</span>}
        </label>
        <label>
          New Password:
          <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
          {errors.newPassword && <span>{errors.newPassword}</span>}
        </label>
        <label>
          Confirm New Password:
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </label>
        <button type="submit">Change Password</button>
      </form>
    </section>
  );
}
