import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import AppointmentForm from './AppointmentForm';
import './PatientDetail.css'; // Import the CSS file for styling

const PatientDetail = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLink, setPaymentLink] = useState(null); // State to store the payment link
  const { phone } = useParams(); // Extract the phone number from the URL parameters

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8000/patients/${phone}/detail`);
        setPatient(response.data);
      } catch (error) {
        setError('Failed to fetch patient data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    if (phone) {
      fetchPatientData();
    }
  }, [phone]);

  const handleAppointmentCreated = async (paymentLink) => {
    try {
      // Create the appointment first
      const appointmentResponse = await axios.post(`http://localhost:8000/patients/${phone}/appointments/`, {
        datetime: new Date().toISOString(), // Dummy datetime
        details: 'Appointment details' // Dummy details
      });

      // Update the payment link state when an appointment is created
      setPaymentLink(paymentLink);
      
      // Redirect to the Stripe payment link
      window.location.href = "https://buy.stripe.com/test_4gweVKgwLgxPcCIbIL";
    } catch (error) {
      setError('Failed to create appointment. Please try again later.');
      console.error('Error creating appointment:', error);
    }
  };

  if (!phone) {
    return <div>No phone number provided.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !patient) {
    return (
      <div>
        <p>Error: {error}</p>
        <Link to="/patients">Back to Patient List</Link>
      </div>
    );
  }

  return (
    <div className="patient-detail-container">
      <h2><center>Patient Details</center></h2>
      <div className="patient-card">
        <div className="patient-info">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Phone:</strong> {patient.phone}</p>
        </div>
        <Link to="/patients">Back to Patient List</Link>
        {/* Display the payment link if available */}
        {paymentLink && (
          <div>
            <p>Payment Link:</p>
            <a href={"https://buy.stripe.com/test_4gweVKgwLgxPcCIbIL"} target="_blank" rel="noopener noreferrer">Payment Link</a>
          </div>
        )}
        {/* Render the appointment form and pass the handleAppointmentCreated function */}
        <AppointmentForm patientPhone={phone} onAppointmentCreated={handleAppointmentCreated} />
      </div>
    </div>
  );
}

export default PatientDetail;
