import React, { useState, useEffect } from 'react';
import { hospitalData } from '../data/hospital';

export default function Appointment() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',
    date: '',
    time: '',
    purpose: '',
    notes: ''
  });

  const [departments, setDepartments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    setDepartments(hospitalData.departments);
    setTimeSlots(hospitalData.timeSlots);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="appointment-container">
        <div className="appointment-card">
          <h2>Book Your Appointment</h2>
          <form>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  className="form-control"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept}>{dept}</option>
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
              <label htmlFor="purpose">Purpose of Appointment</label>
              <textarea
                id="purpose"
                name="purpose"
                className="form-control"
                rows="3"
                placeholder="Please describe your medical concern or reason for visit"
                value={formData.purpose}
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
