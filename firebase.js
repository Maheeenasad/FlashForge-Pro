// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJKMJOXurR-gesTwWNI5osEh_ZMgVZMnY",
  authDomain: "flashcard-1b7a3.firebaseapp.com",
  projectId: "flashcard-1b7a3",
  storageBucket: "flashcard-1b7a3.appspot.com",
  messagingSenderId: "55100748617",
  appId: "1:55100748617:web:88b1999c39fd6ac6dce098"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}