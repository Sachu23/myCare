import React from 'react';
import './navbar.css'; // Add CSS file for styling

const Navbar = ({ setActive }) => {
  return (
    <div id="navbar">
      <div onClick={() => setActive(1)}>My Appointments</div>
      <div onClick={() => setActive(2)}>Calendar</div>
      <div onClick={() => setActive(3)}>Profile</div>
      <div onClick={() => setActive(4)}>Notifications</div>
    </div>
  );
};

export default Navbar;
