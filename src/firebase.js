import firebase from "firebase";

const firebaseApp  = firebase.initializeApp({
    apiKey: "AIzaSyDNUWOpCnRFgM7gB2P85ADizTvpxqVvzwI",
    authDomain: "instagram-fcd81.firebaseapp.com",
    projectId: "instagram-fcd81",
    storageBucket: "instagram-fcd81.appspot.com",
    messagingSenderId: "727449825373",
    appId: "1:727449825373:web:6c15dc2bddd3e09dd8ddb4",
    measurementId: "G-CY30WK064N"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};