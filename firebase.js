// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyDdr_9yA391YOY08o3T3RXvjD1-dIdfCK0",
  authDomain: "teacheruchit.firebaseapp.com",
  projectId: "teacheruchit",
  storageBucket: "teacheruchit.firebasestorage.app",
  messagingSenderId: "762586190395",
  appId: "1:762586190395:web:78333e7d5fa3dd6dd1021e",
  measurementId: "G-K0BHLKHNHH"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Инициализация сервисов
const auth = firebase.auth();
const db = firebase.firestore();

// Настройка языка для Firebase Auth
auth.useDeviceLanguage();

// Настройка персистентности Firestore
db.enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support persistence.');
    }
  });

// Экспорт для использования в других файлах
window.auth = auth;
window.db = db;