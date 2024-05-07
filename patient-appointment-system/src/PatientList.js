import React, { useState, useEffect } from 'react';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/patients')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        return response.json();
      })
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Patient List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Search patients"
            value={searchTerm}
            onChange={handleSearch}
          />
          <ul>
            {filteredPatients.map(patient => (
              <li key={patient.id}>{patient.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PatientList;
