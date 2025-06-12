const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Инициализация Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Шаблоны писем
const templates = {
  verification: {
    subject: 'Подтвердите ваш email для TeacherUchit',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          <div style="
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-family: Arial, sans-serif;
            font-size: 24px;
            font-weight: bold;
            margin: 0 auto;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          ">
            TeacherUchit
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px;">
          <h1 style="color: #1e293b; margin-bottom: 20px;">Подтвердите ваш email</h1>
          <p style="color: #475569; margin-bottom: 20px;">
            Спасибо за регистрацию на платформе TeacherUchit! Для завершения регистрации, пожалуйста, подтвердите ваш email.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{action_url}}" 
               style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      display: inline-block;">
              Подтвердить email
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            Если вы не регистрировались на TeacherUchit, просто проигнорируйте это письмо.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
          <p>© 2024 TeacherUchit. Все права защищены.</p>
        </div>
      </div>
    `
  },
  passwordReset: {
    subject: 'Сброс пароля для TeacherUchit',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          <div style="
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-family: Arial, sans-serif;
            font-size: 24px;
            font-weight: bold;
            margin: 0 auto;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          ">
            TeacherUchit
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px;">
          <h1 style="color: #1e293b; margin-bottom: 20px;">Сброс пароля</h1>
          <p style="color: #475569; margin-bottom: 20px;">
            Мы получили запрос на сброс пароля для вашего аккаунта. Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{action_url}}" 
               style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      display: inline-block;">
              Сбросить пароль
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            Ссылка для сброса пароля действительна в течение 1 часа.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
          <p>© 2024 TeacherUchit. Все права защищены.</p>
        </div>
      </div>
    `
  },
  welcome: {
    subject: 'Добро пожаловать в TeacherUchit!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          <div style="
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-family: Arial, sans-serif;
            font-size: 24px;
            font-weight: bold;
            margin: 0 auto;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          ">
            TeacherUchit
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px;">
          <h1 style="color: #1e293b; margin-bottom: 20px;">Добро пожаловать!</h1>
          <p style="color: #475569; margin-bottom: 20px;">
            Мы рады приветствовать вас на платформе TeacherUchit! Теперь у вас есть доступ к:
          </p>
          <ul style="color: #475569; margin-bottom: 20px;">
            <li>Интерактивным урокам по истории и обществознанию</li>
            <li>Практическим заданиям и тестам</li>
            <li>Персональной статистике успеваемости</li>
            <li>Общению с преподавателями</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{action_url}}" 
               style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      display: inline-block;">
              Начать обучение
            </a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
          <p>© 2024 TeacherUchit. Все права защищены.</p>
        </div>
      </div>
    `
  }
};

// Функция для инициализации шаблонов
async function initializeTemplates() {
  try {
    const batch = db.batch();
    
    // Добавляем каждый шаблон в Firestore
    for (const [type, template] of Object.entries(templates)) {
      const templateRef = db.collection('emailTemplates').doc(type);
      batch.set(templateRef, template);
    }
    
    // Выполняем пакетную запись
    await batch.commit();
    console.log('Email templates initialized successfully');
  } catch (error) {
    console.error('Error initializing email templates:', error);
  } finally {
    // Закрываем соединение с Firebase
    admin.app().delete();
  }
}

// Запускаем инициализацию
initializeTemplates(); 