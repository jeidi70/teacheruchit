// firebase.js
const { firebaseConfig, phoneAuthConfig } = require('./firebase-config');

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Инициализация сервисов
const auth = firebase.auth();
const db = firebase.firestore();

// Настройка языка для Firebase Auth
auth.useDeviceLanguage();

// Включение персистентности Firestore
db.enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support persistence.');
    }
  });

// Настройка аутентификации по телефону
if (phoneAuthConfig) {
  // Проверяем, находимся ли мы в режиме разработки
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    console.log('Development mode: Using test phone numbers');
    // В режиме разработки используем тестовые номера
    auth.settings.appVerificationDisabledForTesting = true;
  }
}

// Экспортируем объекты для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebase, auth, db };
} else {
  window.firebase = firebase;
  window.auth = auth;
  window.db = db;
}