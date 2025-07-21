import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function PatientLogs() {
  const { user, token } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'patient') return;

    fetch(`/api/patient/${user.id}/logs`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching patient logs:', err);
        setLoading(false);
      });
  }, [user, token]);

  if (!user || user.role !== 'patient') {
    return <p>Access denied. This page is for patients only.</p>;
  }

  if (loading) {
    return <p>Loading patient logs...</p>;
  }

  return (
    <section>
      <h2>Patient Appointment Logs</h2>
      {logs.length === 0 ? (
        <p>No appointment logs found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.appointment_time).toLocaleString()}</td>
                <td>{log.doctor_first_name} {log.doctor_last_name}</td>
                <td>{log.status}</td>
                <td>{log.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
