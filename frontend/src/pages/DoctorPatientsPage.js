import React from 'react';
import DoctorLayout from '../components/layout/DoctorLayout';
import PatientsList from '../components/doctor/PatientsList';

function DoctorPatientsPage() {
  return (
    <DoctorLayout>
      <PatientsList />
    </DoctorLayout>
  );
}

export default DoctorPatientsPage; 