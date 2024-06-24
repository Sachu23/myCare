import React, { useState } from 'react';
import './myAppointments.css';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('All');

  const renderContent = () => {
    switch (activeTab) {
      case 'Upcoming':
        return <div>This is the Upcoming Appointments content</div>;
      case 'Completed':
        return <div>This is the Completed Appointments content</div>;
      case 'Cancelled':
        return <div>This is the Cancelled Appointments content</div>;
      default:
        return <div>This is the All Appointments content</div>;
    }
  };

  return (
    <div className="appointments-container">
      <div className="appointments-navbar">
        <button className={activeTab === 'All' ? 'active' : ''} onClick={() => setActiveTab('All')}>All</button>
        <button className={activeTab === 'Upcoming' ? 'active' : ''} onClick={() => setActiveTab('Upcoming')}>Upcoming</button>
        <button className={activeTab === 'Completed' ? 'active' : ''} onClick={() => setActiveTab('Completed')}>Completed</button>
        <button className={activeTab === 'Cancelled' ? 'active' : ''} onClick={() => setActiveTab('Cancelled')}>Cancelled</button>
      </div>
      <div className="appointments-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Appointments;
