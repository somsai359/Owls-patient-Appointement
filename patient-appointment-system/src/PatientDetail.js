import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/patients/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch patient details');
        }
        return response.json();
      })
      .then(data => {
        setPatient(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  return (
    <div>
      <h2>Patient Detail</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <p>Name: {patient.name}</p>
          <p>Mobile: {patient.mobile}</p>
          <p>Email: {patient.email}</p>
          {/* Display appointments here */}
        </div>
      )}
    </div>
  );
}

export default PatientDetail;
