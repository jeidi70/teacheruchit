const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Инициализация Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkTemplates() {
  try {
    const templates = await db.collection('emailTemplates').get();
    
    console.log('Найденные шаблоны:');
    templates.forEach(doc => {
      console.log(`\nШаблон: ${doc.id}`);
      console.log('Тема:', doc.data().subject);
      console.log('HTML:', doc.data().html.substring(0, 100) + '...');
    });
  } catch (error) {
    console.error('Ошибка при проверке шаблонов:', error);
  } finally {
    // Закрываем соединение с Firebase
    admin.app().delete();
  }
}

checkTemplates(); 