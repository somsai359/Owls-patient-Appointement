import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios library

function PatientDetail() {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Extract id from URL parameters

  useEffect(() => {
    if (id) {
      const fetchPatientData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/patients/${id}/detail`);
          setPatient(response.data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

      const fetchAppointments = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/patients/${id}/appointments`);
          setAppointments(response.data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchPatientData();
      fetchAppointments();
    }
  }, [id]);

  if (!id) {
    return <div>No patient ID provided.</div>;
  }

  if (!patient) {
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
