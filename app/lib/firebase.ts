import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, ref, set, get, push, onValue, off, DatabaseReference } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";

// Firebase configuration with actual credentials
const firebaseConfig = {
  apiKey: "AIzaSyCOJAZNJgdRwljNeAUXvM_AKM8ny5SdBaM",
  authDomain: "decentramind-af1c7.firebaseapp.com",
  projectId: "decentramind-af1c7",
  storageBucket: "decentramind-af1c7.appspot.com",
  messagingSenderId: "451772701266",
  appId: "1:451772701266:web:d760907630f4d897d05d8b",
  databaseURL: "https://decentramind-af1c7-default-rtdb.firebaseio.com" // Add this for Realtime Database
};

// Prevents re-initializing if already initialized (for hot reload/dev)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const db = firestore; // Alias for compatibility

export default app;

// Solana wallet authentication
export const signInWithSolana = async (publicKey: string, signature: string) => {
  try {
    // In production, this would call your backend to verify the signature
    // and generate a custom token
    const response = await fetch('/api/auth/solana', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicKey, signature })
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Solana');
    }

    const { token } = await response.json();
    const result = await signInWithCustomToken(auth, token);
    return result;
  } catch (error) {
    console.error('Error signing in with Solana:', error);
    throw error;
  }
};

// Authentication utilities
export const getCurrentUser = (): User | null => {
  return auth?.currentUser || null;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Database utilities
export const saveData = async (path: string, data: any) => {
  try {
    const dataRef = ref(database, path);
    await set(dataRef, data);
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

export const getData = async (path: string) => {
  try {
    const dataRef = ref(database, path);
    const snapshot = await get(dataRef);
    return snapshot.val();
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
};

export const listenToData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(database, path);
  const unsubscribe = onValue(dataRef, (snapshot) => {
    callback(snapshot.val());
  });
  return unsubscribe;
};

// Storage utilities
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const fileRef = storageRef(storage, path);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Firestore utilities (alternative to Realtime Database)
export const saveToFirestore = async (collection: string, docId: string, data: any) => {
  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const docRef = doc(firestore, collection, docId);
    await setDoc(docRef, data);
    return true;
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    throw error;
  }
};

export const getFromFirestore = async (collection: string, docId: string) => {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const docRef = doc(firestore, collection, docId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.error('Error getting from Firestore:', error);
    throw error;
  }
}; 