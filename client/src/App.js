import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase.js';
import Login from './components/auth/login/Login';
import Register from './components/auth/register/Register';
import Home from './components/dashboard/home/home';
import Appointments from './components/dashboard/appointments/myAppointments';
import Calendar from './components/dashboard/calendar/myCalendar';
import Profile from './components/dashboard/myProfile/myprofile';
import Notification from './components/dashboard/notifications/myNotifications';
import Navbar from './components/navbar/navbar.js';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });

    return () => unsubscribe();
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
          <Route path="/myAppointments" element={loggedIn ? <Appointments /> : <Navigate to="/login" />} />
          {/* Other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
