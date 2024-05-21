import React, { useState } from 'react';
import axios from 'axios';

const AppointmentForm = ({ patientPhone, onAppointmentCreated }) => {
  const [formData, setFormData] = useState({
    datetime: '',
    details: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    // Extracting datetime and details from the form data
    const { datetime, details } = formData;
  
    try {
      const response = await axios.post(`http://localhost:8000/patients/${patientPhone}/appointments/`, {
        datetime,
        details,
        amount: 50, // Hardcoded value for amount
        description: 'Appointment fee' // Hardcoded value for description
      });
  
      // Check if payment_link exists in response.data
      const paymentLink = response.data && response.data.payment_link;
  
      // If payment link exists, pass it to the parent component
      if (paymentLink) {
        onAppointmentCreated(paymentLink); // Pass payment link to parent component
        console.log('Appointment created');
      } else {
        setError('Failed to create appointment. Please try again later.');
      }
    } catch (error) {
      setError('Failed to create appointment. Please try again later.');
      console.error('Error creating appointment:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h3>Create Appointment</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date and Time:</label>
          <input
            type="datetime-local"
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Details:</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

export default AppointmentForm;
