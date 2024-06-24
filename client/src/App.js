// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';
import Login from './components/auth/login/Login';
import Register from './components/auth/register/Register';
import Appointments from './components/dashboard/appointments/myAppointments';
import Calendar from './components/dashboard/calendar/myCalendar';
import Profile from './components/dashboard/myProfile/myprofile';
import Notification from './components/dashboard/notifications/myNotifications';
import Navbar from './components/navbar/navbar.js';
import ProfileDropdown from './components/common/ProfileDropdown'; // Correct import
import './App.css';




const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`app-content ${isAuthPage ? 'no-navbar' : 'with-navbar'}`}>
      {!isAuthPage && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/myProfile" element={<Profile />} />
          <Route path="/notifications" element={<Notification />} />
        </Routes>
      </div>
    </div>
  );
};


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <AppContent />
      </div>
    </Router>
  );
}

const Header = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="header">
      <Link to="/">
        <img src="mycare-logo.png" alt="MyCare Logo" className="logo" />
      </Link>
      {!isAuthPage && <ProfileDropdown />}
    </div>
  );
};

export default App;