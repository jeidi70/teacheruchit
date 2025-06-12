# TeacherUchit

Образовательная платформа для учителей и учеников, специализирующаяся на преподавании истории и обществознания.

## Особенности

- Авторизация для учителей и учеников
- Управление уроками и тестами
- Отслеживание прогресса обучения
- Интерактивные материалы
- Система оценок и отчетности

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/teacheruchit.git
cd teacheruchit
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл конфигурации:
```bash
cp serviceAccountKey.example.json serviceAccountKey.json
```

4. Заполните необходимые данные в файле `serviceAccountKey.json`

## Запуск

Для разработки:
```bash
npm run dev
```

Для продакшена:
```bash
npm start
```

## Структура проекта

```
teacheruchit/
├── public/              # Статические файлы
│   ├── assets/         # Изображения и медиа
│   ├── css/            # Стили
│   ├── js/             # Клиентские скрипты
│   └── *.html          # HTML страницы
├── server.js           # Основной файл сервера
├── config.js           # Конфигурация сервера
├── firebase-config.js  # Конфигурация Firebase
└── package.json        # Зависимости и скрипты
```

## Технологии

- Node.js
- Express
- Firebase
- Tailwind CSS
- HTML5/CSS3/JavaScript

## Лицензия

ISC
