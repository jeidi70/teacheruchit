// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Замените на ваш API ключ
  authDomain: "your-project-id.firebaseapp.com", // Замените на ваш домен
  projectId: "your-project-id", // Замените на ваш ID проекта
  storageBucket: "your-project-id.appspot.com", // Замените на ваш bucket
  messagingSenderId: "your-sender-id", // Замените на ваш sender ID
  appId: "your-app-id" // Замените на ваш app ID
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
    "+79001234567", // Добавьте тестовые номера для разработки
    "+79001234568"  // Замените на ваш тестовый номер
  ]
};

// Экспортируем конфигурацию
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebaseConfig, phoneAuthConfig };
} else {
  window.firebaseConfig = firebaseConfig;
  window.phoneAuthConfig = phoneAuthConfig;
} 