import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCEU8zREw7bECdR5SJvsns2PJS961CsD7Q",
  authDomain: "hayaoshi-11622.firebaseapp.com",
  projectId: "hayaoshi-11622",
  storageBucket: "hayaoshi-11622.firebasestorage.app",
  messagingSenderId: "537070484209",
  appId: "1:537070484209:web:e8ac4d5df141862f5fc750",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
