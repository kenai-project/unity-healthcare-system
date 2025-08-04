
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function DoctorAppointmentSchedule() {
  const { currentUser } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'doctor') return;

    const fetchAppointments = async () => {
      try {
        const response = await api.get(`/appointments/doctor`);
        if (response.status === 200) {
          setAppointments(response.data);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser]);

  if (!currentUser || currentUser.role !== 'doctor') {
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
