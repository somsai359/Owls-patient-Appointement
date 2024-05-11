import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PatientList.css';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/patients')
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.error('Error fetching patients:', error));
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="patient-list-container">
      {/* Background image container */}
      <div className="background-container">
        <img
          src="https://img.freepik.com/premium-vector/online-consultation-feedback-concept-laptop-with-picture-male-pharmacist-with-medicines-his-hand_531064-7428.jpg?w=900"
          alt="Background"
          className="background-image"
        />
      </div>

      {/* Search input field */}
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search by patient name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Patient cards container */}
      <div className="patient-cards-container">
        <div className="patient-cards">
          {filteredPatients.map(patient => (
    <Link key={patient.id} to={`/patients/${patient.id}/detail`} className="patient-card">
    <div>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Phone:</strong> {patient.phone}</p>
                {/* Render additional patient details */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientList;
