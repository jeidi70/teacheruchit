const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Инициализация Firebase Admin
let serviceAccount;
try {
  if (process.env.NODE_ENV === 'production') {
    // In production, use environment variables
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };
  } else {
    // In development, use service account file
    serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'));
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'teacheruchit'
  });

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// Обновленные шаблоны писем
const templates = {
  verification: {
    subject: 'Подтверждение регистрации - TeacherUchit',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">TeacherUchit</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Добро пожаловать, {{name}}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Спасибо за регистрацию в TeacherUchit. Для завершения регистрации введите код подтверждения:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="background: #667eea; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 5px; letter-spacing: 3px;">
              {{code}}
            </span>
          </div>
          <p style="color: #999; font-size: 14px;">
            Код действителен в течение 10 минут. Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          © 2024 TeacherUchit. Все права защищены.
        </div>
      </div>
    `
  },
  passwordReset: {
    subject: 'Сброс пароля - TeacherUchit',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">TeacherUchit</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Сброс пароля</h2>
          <p style="color: #666; line-height: 1.6;">
            Здравствуйте, {{name}}! Вы запросили сброс пароля для вашего аккаунта.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{resetLink}}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Сбросить пароль
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            Ссылка действительна в течение 1 часа. Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          © 2024 TeacherUchit. Все права защищены.
        </div>
      </div>
    `
  },
  welcome: {
    subject: 'Добро пожаловать в TeacherUchit!',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">TeacherUchit</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Добро пожаловать, {{name}}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Поздравляем! Вы успешно зарегистрированы как {{role}} на платформе TeacherUchit.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Что дальше?</h3>
            <ul style="color: #666; line-height: 1.8;">
              {{#if isTeacher}}
                <li>Создайте свой первый урок</li>
                <li>Добавьте учеников в класс</li>
                <li>Начните создавать тесты и задания</li>
              {{else}}
                <li>Найдите своего преподавателя</li>
                <li>Присоединитесь к классу</li>
                <li>Начните изучение материалов</li>
              {{/if}}
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://teacheruchit.firebaseapp.com" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Перейти на платформу
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          © 2024 TeacherUchit. Все права защищены.
        </div>
      </div>
    `
  }
};

// Функция для инициализации шаблонов
async function initializeTemplates() {
  try {
    console.log('🚀 Initializing email templates...');
    
    const batch = db.batch();
    
    // Добавляем каждый шаблон в Firestore
    for (const [type, template] of Object.entries(templates)) {
      const templateRef = db.collection('emailTemplates').doc(type);
      batch.set(templateRef, {
        ...template,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        version: '1.0.0',
        active: true
      });
      console.log(`📧 Added template: ${type}`);
    }
    
    // Выполняем пакетную запись
    await batch.commit();
    console.log('✅ Email templates initialized successfully');
    
    // Проверяем созданные шаблоны
    const templatesSnapshot = await db.collection('emailTemplates').get();
    console.log(`📊 Total templates created: ${templatesSnapshot.size}`);
    
  } catch (error) {
    console.error('❌ Error initializing email templates:', error);
    process.exit(1);
  } finally {
    // Закрываем соединение с Firebase
    try {
      await admin.app().delete();
      console.log('🔐 Firebase connection closed');
    } catch (error) {
      console.log('⚠️  Warning: Could not close Firebase connection properly');
    }
  }
}

// Запускаем инициализацию
if (require.main === module) {
  initializeTemplates();
}

module.exports = { initializeTemplates, templates }; 