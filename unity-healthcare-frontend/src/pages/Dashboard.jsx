
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const [appointments, setAppointments] = useState({ current: [], history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        let response;
        if (currentUser.role === 'patient') {
          response = await api.get(`/appointments/my`);
        } else if (currentUser.role === 'doctor') {
          response = await api.get(`/appointments/doctor`);
        } else {
          setAppointments({ current: [], history: [] });
          setLoading(false);
          return;
        }

        if (response.status === 200) {
          const now = new Date();
          const currentApts = [];
          const historyApts = [];
          response.data.forEach(apt => {
            const aptDate = new Date(apt.date);
            if (apt.status === 'scheduled' && aptDate >= now) {
              currentApts.push(apt);
            } else {
              historyApts.push(apt);
            }
          });
          setAppointments({ current: currentApts, history: historyApts });
        } else {
          setAppointments({ current: [], history: [] });
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments({ current: [], history: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <section className="page active" id="dashboardPage">
        <div className="dashboard-container">
          <p>Please login to access dashboard.</p>
        </div>
      </section>
    );
  }

  if (currentUser.role === 'patient') {
    return (
      <section className="page active" id="dashboardPage">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2>Dashboard</h2>
            <div className="user-info">
              <span id="dashboardUserName">Welcome back, {currentUser.firstName}!</span>
              <span id="dashboardUserRole" className="user-role">Patient</span>
            </div>
          </div>
          <div>
            <h3>Current Appointments</h3>
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.current.length === 0 ? (
              <p>No current appointments.</p>
            ) : (
              <ul>
                {appointments.current.map(apt => (
                  <li key={apt.id}>
                    {apt.date} at {apt.time} with Dr. {apt.doctor_first_name} {apt.doctor_last_name} - {apt.reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3>Appointment History</h3>
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.history.length === 0 ? (
              <p>No past appointments.</p>
            ) : (
              <ul>
                {appointments.history.map(apt => (
                  <li key={apt.id}>
                    {apt.date} at {apt.time} with Dr. {apt.doctor_first_name} {apt.doctor_last_name} - {apt.reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <button onClick={() => window.location.href = '/book-appointment'}>Book New Appointment</button>
          </div>
        </div>
      </section>
    );
  } else if (currentUser.role === 'doctor') {
    return (
      <section className="page active" id="dashboardPage">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2>Dashboard</h2>
            <div className="user-info">
              <span id="dashboardUserName">Welcome back, Dr. {currentUser.lastName}!</span>
              <span id="dashboardUserRole" className="user-role">Doctor</span>
            </div>
          </div>
          <div>
            <h3>Upcoming Appointments</h3>
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.current.length === 0 ? (
              <p>No upcoming appointments.</p>
            ) : (
              <ul>
                {appointments.current.map(apt => (
                  <li key={apt.id}>
                    {apt.date} at {apt.time} with {apt.patient_first_name} {apt.patient_last_name} - {apt.reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3>Past Appointments</h3>
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.history.length === 0 ? (
              <p>No past appointments.</p>
            ) : (
              <ul>
                {appointments.history.map(apt => (
                  <li key={apt.id}>
                    {apt.date} at {apt.time} with {apt.patient_first_name} {apt.patient_last_name} - {apt.reason}
                    {apt.notes && <p>Notes: {apt.notes}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <button onClick={() => window.location.href = '/patient/logs'}>View Patient Logs</button>
          </div>
        </div>
      </section>
    );
  } else {
    return null;
  }
}
