import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from '../../common/ProfileDropdown';
import Navbar from '../../navbar/navbar';
import Appointments from '../appointments/myAppointments';
import Notification from '../notifications/myNotifications';
import Calendar from '../calendar/myCalendar';
import Profile from '../myProfile/myprofile';
import './home.css';

const Header = () => {
  return (
    <div className="header">
      <Link to="/">
        <img src="mycare-logo.png" alt="MyCare Logo" className="logo" />
      </Link>
      <ProfileDropdown />
    </div>
  );
};

const Home = () => {
  const [active, setActive] = useState(1);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Appointments />;
      case 2:
        return <Calendar />;
      case 3:
        return <Profile />;
      case 4:
        return <Notification />;
      default:
        return <Appointments />;
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="app-content with-navbar">
        <Navbar setActive={setActive} />
        <div className="main-content">
          <main>
            {displayData()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
