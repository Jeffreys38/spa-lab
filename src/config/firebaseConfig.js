// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {isSupported} from 'firebase/messaging';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCg7bEKuo0sku3bJIV_HpIpem-4D76php0",
  authDomain: "fir-auth-18c37.firebaseapp.com",
  projectId: "fir-auth-18c37",
  storageBucket: "fir-auth-18c37.appspot.com",
  messagingSenderId: "330203934893",
  appId: "1:330203934893:web:f88dc9fefc1a0f0ba55624",
  measurementId: "G-FYD6SL86G8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

let analytics;
export const initializeFirebaseAnalytics = async () => {
  const supported = await isSupported();
  if (supported) {
    analytics = getAnalytics(app);
  } else {
    console.log("Firebase Analytics is not supported in this environment.");
  }
  return analytics;
};

export {app, db, auth };