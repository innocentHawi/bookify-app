import { initializeApp } from "firebase/app";

const firebaseConfig={
    apiKey: "AIzaSyDV8br30nfNB5DF9gDC_nB0LL4WAcGGhp8",
    authDomain: "bookify-a35b4.firebaseapp.com",
    projectId: "bookify-a35b4",
    storageBucket: "bookify-a35b4.appspot.com",
    messagingSenderId: "113400058436",
    appId: "1:113400058436:web:1732de4f91906b09162211",
    measurementId: "G-FTEZYYRJ3P"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };