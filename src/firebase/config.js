import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCmeInXvk-oAV0BPFf10Krs672UQnQN3UM",
  authDomain: "cardapio-digital-b7826.firebaseapp.com",
  projectId: "cardapio-digital-b7826",
  storageBucket: "cardapio-digital-b7826.appspot.com",
  messagingSenderId: "891056658182",
  appId: "1:891056658182:web:722e8bc0b8ad35d0f8c407",
  measurementId: "G-HDF9JLD7C"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);