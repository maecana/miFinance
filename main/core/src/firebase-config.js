// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNq1m2mL68N-HVeZlz7nvgE5lGNR4LBQw",
    authDomain: "mifinance-9af19.firebaseapp.com",
    projectId: "mifinance-9af19",
    storageBucket: "mifinance-9af19.appspot.com",
    messagingSenderId: "1059191381966",
    appId: "1:1059191381966:web:7572e1385eb988fbc5559f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);