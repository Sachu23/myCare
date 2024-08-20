// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

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

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };