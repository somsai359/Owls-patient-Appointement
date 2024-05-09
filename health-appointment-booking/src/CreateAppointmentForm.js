import React, { useState } from 'react';

function CreateAppointmentForm({ patientId, redirectToPatientDetail }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/patients/${patientId}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }
      // Optionally, you can call the callback to redirect to the patient detail page after successful creation
      redirectToPatientDetail(patientId);
    } catch (error) {
      console.error('Error creating appointment:', error.message);
    }
  };

  return (
    <div>
      <h2>Create Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
          />
        </label>
        <label>
          Time:
          <input 
            type="time" 
            name="time" 
            value={formData.time} 
            onChange={handleChange} 
            required 
          />
        </label>
        <label>
          Description:
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </label>
        <button type="submit">Create Appointment</button>
      </form>
    </div>
  );
}

export default CreateAppointmentForm;
