
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
          <p style={{ color: 'black' }}>No current appointments.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Doctor Name</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.current.map((apt, index) => (
                    <tr key={apt.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(apt.date).toLocaleDateString()}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{apt.time}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{apt.doctor_first_name} {apt.doctor_last_name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{apt.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div>
          <h3 style={{ color: 'black' }}>Appointment History</h3>
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.history.length === 0 ? (
              <p style={{ color: 'black' }}>No past appointments.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'black', borderColor: '#333' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2', color: 'black', borderColor: '#333' }}>
                <th style={{ border: '1px solid #333', padding: '8px', color: 'black' }}>Date</th>
                <th style={{ border: '1px solid #333', padding: '8px', color: 'black' }}>Time</th>
                <th style={{ border: '1px solid #333', padding: '8px', color: 'black' }}>Doctor Name</th>
                <th style={{ border: '1px solid #333', padding: '8px', color: 'black' }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {appointments.history.map((apt, index) => (
                <tr key={apt.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9', color: 'black', borderColor: '#333' }}>
                  <td style={{ border: '1px solid #333', padding: '8px', color: 'black' }}>{new Date(apt.date).toLocaleDateString()}</td>
                  <td style={{ border: '1px solid #333', padding: '8px', color: 'black' }}>{apt.time}</td>
                  <td style={{ border: '1px solid #333', padding: '8px', color: 'black' }}>{apt.doctor_first_name} {apt.doctor_last_name}</td>
                  <td style={{ border: '1px solid #333', padding: '8px', color: 'black' }}>{apt.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <p style={{ color: 'black' }}>No upcoming appointments.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Patient Name</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Reason</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.current.map(apt => (
                    <tr key={apt.id}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(apt.date).toLocaleDateString()}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{apt.time}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{apt.patient_first_name} {apt.patient_last_name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{apt.reason}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{apt.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div>
            <h3>Past Appointments</h3>
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.history.length === 0 ? (
          <p style={{ color: 'black' }}>No past appointments.</p>
            ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'black' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2', color: 'black' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px', color: 'black' }}>Date</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', color: 'black' }}>Time</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', color: 'black' }}>Patient Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', color: 'black' }}>Reason</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', color: 'black' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {appointments.history.map((apt, index) => (
                <tr key={apt.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9', color: 'black' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: 'black' }}>{new Date(apt.date).toLocaleDateString()}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: 'black' }}>{apt.time}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: 'black' }}>{apt.patient_first_name} {apt.patient_last_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: 'black' }}>{apt.reason}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: 'black' }}>{apt.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
            )}
          </div>
          <div>
          <button style={{ color: 'black' }} onClick={() => window.location.href = '/patient/logs'}>View Patient Logs</button>
          </div>
        </div>
      </section>
    );
  } else {
    return null;
  }
}
