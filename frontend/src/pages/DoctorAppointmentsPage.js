import React from 'react';
import DoctorLayout from '../components/layouts/DoctorLayout';
import AppointmentsSchedule from '../components/doctor/AppointmentsSchedule';

function DoctorAppointmentsPage() {
  return (
    <DoctorLayout>
      <AppointmentsSchedule />
    </DoctorLayout>
  );
}

export default DoctorAppointmentsPage; 