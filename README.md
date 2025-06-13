# TeacherUchit - Образовательная платформа

Современная платформа для изучения истории и обществознания с ИИ-помощником.

## 🚀 Особенности

- **ИИ-помощник DeepSeek** - интеллектуальный ассистент для ответов на вопросы
- **Интерактивный чат** - демо-версия с предустановленными ответами
- **Современный дизайн** - адаптивный интерфейс с анимациями
- **Геймификация** - система достижений и рейтингов
- **Безопасность** - защищенная среда для учеников

## � Технологии

- **Backend**: Node.js + Express 4.18.2
- **Database**: Firebase Firestore
- **Email**: Nodemailer 6.9.8
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Fonts**: Inter + JetBrains Mono
- **Icons**: Font Awesome 6.4.0

## 📦 Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd teacheruchit

# Установить зависимости
npm install

# Создать .env файл
cp .env.example .env

# Настроить Firebase и email в .env
# Запустить сервер
npm start
```

## 🌐 API Endpoints

- `GET /` - Главная страница
- `GET /health` - Статус сервера
- `POST /api/send-email` - Отправка email
- `POST /api/verify-token` - Проверка токена
- `GET /api/info` - Информация о сервере

## 🎨 Дизайн

Современный адаптивный дизайн с:
- Градиентными фонами
- Плавными анимациями
- Интерактивными элементами
- Мобильной адаптацией

### Цветовая схема
```css
--primary: #6366f1    /* Индиго */
--secondary: #8b5cf6  /* Фиолетовый */
--accent: #06b6d4     /* Голубой */
```

## 📁 Структура проекта

```
teacheruchit/
├── public/
│   ├── index.html          # Главная страница
│   └── assets/             # Статические файлы
├── src/
│   └── config/             # Конфигурация
├── scripts/                # Вспомогательные скрипты
├── server.js              # Express сервер
├── package.json           # Зависимости
└── .env.example          # Пример конфигурации
```

## 🔧 Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Проверка линтера
npm run lint

# Тестирование
npm test
```

## � Деплой

```bash
# Продакшн сборка
npm run build

# Запуск продакшн сервера
npm run start:prod
```

## 📝 Конфигурация

Создайте `.env` файл:

```env
PORT=3000
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🤝 Contributing

1. Fork проект
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Создайте Pull Request

## � Лицензия

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Автор

**TeacherUchit Team**

- Website: [teacheruchit.com](https://teacheruchit.com)
- Email: contact@teacheruchit.com

---

*Последнее обновление: Июнь 2024*
