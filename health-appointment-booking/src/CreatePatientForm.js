import React, { useState } from 'react';

function CreatePatientForm() {
  const [formData, setFormData] = useState({
    
    name: '',
    email: '',
    phone: ''
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
      // Optionally, you can redirect to the patient detail page after successful creation
      const data = await response.json();
      // Navigate to the patient detail page
      window.location.href = `/patients/${data.id}/detail`;
    } catch (error) {
      console.error('Error creating patient:', error.message);
    }
  };

  return (
    <div>
      <h2>Create New Patient</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </label>
        <label>
          Email:
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </label>
        <label>
          Phone:
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
          />
        </label>
        <button type="submit">Create Patient</button>
      </form>
    </div>
  );
}

export default CreatePatientForm;
