require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const path = require('path');
const { firebaseConfig } = require('./firebase-config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Инициализация Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Настройка транспорта для отправки email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Простой текстовый логотип
const logo = `
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
</div>`;

// Функция для сохранения информации об отправленном письме
async function saveEmailLog(email, type, status, error = null) {
  try {
    await db.collection('emailLogs').add({
      email,
      type,
      status,
      error: error ? error.message : null,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving email log:', error);
  }
}

// Функция для получения шаблона письма из Firestore
async function getEmailTemplate(type) {
  try {
    const templateDoc = await db.collection('emailTemplates').doc(type).get();
    if (templateDoc.exists) {
      return templateDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting email template:', error);
    return null;
  }
}

// Обработчики для отправки email
app.post('/send-verification', async (req, res) => {
  try {
    const { email, actionUrl } = req.body;
    
    // Получаем шаблон из Firestore
    const template = await getEmailTemplate('verification');
    const html = template ? template.html.replace('{{action_url}}', actionUrl) : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          ${logo}
        </div>
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px;">
          <h1 style="color: #1e293b; margin-bottom: 20px;">Подтвердите ваш email</h1>
          <p style="color: #475569; margin-bottom: 20px;">
            Спасибо за регистрацию на платформе TeacherUchit! Для завершения регистрации, пожалуйста, подтвердите ваш email.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" 
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
    `;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: template ? template.subject : 'Подтвердите ваш email для TeacherUchit',
      html
    });
    
    // Сохраняем информацию об отправке
    await saveEmailLog(email, 'verification', 'success');
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending verification email:', error);
    await saveEmailLog(req.body.email, 'verification', 'error', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/send-password-reset', async (req, res) => {
  try {
    const { email, actionUrl } = req.body;
    
    // Получаем шаблон из Firestore
    const template = await getEmailTemplate('passwordReset');
    const html = template ? template.html.replace('{{action_url}}', actionUrl) : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          ${logo}
        </div>
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px;">
          <h1 style="color: #1e293b; margin-bottom: 20px;">Сброс пароля</h1>
          <p style="color: #475569; margin-bottom: 20px;">
            Мы получили запрос на сброс пароля для вашего аккаунта. Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" 
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
    `;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: template ? template.subject : 'Сброс пароля для TeacherUchit',
      html
    });
    
    // Сохраняем информацию об отправке
    await saveEmailLog(email, 'passwordReset', 'success');
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    await saveEmailLog(req.body.email, 'passwordReset', 'error', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/send-welcome', async (req, res) => {
  try {
    const { email, actionUrl } = req.body;
    
    // Получаем шаблон из Firestore
    const template = await getEmailTemplate('welcome');
    const html = template ? template.html.replace('{{action_url}}', actionUrl) : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          ${logo}
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
            <a href="${actionUrl}" 
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
    `;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: template ? template.subject : 'Добро пожаловать в TeacherUchit!',
      html
    });
    
    // Сохраняем информацию об отправке
    await saveEmailLog(email, 'welcome', 'success');
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    await saveEmailLog(req.body.email, 'welcome', 'error', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Маршруты
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/role-selection', (req, res) => {
  res.sendFile(path.join(__dirname, 'role-selection.html'));
});

app.get('/student-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'student-dashboard.html'));
});

app.get('/teacher-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'teacher-dashboard.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 