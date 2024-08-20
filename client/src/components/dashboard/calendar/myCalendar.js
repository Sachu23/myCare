import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './myCalendar.css';
import io from 'socket.io-client';
import { auth, db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const socket = io();

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '', role: '' });
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoveredDateAppointments, setHoveredDateAppointments] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        } else {
          console.error('No such document!');
        }
      } else {
        console.error('No user is signed in');
      }
    };

    fetchUserData();
  }, []);

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

  const handleDateHover = (date, event) => {
    setHoveredDate(date);
    const count = filteredAppointmentsForDate(date).length;
    setHoveredDateAppointments(count);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const filteredAppointmentsForDate = (date) => {
    const upperFirstName = userDetails.firstName.toUpperCase();
    const upperLastName = userDetails.lastName.toUpperCase();

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.schedule_date);
      const isSameDate =
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getDate() === date.getDate();

      if (!isSameDate) return false;

      if (userDetails.role === 'Patient') {
        return (
          appointment.patient_name.includes(upperFirstName) &&
          appointment.patient_name.includes(upperLastName)
        );
      } else if (userDetails.role === 'Agent') {
        return (
          appointment.agent_name.includes(upperFirstName) &&
          appointment.agent_name.includes(upperLastName)
        );
      }

      return false;
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      return (
        <div
          className="tile-content"
          onMouseEnter={(event) => handleDateHover(date, event)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {/* No visible content on tile; the popup will show on hover */}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="custom-calendar"
          tileClassName="custom-tile"
          tileContent={tileContent}
        />
        {hoveredDate && (
          <div
            className="hover-popup"
            style={{
              left: `${mousePosition.x + 15}px`,
              top: `${mousePosition.y + 15}px`,
              position: 'absolute',
              zIndex: 1000,
              backgroundColor: '#333',
              color: 'white',
              padding: '5px',
              borderRadius: '5px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            {hoveredDateAppointments} appointments on {hoveredDate.toDateString()}
          </div>
        )}
      </div>
      <div className="appointments-list">
        {filteredAppointmentsForDate(selectedDate).length > 0 ? (
          filteredAppointmentsForDate(selectedDate).map(appointment => (
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
