import React from 'react';
import { useHistory } from 'react-router-dom';
import CreateAppointmentForm from './CreateAppointmentForm';

function ParentComponent() {
  const history = useHistory();

  const redirectToPatientDetail = (patientId) => {
    history.push(`/patients/${patientId}/detail`);
  };

  return (
    <div>
      {/* Render the CreateAppointmentForm component and pass the redirectToPatientDetail function as a prop */}
      <CreateAppointmentForm patientId="patientId" redirectToPatientDetail={redirectToPatientDetail} />
    </div>
  );
}

export default ParentComponent;
