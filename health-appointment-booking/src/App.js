import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientList from './PatientList';
import CreatePatientForm from './CreatePatientForm';
import PatientDetail from './PatientDetail'; // Import the PatientDetail component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/create" element={<CreatePatientForm />} /> 
          <Route path="/patients/:id/detail" element={<PatientDetail />} /> {/* Route for patient detail */}
          <Route path="/" element={<PatientList />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
