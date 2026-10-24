
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "velto-fef88.firebaseapp.com",
  projectId: "velto-fef88",
  storageBucket: "velto-fef88.firebasestorage.app",
  messagingSenderId: "505004384716",
  appId: "1:505004384716:web:0fe8e555f1527c99a2bd69"
};

const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider()
export {auth,provider}