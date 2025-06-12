// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDdr_9yA391YOY08o3T3RXvjD1-dIdfCK0",
  authDomain: "teacheruchit.firebaseapp.com",
  projectId: "teacheruchit",
  storageBucket: "teacheruchit.firebasestorage.app",
  messagingSenderId: "762586190395",
  appId: "1:762586190395:web:78333e7d5fa3dd6dd1021e",
  measurementId: "G-K0BHLKHNHH"
};

// Настройки для аутентификации по телефону
const phoneAuthConfig = {
  // Включить аутентификацию по телефону
  enabled: true,
  // Настройки reCAPTCHA
  recaptcha: {
    // Получите ключ reCAPTCHA в Firebase Console:
    // 1. Authentication > Sign-in method > Phone
    // 2. Включите Phone provider если еще не включен
    // 3. В разделе reCAPTCHA Enterprise нажмите "Get Started"
    // 4. Создайте новый ключ reCAPTCHA v2
    // 5. Вставьте полученный ключ ниже
    siteKey: "6LdXpVwrAAAAAJ7G8Qm1IG_a7X66fgHckqymicIO", // Ваш ключ reCAPTCHA
    size: "normal",
    theme: "light"
  },
  // Настройки для тестирования
  testPhoneNumbers: [
    // Добавьте ваши тестовые номера телефонов в формате +7XXXXXXXXXX
    // Эти номера будут работать только в режиме разработки
    "+79001234567", // Замените на ваш тестовый номер
    "+79001234568"  // Замените на ваш тестовый номер
  ]
};

module.exports = {
  firebaseConfig,
  phoneAuthConfig
}; 