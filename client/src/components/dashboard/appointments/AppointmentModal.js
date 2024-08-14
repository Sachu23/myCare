import React from 'react';
import './AppointmentModal.css';

const AppointmentModal = ({ appointment, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Appointment Details</h2>
        <p><strong>Schedule ID:</strong> {appointment.schedule_id}</p>
        <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
        <p><strong>Appointment Date:</strong> {appointment.schedule_date}</p>
        <p><strong>Agent Name:</strong> {appointment.agent_name}</p>
        <p><strong>Schedule Status:</strong> {appointment.schedule_status}</p>
        <p><strong>Visit Reschedule Reason:</strong> {appointment.visit_reschedule_reason}</p>
        <p><strong>Visit Suspended Reason:</strong> {appointment.visit_suspended_reason}</p>
      </div>
    </div>
  );
};

export default AppointmentModal;
