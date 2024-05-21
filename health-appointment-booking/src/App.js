import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import CreatePatientForm from './CreatePatientForm';
import PatientList from './PatientList';
import PatientDetail from './PatientDetail';
import AppointmentForm from './AppointmentForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the home page */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-patient" element={<CreatePatientForm />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:phone/detail" element={<PatientDetail />} />
          <Route path="/patients/:phone/appointments" element={<AppointmentForm/>}/>
          {/* Route for listing patients */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
