import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { auth, db } from '../../../firebase'; // Ensure you have firebase config here
import { doc, getDoc } from 'firebase/firestore';
import './myAppointments.css';
import './AppointmentModal.css'; // Import the modal CSS

const socket = io(); // Connect to the Socket.IO server

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchColumn, setSearchColumn] = useState('patient_name');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // State to store user details
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const appointmentsPerPage = 50;

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
      setLoading(false); // Set loading to false once appointments are fetched
    });

    return () => {
      socket.off('appointments');
    };
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when a new search is made
  };

  const handleColumnChange = (event) => {
    setSearchColumn(event.target.value);
    setCurrentPage(1); // Reset to the first page when a new search is made
  };

  const filterAppointments = (status) => {
    let filteredAppointments = appointments;

    if (userDetails) {
      const { firstName, lastName, role } = userDetails;
      const upperFirstName = firstName.toUpperCase();
      const upperLastName = lastName.toUpperCase();

      if (role === 'Patient') {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.patient_name.includes(upperFirstName) && appointment.patient_name.includes(upperLastName)
        );
      } else if (role === 'Agent') {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.agent_name.includes(upperFirstName) && appointment.agent_name.includes(upperLastName)
        );
      }
    }

    if (status !== 'All') {
      filteredAppointments = filteredAppointments.filter(appointment => appointment.schedule_status === status);
    }

    if (searchQuery) {
      filteredAppointments = filteredAppointments.filter(appointment => {
        const columnValue = appointment[searchColumn]?.toString().toLowerCase() || '';
        return columnValue.includes(searchQuery.toLowerCase());
      });
    }

    return filteredAppointments;
  };

  const handleClick = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '#28a745'; // Green
      case 'RESCHEDULED':
        return '#17a2b8'; // Blue
      case 'MISSED':
        return '#dc3545'; // Red
      case 'LATE':
        return '#b0a331'; // Yellow
      default:
        return '#6c757d'; // Gray
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading appointments...</div>;
    }

    const filteredAppointments = filterAppointments(activeTab);
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

    return (
      <>
        <div className="appointments-grid">
          {currentAppointments.length > 0 ? (
            currentAppointments.map(appointment => (
              <div key={appointment._id} className="appointment-block" onClick={() => openModal(appointment)}>
                <div className="appointment-info">
                  {userDetails.role === 'Patient' ? (
                    <p><strong>Agent Name:</strong> {appointment.agent_name}</p>
                  ) : (
                    <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
                  )}
                  <p><strong>Appointment Date:</strong> {appointment.schedule_date}</p>
                </div>
                <div className="appointment-status" style={{ backgroundColor: getStatusColor(appointment.schedule_status) }}>
                  {appointment.schedule_status}
                </div>
                <div className="appointment-status-tab" style={{ backgroundColor: getStatusColor(appointment.schedule_status) }}></div>
              </div>
            ))
          ) : (
            <div className="no-appointments">No appointments found</div>
          )}
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={(event) => handleClick(event, i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="appointments-container">
      {userDetails && <h2>Hi {userDetails.firstName}, here are your appointments:</h2>}
      <div className="appointments-navbar">
        <button className={activeTab === 'All' ? 'active' : ''} onClick={() => setActiveTab('All')}>All</button>
        <button className={activeTab === 'Upcoming' ? 'active' : ''} onClick={() => setActiveTab('Upcoming')}>Upcoming</button>
        <button className={activeTab === 'Completed' ? 'active' : ''} onClick={() => setActiveTab('Completed')}>Completed</button>
        <button className={activeTab === 'Cancelled' ? 'active' : ''} onClick={() => setActiveTab('Cancelled')}>Cancelled</button>
        <select value={searchColumn} onChange={handleColumnChange} className="search-select">
          <option value="schedule_id">Schedule ID</option>
          <option value="patient_name">Patient Name</option>
          <option value="schedule_date">Schedule Date</option>
          <option value="agent_name">Agent Name</option>
          <option value="schedule_status">Schedule Status</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="appointments-content">
        {renderContent()}
      </div>
      {selectedAppointment && (
        <div className="modal-container">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button className="close-button" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p><strong>Schedule ID:</strong> {selectedAppointment.schedule_id}</p>
              <p><strong>Patient Name:</strong> {selectedAppointment.patient_name}</p>
              <p><strong>Schedule Date:</strong> {selectedAppointment.schedule_date}</p>
              <p><strong>Agent Name:</strong> {selectedAppointment.agent_name}</p>
              <p><strong>Schedule Status:</strong> {selectedAppointment.schedule_status}</p>
              <p><strong>Visit Reschedule Reason:</strong> {selectedAppointment.visit_reschedule_reason}</p>
              <p><strong>Visit Suspended Reason:</strong> {selectedAppointment.visit_suspended_reason}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
