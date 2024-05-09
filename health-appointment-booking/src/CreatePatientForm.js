import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePatientForm.css'; // Import CSS file for styling

function CreatePatientForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/patients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to create patient');
      }
      // Redirect to the patients list page after successful patient creation
      navigate(`/patients`); // Change the destination path here
      setSuccessMessage('Patient created successfully!');
    } catch (error) {
      console.error('Error creating patient:', error.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 3000); // Auto-dismiss after 3 seconds
    return () => clearTimeout(timer);
  }, [successMessage]);

  return (
    <div className="create-patient-form-container">
      <div className="form-box">
        <h2>Welcome to Hospital Appointment Booking</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit">Create Patient</button>
        </form>
      </div>
      {successMessage && (
        <div className="success-dialogue">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default CreatePatientForm;
