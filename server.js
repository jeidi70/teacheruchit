const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Firebase Admin SDK
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://www.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.googleapis.com"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Email rate limiting
const emailLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5 // limit each IP to 5 email requests per minute
});

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://teacheruchit.firebaseapp.com', 'https://teacher-uchit.vercel.app']
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Initialize Firebase Admin (only if serviceAccountKey.json exists)
let db = null;
let firebaseInitialized = false;

try {
  let serviceAccount;
  
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
    // In development, try to use service account file
    try {
      serviceAccount = require('./serviceAccountKey.json');
    } catch (error) {
      console.log('⚠️  serviceAccountKey.json not found. Firebase functionality will be disabled.');
      console.log('📝 To enable Firebase, add your service account key as serviceAccountKey.json');
      serviceAccount = null;
    }
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || 'teacheruchit'
    });

    db = admin.firestore();
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  console.log('📧 Firebase functionality will be disabled');
}

// Configure email transporter
let emailTransporter = null;
try {
  emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'teacheruchit@gmail.com',
      pass: process.env.EMAIL_PASS || 'ycng pdgf jqex svaj'
    }
  });
  console.log('📧 Email transporter configured');
} catch (error) {
  console.error('❌ Email configuration failed:', error.message);
}

// Email templates
const emailTemplates = {
  verification: (name, code) => ({
    subject: 'Подтверждение регистрации - TeacherUchit',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">TeacherUchit</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Добро пожаловать, ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Спасибо за регистрацию в TeacherUchit. Для завершения регистрации введите код подтверждения:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="background: #667eea; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 5px; letter-spacing: 3px;">
              ${code}
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
  }),
  
  passwordReset: (name, resetLink) => ({
    subject: 'Сброс пароля - TeacherUchit',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">TeacherUchit</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Сброс пароля</h2>
          <p style="color: #666; line-height: 1.6;">
            Здравствуйте, ${name}! Вы запросили сброс пароля для вашего аккаунта.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
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
  }),
  
  welcome: (name, role) => ({
    subject: 'Добро пожаловать в TeacherUchit!',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">TeacherUchit</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Добро пожаловать, ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Поздравляем! Вы успешно зарегистрированы как ${role === 'teacher' ? 'преподаватель' : 'студент'} на платформе TeacherUchit.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Что дальше?</h3>
            <ul style="color: #666; line-height: 1.8;">
              ${role === 'teacher' ? `
                <li>Создайте свой первый урок</li>
                <li>Добавьте учеников в класс</li>
                <li>Начните создавать тесты и задания</li>
              ` : `
                <li>Найдите своего преподавателя</li>
                <li>Присоединитесь к классу</li>
                <li>Начните изучение материалов</li>
              `}
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
  })
};

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    firebase: firebaseInitialized,
    email: !!emailTransporter
  });
});

// Send email endpoint
app.post('/api/send-email', emailLimiter, async (req, res) => {
  try {
    if (!emailTransporter) {
      return res.status(503).json({ 
        success: false, 
        message: 'Email service not configured' 
      });
    }

    const { to, template, data } = req.body;

    if (!to || !template || !data) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: to, template, data' 
      });
    }

    if (!emailTemplates[template]) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid template' 
      });
    }

    const emailContent = emailTemplates[template](data.name, data.code || data.resetLink || data.role);
    
    const mailOptions = {
      from: `"TeacherUchit" <${process.env.EMAIL_USER || 'teacheruchit@gmail.com'}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    await emailTransporter.sendMail(mailOptions);

    // Log email to Firestore (if available)
    if (db) {
      await db.collection('emailLogs').add({
        to: to,
        template: template,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        success: true
      });
    }

    res.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    // Log error to Firestore (if available)
    if (db) {
      await db.collection('emailLogs').add({
        to: req.body.to,
        template: req.body.template,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        success: false,
        error: error.message
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email' 
    });
  }
});

// Verify Firebase token
app.post('/api/verify-token', async (req, res) => {
  try {
    if (!firebaseInitialized) {
      return res.status(503).json({ 
        success: false, 
        message: 'Firebase not configured' 
      });
    }

    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token required' 
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ 
      success: true, 
      uid: decodedToken.uid,
      email: decodedToken.email 
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
});

// Serve main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Новая улучшенная версия лендинга
app.get('/improved', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'improved-landing.html'));
});

// Новая минималистичная версия в стиле Apple
app.get('/minimal', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'new-design.html'));
});

// Ультра-футуристичная версия с неоном и анимациями
app.get('/future', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ultra-modern.html'));
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'TeacherUchit API',
    version: '1.0.0',
    status: 'running',
    features: {
      firebase: firebaseInitialized,
      email: !!emailTransporter,
      rateLimit: true,
      security: true
    },
    endpoints: [
      'GET /health',
      'POST /api/send-email',
      'POST /api/verify-token',
      'GET /api/info'
    ]
  });
});

// Catch all handler for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email service: ${emailTransporter ? 'configured' : 'disabled'}`);
  console.log(`🔥 Firebase: ${firebaseInitialized ? 'initialized' : 'disabled'}`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Access: http://localhost:${PORT}`);
}); 