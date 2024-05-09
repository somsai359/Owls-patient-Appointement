import React, { useState, useEffect } from 'react';
import CreateAppointmentForm from './CreateAppointmentForm';

function PatientDetail({ patient }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments for the current patient
    fetch(`http://localhost:8000/patients/${patient.id}/appointments`)
      .then(response => response.json())
      .then(data => setAppointments(data))
      .catch(error => console.error('Error fetching appointments:', error));
  }, [patient.id]);

  return (
    <div className="patient-detail">
      <h2>{patient.name}</h2>
      <p>Email: {patient.email}</p>
      <p>Phone: {patient.phone}</p>
      <h3>Appointments</h3>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment.id}>
            <p>Date and Time: {appointment.dateTime}</p>
            <p>Description: {appointment.description}</p>
          </li>
        ))}
      </ul>
      {/* Add appointment creation form here */}
      <CreateAppointmentForm patientId={patient.id} />
    </div>
  );
}

export default PatientDetail;
