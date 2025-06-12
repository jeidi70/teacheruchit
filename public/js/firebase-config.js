// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "teacheruchit.firebaseapp.com",
  projectId: "teacheruchit",
  storageBucket: "teacheruchit.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};

// Настройки для аутентификации по телефону
const phoneAuthConfig = {
  recaptchaVerifier: null,
  confirmationResult: null
};

// Экспортируем конфигурацию
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebaseConfig, phoneAuthConfig };
} else {
  window.firebaseConfig = firebaseConfig;
  window.phoneAuthConfig = phoneAuthConfig;
} 