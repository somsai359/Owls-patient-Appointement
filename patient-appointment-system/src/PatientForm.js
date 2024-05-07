import React, { useState } from 'react';

function PatientForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create patient');
        }
        setSuccess(true);
        setLoading(false);
        setFormData({ name: '', mobile: '', email: '' });
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Create Patient</h2>
      {success && <p>Patient created successfully!</p>}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="submit">Create</button>
        </form>
      )}
    </div>
  );
}

export default PatientForm;
