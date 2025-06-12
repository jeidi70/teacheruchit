# TeacherUchit - Платформа для изучения Истории и Обществознания

## Описание
TeacherUchit - это образовательная платформа, предоставляющая интерактивные уроки по истории и обществознанию, практические задания и тесты, а также возможность общения с преподавателями.

## Требования
- Node.js 14.x или выше
- npm 6.x или выше
- Firebase проект
- Gmail аккаунт для отправки email

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/teacheruchit.git
cd teacheruchit
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env на основе .env.example:
```bash
cp .env.example .env
```

4. Настройте переменные окружения в файле .env:
- NODE_ENV: окружение (development/production)
- PORT: порт сервера
- EMAIL_USER: email для отправки писем
- EMAIL_PASSWORD: пароль приложения Gmail
- FIREBASE_PROJECT_ID: ID проекта Firebase
- FIREBASE_PRIVATE_KEY: приватный ключ Firebase
- FIREBASE_CLIENT_EMAIL: email клиента Firebase
- ALLOWED_ORIGINS: разрешенные домены для CORS (для production)
- JWT_SECRET: секрет для JWT
- SESSION_SECRET: секрет для сессий

5. Инициализируйте шаблоны email:
```bash
npm run init-templates
```

## Запуск

### Разработка
```bash
npm run dev
```

### Продакшн
```bash
npm start
```

## API Endpoints

### Email
- POST /send-verification - Отправка письма для верификации email
- POST /send-password-reset - Отправка письма для сброса пароля
- POST /send-welcome - Отправка приветственного письма

### Система
- GET /health - Проверка состояния сервера

## Безопасность
- Используется helmet для защиты HTTP заголовков
- Настроен CORS для контроля доступа
- Реализован rate limiting для защиты от DDoS
- Валидация всех входящих данных
- Логирование всех действий

## Логирование
Логи сохраняются в файлы:
- error.log - только ошибки
- combined.log - все логи

## Лицензия
MIT
