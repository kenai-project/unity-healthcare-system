import React from 'react';

export default function Doctors({ doctors }) {
  return (
    <div className="doctors-grid" id="doctorsGrid">
      {doctors.map(doctor => (
        <div className="doctor-card" key={doctor.id}>
          <img src={doctor.image} alt={doctor.name} className="doctor-image" />
          <div className="doctor-info">
            <h3 className="doctor-name">{doctor.name}</h3>
            <p className="doctor-specialty">{doctor.specialization}</p>
            <p className="doctor-experience">{doctor.experience} experience</p>
          </div>
        </div>
      ))}
    </div>
  );
}
