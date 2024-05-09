import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function PatientDetail() {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Extract id from URL parameters

  useEffect(() => {
    console.log(id); // Check if id is defined
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/patients/${id}/detail`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient details');
        }
        const data = await response.json();
        setPatient(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:8000/patients/${id}/appointments`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        setError(error.message);
      }
    };

    if (id) {
      fetchPatientData();
      fetchAppointments(); // Call fetchAppointments here
    }
  }, [id]); // Ensure the useEffect runs when id changes

  if (!patient) {
    return <div>Patient not found.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Patient Details</h2>
      <p>Name: {patient.name}</p>
      <p>Email: {patient.email}</p>
      <p>Phone: {patient.phone}</p>

      <h3>Appointments</h3>
      {appointments.length > 0 ? (
        <ul>
          {appointments.map(appointment => (
            <li key={appointment.id}>
              {appointment.date} - {appointment.time}
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments scheduled.</p>
      )}

      <Link to="/patients">Back to Patient List</Link>
    </div>
  );
}

export default PatientDetail;
