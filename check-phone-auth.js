const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Инициализация Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function checkPhoneAuthStatus() {
  try {
    // Получаем список провайдеров аутентификации
    const authProviders = await admin.auth().listProviders();
    console.log('Available Auth Providers:', authProviders);

    // Проверяем, включена ли аутентификация по телефону
    const phoneAuthEnabled = authProviders.includes('phone');
    console.log('Phone Auth Status:', phoneAuthEnabled ? 'Enabled' : 'Disabled');

    if (!phoneAuthEnabled) {
      console.log('\nДля включения аутентификации по телефону:');
      console.log('1. Перейдите в Firebase Console');
      console.log('2. Выберите ваш проект');
      console.log('3. Перейдите в Authentication > Sign-in method');
      console.log('4. Включите Phone Number provider');
    }

  } catch (error) {
    console.error('Error checking phone auth status:', error);
  } finally {
    // Закрываем соединение с Firebase
    admin.app().delete();
  }
}

checkPhoneAuthStatus(); 