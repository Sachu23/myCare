// src/components/Login.js
import React from 'react';
import { useNavigate } from 'react-router-dom'
import './Login.css';

const Login = () => {

    const navigate = useNavigate()

    const onButtonClick = () => {
        navigate('/appointments'); // Navigating Dashboard Post Login

        //Need to write the login API call here
        //@Succhay start with Nav Bar
        
    }
  
  return (
    <div className="login-container">
      <div className="login-form">
        <div className="app-login">
            <h1>My CARE</h1>
        </div>
        <br />
        <form>
          <input type="email" placeholder="Email address" required />
          <input type="password" placeholder="Password" required />
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
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="login-btn" onClick={onButtonClick}>Login</button>
        </form>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
}

export default Login;
