// Dashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file for styling

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">Owls Hospital Management</h1>
          <p className="dashboard-description">Welcome to our hospital management system. </p>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="dashboard-section-content">
            <h2 className="dashboard-section-title">Manage Patients</h2>
            <p>Click the button below to create a new patient appointment or view existing patients.</p>
            <Link to="/create-patient" className="dashboard-button">Create Patient Appointment</Link>
          </div>
        </div>
        {/* Additional sections for managing treatments, staff, etc. */}
      </div>
    </div>
  );
}

export default Dashboard;
