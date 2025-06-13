# TeacherUchit 📚

Современная образовательная платформа для эффективного взаимодействия учителей и учеников.

## 🌟 Особенности

- **Аутентификация**: Вход через email/пароль и телефон с SMS-подтверждением
- **Роли пользователей**: Отдельные интерфейсы для учителей и учеников
- **Управление уроками**: Создание, редактирование и организация учебных материалов
- **Система тестирования**: Создание тестов и автоматическая проверка
- **Отслеживание прогресса**: Детальная аналитика успеваемости
- **Email уведомления**: Автоматические уведомления о важных событиях
- **Безопасность**: Современные методы защиты данных

## 🚀 Технологии

### Frontend
- **HTML5/CSS3**: Адаптивный дизайн с современным UI
- **JavaScript (ES6+)**: Интерактивность и динамический контент
- **Firebase SDK**: Аутентификация и работа с базой данных

### Backend
- **Node.js**: Серверная часть
- **Express.js**: Веб-фреймворк
- **Firebase Admin SDK**: Серверное управление Firebase
- **Nodemailer**: Отправка email уведомлений

### База данных
- **Cloud Firestore**: NoSQL база данных в реальном времени
- **Firebase Storage**: Хранение файлов и изображений

### Безопасность
- **Helmet.js**: Защита HTTP заголовков
- **CORS**: Контроль доступа к ресурсам
- **Rate Limiting**: Защита от спама и атак
- **Firebase Security Rules**: Контроль доступа к данным

## 📦 Установка

### Предварительные требования
- Node.js (версия 18.0.0 или выше)
- npm или yarn
- Аккаунт Firebase
- Аккаунт Gmail для отправки email

### Пошаговая установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/yourusername/teacher-uchit.git
   cd teacher-uchit
   ```

2. **Установите зависимости**
   ```bash
   npm install
   ```

3. **Настройте Firebase**
   - Создайте проект в [Firebase Console](https://console.firebase.google.com)
   - Включите Authentication (Email/Password и Phone)
   - Создайте базу данных Firestore
   - Сгенерируйте приватный ключ сервисного аккаунта
   - Сохраните его как `serviceAccountKey.json` в корне проекта

4. **Настройте переменные окружения**
   ```bash
   cp .env.example .env
   ```
   Отредактируйте `.env` файл с вашими настройками:
   ```env
   NODE_ENV=development
   PORT=3000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

5. **Настройте email**
   - Включите двухфакторную аутентификацию в Gmail
   - Создайте пароль приложения
   - Добавьте данные в `.env` файл

6. **Инициализируйте email шаблоны**
   ```bash
   npm run init-templates
   ```

7. **Запустите сервер**
   ```bash
   # Разработка
   npm run dev
   
   # Продакшн
   npm start
   ```

## 🔧 Конфигурация

### Firebase Security Rules
Правила безопасности находятся в файле `firestore.rules`. Для применения используйте:
```bash
firebase deploy --only firestore:rules
```

### Email Templates
Шаблоны email настраиваются в `server.js`. Доступные шаблоны:
- `verification` - подтверждение регистрации
- `passwordReset` - сброс пароля
- `welcome` - приветственное письмо

### Phone Authentication
Для телефонной аутентификации необходимо:
1. Настроить reCAPTCHA в Firebase Console
2. Добавить домен в список разрешенных
3. Настроить SMS провайдера (по умолчанию Firebase)

## 📁 Структура проекта

```
teacher-uchit/
├── public/                 # Статические файлы
│   ├── assets/            # Изображения и стили
│   ├── css/               # CSS файлы
│   ├── js/                # JavaScript файлы
│   └── *.html             # HTML страницы
├── src/                   # Исходный код
│   └── config/            # Конфигурационные файлы
├── scripts/               # Служебные скрипты
├── server.js              # Основной серверный файл
├── firestore.rules        # Правила безопасности Firestore
├── package.json           # Зависимости проекта
└── README.md             # Документация
```

## 🎯 Использование

### Для учителей
1. Регистрация с ролью "Преподаватель"
2. Создание классов и добавление учеников
3. Создание уроков и учебных материалов
4. Разработка тестов и заданий
5. Отслеживание прогресса учеников

### Для учеников
1. Регистрация с ролью "Ученик"
2. Присоединение к классу преподавателя
3. Изучение материалов уроков
4. Прохождение тестов
5. Просмотр своего прогресса

## 🔐 Безопасность

Проект использует многоуровневую систему безопасности:

- **Аутентификация**: Firebase Authentication
- **Авторизация**: Custom claims и Firestore rules
- **Защита API**: Rate limiting и CORS
- **Шифрование**: HTTPS в продакшн
- **Валидация**: Серверная и клиентская валидация данных

## 🚀 Деплой

### Vercel (рекомендуется)
```bash
npm install -g vercel
vercel --prod
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔄 API Endpoints

### Authentication
- `POST /api/verify-token` - Проверка Firebase токена

### Email Service
- `POST /api/send-email` - Отправка email уведомлений

### Health Check
- `GET /health` - Проверка состояния сервера

## 🐛 Отладка

### Логи
Логи сервера выводятся в консоль. В продакшн рекомендуется использовать:
- Winston для структурированного логирования
- Sentry для отслеживания ошибок

### Общие проблемы
1. **Firebase SDK не инициализирован** - проверьте `serviceAccountKey.json`
2. **Email не отправляются** - проверьте настройки Gmail и пароль приложения
3. **CORS ошибки** - добавьте ваш домен в список разрешенных

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

## 📜 Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле `LICENSE`.

## 👥 Команда

- **Backend разработка**: Firebase, Node.js, Express
- **Frontend разработка**: HTML5, CSS3, JavaScript
- **UI/UX дизайн**: Современный адаптивный интерфейс
- **DevOps**: CI/CD, деплой, мониторинг

## 📞 Поддержка

Если у вас есть вопросы или предложения:
- Создайте Issue в GitHub
- Напишите на email: support@teacheruchit.com
- Телеграм: @teacheruchit_support

---

**TeacherUchit** - делаем образование доступным и эффективным! 🎓
