const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Инициализация Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function checkAuthProviders() {
  try {
    console.log('Проверка настроек аутентификации...');
    
    // Получаем список провайдеров аутентификации
    const authProviders = await admin.auth().listProviders();
    console.log('\nДоступные провайдеры аутентификации:');
    authProviders.forEach(provider => {
      console.log(`- ${provider}`);
    });

    // Проверяем, включена ли аутентификация по телефону
    const phoneEnabled = authProviders.includes('phone');
    console.log('\nСтатус аутентификации по телефону:');
    console.log(phoneEnabled ? '✅ Включена' : '❌ Отключена');

    if (!phoneEnabled) {
      console.log('\nДля включения аутентификации по телефону:');
      console.log('1. Перейдите в Firebase Console');
      console.log('2. Выберите Authentication > Sign-in method');
      console.log('3. Найдите "Phone" в списке провайдеров');
      console.log('4. Нажмите "Enable"');
    }

  } catch (error) {
    console.error('Ошибка при проверке настроек:', error);
  } finally {
    process.exit();
  }
}

checkAuthProviders(); 