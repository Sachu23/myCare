import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import './Register.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { setDoc, doc } from 'firebase/firestore'; // Import setDoc and doc from firebase/firestore


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
export const auth = getAuth(app);
export const db = getFirestore(app);

//export { auth };


const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Agent'); // Default role is Agent
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Register the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: firstName.toUpperCase(),
        lastName: lastName.toUpperCase(),
        email: email,
        role: role,
      });

      alert('Registration successful');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="role"
              id="patientRole"
              value="Patient"
              checked={role === 'Patient'}
              onChange={() => setRole('Patient')}
            />
            <label className="form-check-label" htmlFor="patientRole">
              Patient
            </label>
            <input
              className="form-check-input"
              type="radio"
              name="role"
              id="agentRole"
              value="Agent"
              checked={role === 'Agent'}
              onChange={() => setRole('Agent')}
            />
            <label className="form-check-label" htmlFor="agentRole">
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