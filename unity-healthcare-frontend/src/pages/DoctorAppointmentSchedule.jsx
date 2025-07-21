import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function DoctorAppointmentSchedule() {
  const { user, token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'doctor') return;

    fetch(`/api/doctor/${user.id}/appointments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching appointments:', err);
        setLoading(false);
      });
  }, [user, token]);

  if (!user || user.role !== 'doctor') {
    return <p>Access denied. This page is for doctors only.</p>;
  }

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  return (
    <section>
      <h2>Doctor Appointment Schedule</h2>
      {appointments.length === 0 ? (
        <p>No appointments scheduled.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Patient</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt.id}>
                <td>{new Date(apt.appointment_time).toLocaleString()}</td>
                <td>{apt.patient_first_name} {apt.patient_last_name}</td>
                <td>{apt.status}</td>
                <td>{apt.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
