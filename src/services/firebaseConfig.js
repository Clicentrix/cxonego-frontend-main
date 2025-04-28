// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const apiKey = import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID;
const measurementId = import.meta.env.VITE_REACT_APP_FIREBASE_MEASUREMENT_ID;
const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
// Initialize messaging only if supported
let messaging = null;
// Safe initialization for messaging
const initializeMessaging = async () => {
    try {
        // Check if Firebase messaging is supported in this browser
        const isMessagingSupported = await isSupported();
        if (isMessagingSupported) {
            messaging = getMessaging(app);
            console.log("Firebase messaging initialized successfully");
        }
        else {
            console.warn("Firebase messaging is not supported in this browser");
        }
    }
    catch (error) {
        console.error("Error initializing Firebase messaging:", error);
    }
};
// Try to initialize messaging
initializeMessaging();
// Export messaging safely
export { messaging };
