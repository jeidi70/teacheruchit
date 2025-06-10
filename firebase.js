const firebaseConfig = {
  apiKey: "AIzaSyDdr_9yA391YOY08o3T3RXvjD1-dIdfCK0",
  authDomain: "teacheruchit.firebaseapp.com",
  projectId: "teacheruchit",
  storageBucket: "teacheruchit.firebasestorage.app",
  messagingSenderId: "762586190395",
  appId: "1:762586190395:web:78333e7d5fa3dd6dd1021e",
  measurementId: "G-K0BHLKHNHF"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();