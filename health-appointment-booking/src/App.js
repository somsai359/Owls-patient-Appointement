// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientList from './PatientList';
import CreatePatientForm from './CreatePatientForm';
import PatientDetail from './PatientDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the home page */}
          <Route path="/" element={<CreatePatientForm />} />
          <Route path="/create" element={<CreatePatientForm />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:id/detail" element={<PatientDetail />} />
          {/* Route for listing patients */}
        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
