import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWWW0vpxX4ulgWCJjUNSyhF7Zk3RtG0mU",
  authDomain: "zetaton-react.firebaseapp.com",
  projectId: "zetaton-react",
  storageBucket: "zetaton-react.appspot.com",
  messagingSenderId: "415548537438",
  appId: "1:415548537438:web:2af1f8f16f0b8cef9092cf",
  measurementId: "G-Z6EBF4SPNY",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider(); // Add FacebookAuthProvider
export const db = getFirestore(app);
