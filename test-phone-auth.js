const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const { phoneAuthConfig } = require('./firebase-config');

// Инициализация Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function testPhoneAuth() {
  try {
    console.log('Начинаем тестирование аутентификации по телефону...\n');

    // Проверяем настройки Firebase
    console.log('1. Проверка настроек Firebase:');
    const authProviders = await admin.auth().listProviders();
    const phoneEnabled = authProviders.includes('phone');
    console.log(`- Аутентификация по телефону: ${phoneEnabled ? '✅ Включена' : '❌ Отключена'}`);
    
    if (!phoneEnabled) {
      throw new Error('Аутентификация по телефону отключена в Firebase Console');
    }

    // Проверяем тестовые номера
    console.log('\n2. Проверка тестовых номеров:');
    phoneAuthConfig.testPhoneNumbers.forEach(number => {
      console.log(`- ${number}: ${number.match(/^\+7\d{10}$/) ? '✅ Корректный формат' : '❌ Неверный формат'}`);
    });

    // Проверяем reCAPTCHA
    console.log('\n3. Проверка настроек reCAPTCHA:');
    console.log(`- Ключ reCAPTCHA: ${phoneAuthConfig.recaptcha.siteKey ? '✅ Настроен' : '❌ Отсутствует'}`);
    console.log(`- Размер: ${phoneAuthConfig.recaptcha.size}`);
    console.log(`- Тема: ${phoneAuthConfig.recaptcha.theme}`);

    // Проверяем правила безопасности
    console.log('\n4. Проверка правил безопасности:');
    const rules = await admin.firestore().getFirestoreRules();
    const hasPhoneAuthRules = rules.includes('phoneNumber') && rules.includes('lastLogin');
    console.log(`- Правила для аутентификации по телефону: ${hasPhoneAuthRules ? '✅ Настроены' : '❌ Отсутствуют'}`);

    console.log('\n✅ Тестирование завершено успешно!');
    console.log('\nДля тестирования регистрации:');
    console.log('1. Откройте страницу входа');
    console.log('2. Нажмите "Войти через телефон"');
    console.log('3. Введите один из тестовых номеров:');
    phoneAuthConfig.testPhoneNumbers.forEach(number => {
      console.log(`   - ${number}`);
    });
    console.log('4. Пройдите проверку reCAPTCHA');
    console.log('5. Введите код подтверждения из SMS');

  } catch (error) {
    console.error('\n❌ Ошибка при тестировании:', error.message);
    console.log('\nРекомендации по исправлению:');
    if (error.message.includes('отключена')) {
      console.log('1. Включите аутентификацию по телефону в Firebase Console');
      console.log('2. Добавьте тестовые номера в список разрешенных');
    }
    if (error.message.includes('reCAPTCHA')) {
      console.log('1. Проверьте настройки reCAPTCHA в Firebase Console');
      console.log('2. Убедитесь, что ключ reCAPTCHA корректный');
    }
  } finally {
    process.exit();
  }
}

testPhoneAuth(); 