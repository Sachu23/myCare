// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './components/auth/login/Login';
import Register from './components/auth/register/Register';
import { useState, useEffect } from 'react';
import Home from './components/dashboard/home/home'
import Appointments from './components/dashboard/appointments/myAppointments';
import Calendar from './components/dashboard/calendar/myCalendar';
import Profile from './components/dashboard/myProfile/myprofile';
import Notification from './components/dashboard/notifications/myNotifications';
import Navbar from './components/navbar/navbar.js';
import './App.css';




/*const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/myProfile" element={<Profile />} />
          <Route path="/notifications" element={<Notification />} />
        </Routes>
      </div>
  );
};*/


function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Check if the user is logged in by retrieving the value from localStorage
    const isLoggedIn = true;
    if (isLoggedIn === true) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []); 

  return (
    <Router>
      <div className="App">
      <Routes>
      <Route
            path="/"
            element={loggedIn ? <Home /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;