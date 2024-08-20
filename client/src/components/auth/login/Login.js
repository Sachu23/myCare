import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { auth } from '../../firebase'; // Import Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth";
import './Login.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKeL0QM7289Mp8XtXT1JMmvGsWBfVsXxA",
  authDomain: "mycare-2be1f.firebaseapp.com",
  projectId: "mycare-2be1f",
  storageBucket: "mycare-2be1f.appspot.com",
  messagingSenderId: "238313137117",
  appId: "1:238313137117:web:ea08278e4130e263978c34",
  measurementId: "G-YL7XSQ0W36"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optionally store user details in localStorage or global state

      alert('Login successful');
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
}

export default Login;
