import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return (
    <div id="navbar">
      <Link to="/appointments">My Appointments</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/myProfile">Profile</Link>
      <Link to="/notifications">Notifications</Link>
    </div>
  );
};

export default Navbar;
