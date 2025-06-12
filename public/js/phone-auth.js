import { auth, phoneAuthConfig } from './firebase-config.js';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Функции для работы с аутентификацией по телефону
class PhoneAuth {
  constructor() {
    this.isVerificationSent = false;
    this.confirmationResult = null;
    this.recaptchaVerifier = null;
  }

  // Форматирование номера телефона
  formatPhoneNumber(phoneNumber) {
    // Удаляем все нецифровые символы
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Проверяем, что номер начинается с 7 или 8
    if (cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'))) {
      // Если начинается с 8, заменяем на 7
      const formatted = cleaned.startsWith('8') ? '7' + cleaned.slice(1) : cleaned;
      return '+' + formatted;
    }
    
    throw new Error('Неверный формат номера телефона');
  }

  // Инициализация reCAPTCHA
  initRecaptcha() {
    this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'normal',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log('reCAPTCHA verified');
      }
    });
  }

  // Отправка кода подтверждения
  async sendVerificationCode(phoneNumber) {
    try {
      console.log('Отправка кода на номер:', phoneNumber);
      
      // Форматируем номер телефона
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      console.log('Отформатированный номер:', formattedNumber);

      // Проверяем, является ли номер тестовым
      const isTestNumber = phoneAuthConfig.testPhoneNumbers.includes(formattedNumber);
      console.log('Тестовый номер:', isTestNumber);

      // Инициализируем reCAPTCHA если еще не инициализирована
      if (!this.recaptchaVerifier) {
        this.initRecaptcha();
      }

      // Отправляем код подтверждения
      this.confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, this.recaptchaVerifier);
      
      console.log('Код подтверждения отправлен');
      this.isVerificationSent = true;
      
      return this.confirmationResult;
    } catch (error) {
      console.error('Ошибка при отправке кода:', error);
      this.reset();
      throw error;
    }
  }

  // Проверка кода подтверждения
  async verifyCode(code) {
    try {
      if (!this.confirmationResult) {
        throw new Error('Сначала необходимо отправить код подтверждения');
      }

      console.log('Подтверждение кода:', code);
      const result = await this.confirmationResult.confirm(code);
      console.log('Код подтвержден успешно');

      // Проверяем, новый ли это пользователь
      const isNewUser = result.additionalUserInfo.isNewUser;
      console.log('Новый пользователь:', isNewUser);

      if (isNewUser) {
        await this.saveNewUserData(result.user);
      } else {
        await this.updateLastLogin(result.user);
      }

      return result;
    } catch (error) {
      console.error('Ошибка при подтверждении кода:', error);
      throw error;
    }
  }

  // Сохранение данных нового пользователя
  async saveNewUserData(user) {
    try {
      console.log('Сохранение данных нового пользователя:', user.uid);
      await firebase.firestore().collection('users').doc(user.uid).set({
        phoneNumber: user.phoneNumber,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        role: null // Роль будет установлена позже
      });
      console.log('Данные пользователя сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении данных пользователя:', error);
      throw error;
    }
  }

  // Обновление времени последнего входа
  async updateLastLogin(user) {
    try {
      console.log('Обновление времени последнего входа:', user.uid);
      await firebase.firestore().collection('users').doc(user.uid).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Время последнего входа обновлено');
    } catch (error) {
      console.error('Ошибка при обновлении времени входа:', error);
      throw error;
    }
  }

  // Сброс состояния
  reset() {
    console.log('Сброс состояния PhoneAuth');
    this.isVerificationSent = false;
    this.confirmationResult = null;
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }
}

module.exports = PhoneAuth; 