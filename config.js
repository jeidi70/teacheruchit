require('dotenv').config();

const config = {
  development: {
    port: process.env.PORT || 3000,
    email: {
      service: 'gmail',
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    firebase: {
      credential: require('./serviceAccountKey.json')
    },
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 минут
      max: 100 // лимит запросов с одного IP
    }
  },
  production: {
    port: process.env.PORT || 3000,
    email: {
      service: 'gmail',
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    firebase: {
      credential: require('./serviceAccountKey.json')
    },
    cors: {
      origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [],
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 50
    }
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env]; 