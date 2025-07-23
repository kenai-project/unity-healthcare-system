
import React, { useState, useEffect, useContext } from 'react';
import { hospitalData } from '../data/hospital';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Appointment() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  const [departments, setDepartments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    setDepartments(hospitalData.departments);
    setTimeSlots(hospitalData.timeSlots);

    // Fetch doctors list from backend
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/users/doctors');
        if (response.status === 200) {
          setDoctors(response.data);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      const response = await api.post('/appointments/book', {
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        notes: formData.notes
      });
      if (response.status === 201 || response.status === 200) {
        alert('Appointment booked successfully!');
        navigate('/patient/logs');
      } else {
        alert('Failed to book appointment.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Error booking appointment.');
    }
  };

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="appointment-container">
        <div className="appointment-card">
          <h2>Book Your Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="doctorId">Select Doctor</label>
                <select
                  id="doctorId"
                  name="doctorId"
                  className="form-control"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Appointment Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Appointment Time</label>
                <select
                  id="time"
                  name="time"
                  className="form-control"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Time</option>
                  {timeSlots.map((time, idx) => (
                    <option key={idx} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reason">Purpose of Appointment</label>
              <textarea
                id="reason"
                name="reason"
                className="form-control"
                rows="3"
                placeholder="Please describe your medical concern or reason for visit"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                rows="2"
                placeholder="Any additional information or special requests"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn--primary btn--full-width">Book Appointment</button>
          </form>
        </div>
      </section>
    </main>
  );
}
