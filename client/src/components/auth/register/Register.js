// src/components/auth/register/Register.js
import React from 'react';
import './Register.css';

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-form">
        <div className="app-login">
          <h1>My CARE</h1>
        </div>
        <br />
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email address" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />

          <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              Patient
            </label>
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              Agent
            </label>
          </div>

          <button type="submit" className="register-btn">Register</button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

export default Register;
