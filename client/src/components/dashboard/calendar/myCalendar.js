import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './myCalendar.css';
import io from 'socket.io-client';

const socket = io(); // Connect to the Socket.IO server

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    socket.on('appointments', (data) => {
      setAppointments(data);
    });

    return () => {
      socket.off('appointments');
    };
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.schedule_date);
    return (
      appointmentDate.getFullYear() === selectedDate.getFullYear() &&
      appointmentDate.getMonth() === selectedDate.getMonth() &&
      appointmentDate.getDate() === selectedDate.getDate()
    );
  });

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="custom-calendar"
          tileClassName="custom-tile"
        />
      </div>
      <div className="appointments-list">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appointment => (
            <div key={appointment._id} className="appointment-item">
              <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
              <p><strong>Agent Name:</strong> {appointment.agent_name}</p>
              <p><strong>Appointment Date:</strong> {appointment.schedule_date}</p>
              <p><strong>Status:</strong> {appointment.schedule_status}</p>
            </div>
          ))
        ) : (
          <p className="no-appointments">No appointments for this date.</p>
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
