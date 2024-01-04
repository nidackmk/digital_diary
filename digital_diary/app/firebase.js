// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX_ytD8qPg90oN23k9t6Ma0CsOOtV8GSo",
  authDomain: "digitaldiary-e0007.firebaseapp.com",
  projectId: "digitaldiary-e0007",
  storageBucket: "digitaldiary-e0007.appspot.com",
  messagingSenderId: "792164317485",
  appId: "1:792164317485:web:da994e78787463cac5bba4",
  measurementId: "G-03LG0MPD24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db= getFirestore(app);