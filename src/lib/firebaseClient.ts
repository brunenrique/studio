import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCkp-Yp3CPOVl5jkmprh7BwP86Es-H9RzI',
  authDomain: 'plataforma-bpsy.firebaseapp.com',
  projectId: 'plataforma-bpsy',
  storageBucket: 'plataforma-bpsy.firebasestorage.app',
  messagingSenderId: '115174793204',
  appId: '1:115174793204:web:dd38de43781c2ac5a423a1',
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
