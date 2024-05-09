import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import './PatientList.css'; // Import CSS file for styling

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/patients') // Replace with your FastAPI backend URL
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.error('Error fetching patients:', error));
  }, []);

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search query change
  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="patient-list-container">
      <h1><center>Patients List</center></h1>
      {/* Search input field */}
      <input
        className="search-input"
        type="text"
        placeholder="Search by patient name"
        value={searchQuery}
        onChange={handleSearchChange}
      />

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
  );
}

export default PatientList;
