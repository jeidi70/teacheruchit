# 🔥 Инструкция по настройке Firebase для TeacherUchit

## Шаг 1: Создание проекта Firebase

### 1.1 Переход в Firebase Console
1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Войдите в свой Google аккаунт
3. Нажмите **"Создать проект"** или **"Add project"**

### 1.2 Настройка проекта
1. **Название проекта**: `teacheruchit` (или любое другое)
2. **Google Analytics**: Можете включить (рекомендуется)
3. **Страна**: Выберите вашу страну
4. Нажмите **"Создать проект"**

## Шаг 2: Настройка Authentication

### 2.1 Включение Authentication
1. В боковом меню выберите **"Authentication"**
2. Нажмите **"Начать"** ("Get started")
3. Перейдите на вкладку **"Sign-in method"**

### 2.2 Настройка Email/Password
1. Найдите **"Email/Password"** в списке провайдеров
2. Нажмите на него
3. Включите первый переключатель **"Enable"**
4. Нажмите **"Сохранить"** ("Save")

### 2.3 Настройка доменов
1. Перейдите на вкладку **"Settings"**
2. В разделе **"Authorized domains"** добавьте:
   - `localhost` (для разработки)
   - Ваш основной домен (например, `teacheruchit.com`)

## Шаг 3: Настройка Firestore Database

### 3.1 Создание базы данных
1. В боковом меню выберите **"Firestore Database"**
2. Нажмите **"Создать базу данных"** ("Create database")
3. Выберите **"Start in test mode"** (позже изменим правила)
4. Выберите регион (ближайший к вашим пользователям)
5. Нажмите **"Готово"** ("Done")

### 3.2 Настройка правил безопасности
1. Перейдите на вкладку **"Rules"**
2. Замените содержимое на:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи могут читать/изменять только свои данные
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Профили студентов
    match /studentProfiles/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin']);
    }
    
    // Профили учителей
    match /teacherProfiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Материалы - читать все, создавать только учителя и админы
    match /materials/{materialId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin'];
    }
    
    // Школы - читать все, изменять только админы
    match /schools/{schoolId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Задания
    match /assignments/{assignmentId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin'];
    }
    
    // Оценки
    match /grades/{gradeId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin'];
    }
  }
}
```

3. Нажмите **"Опубликовать"** ("Publish")

## Шаг 4: Настройка Storage

### 4.1 Включение Storage
1. В боковом меню выберите **"Storage"**
2. Нажмите **"Начать"** ("Get started")
3. Выберите **"Start in test mode"**
4. Выберите регион (тот же, что и для Firestore)
5. Нажмите **"Готово"** ("Done")

### 4.2 Настройка правил Storage
1. Перейдите на вкладку **"Rules"**
2. Замените содержимое на:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Материалы могут загружать только учителя и админы
    match /materials/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Профильные изображения
    match /profiles/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Нажмите **"Опубликовать"** ("Publish")

## Шаг 5: Получение конфигурации

### 5.1 Настройка веб-приложения
1. В главной странице проекта нажмите на иконку **"</>"** (Web)
2. Введите название приложения: `teacheruchit-web`
3. Отметьте **"Also set up Firebase Hosting"** (по желанию)
4. Нажмите **"Зарегистрировать приложение"**

### 5.2 Копирование конфигурации
1. Скопируйте объект `firebaseConfig`
2. Откройте файл `public/index.html`
3. Найдите строку с комментарием `// Firebase конфигурация - ЗАМЕНИТЕ НА ВАШИ ДАННЫЕ`
4. Замените конфигурацию на вашу:

```javascript
const firebaseConfig = {
    apiKey: "ваш_api_key",
    authDomain: "ваш_project_id.firebaseapp.com",
    projectId: "ваш_project_id",
    storageBucket: "ваш_project_id.appspot.com",
    messagingSenderId: "ваш_sender_id",
    appId: "ваш_app_id"
};
```

## Шаг 6: Обновление HTML файлов

### 6.1 Обновление форм регистрации
Нужно заменить в файлах с формами ссылки на Firebase:

**В файлах:**
- `public/student-registration.html`
- `public/teacher-registration.html` 
- `public/role-selection.html`
- `public/student-dashboard.html`
- `public/teacher-dashboard.html`
- `public/admin-dashboard.html`

**Добавить в `<head>` каждого файла:**

```html
<!-- Firebase CDN -->
<script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
    import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
    import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
    import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

    const firebaseConfig = {
        // ВАША КОНФИГУРАЦИЯ FIREBASE
    };

    window.firebaseApp = initializeApp(firebaseConfig);
    window.firebaseAuth = getAuth(window.firebaseApp);
    window.firebaseDB = getFirestore(window.firebaseApp);
    window.firebaseStorage = getStorage(window.firebaseApp);
</script>

<!-- Firebase Forms Integration -->
<script type="module" src="/firebase-forms.js"></script>
```

### 6.2 Обновление JavaScript кода
В каждом файле нужно заменить обращения к `localStorage` на `window.teacherUchitFirebase`:

**Старый код:**
```javascript
localStorage.setItem('user', JSON.stringify(userData));
```

**Новый код:**
```javascript
await window.teacherUchitFirebase.registerStudent(formData);
```

## Шаг 7: Настройка Firebase Hosting (опционально)

### 7.1 Установка Firebase CLI
```bash
npm install -g firebase-tools
```

### 7.2 Инициализация Hosting
```bash
cd /path/to/teacheruchit
firebase login
firebase init hosting
```

### 7.3 Настройка публикации
1. Выберите ваш проект
2. Public directory: `public`
3. Single-page app: `No`
4. Настроить автодеплой: `No`

### 7.4 Деплой
```bash
firebase deploy
```

## Шаг 8: Тестирование

### 8.1 Проверка подключения
1. Откройте консоль браузера на `localhost:8000`
2. Должно появиться сообщение: "Firebase инициализирован для TeacherUchit"

### 8.2 Тестирование регистрации
1. Попробуйте зарегистрировать студента
2. Проверьте в Firebase Console -> Authentication -> Users
3. Проверьте в Firestore -> Data

### 8.3 Тестирование входа
1. Попробуйте войти с созданными данными
2. Проверьте перенаправление на соответствующий дашборд

## Шаг 9: Мониторинг и аналитика

### 9.1 Включение мониторинга
1. В боковом меню выберите **"Performance"**
2. Нажмите **"Начать"**
3. Добавьте SDK в ваш код

### 9.2 Настройка аналитики
1. В боковом меню выберите **"Analytics"**
2. Настройте события для отслеживания активности пользователей

## ⚠️ Важные замечания

### Безопасность
- Никогда не выкладывайте Firebase конфигурацию в публичные репозитории
- Регулярно проверяйте правила безопасности
- Мониторьте использование квот

### Производительность
- Оптимизируйте запросы к Firestore
- Используйте индексы для сложных запросов
- Кэшируйте данные на клиенте

### Квоты
- **Spark Plan (бесплатный):**
  - Firestore: 50K чтений/20K записей в день
  - Storage: 1GB
  - Authentication: безлимит

### Миграция данных
Если у вас есть данные в localStorage, создайте скрипт миграции:

```javascript
// Скрипт миграции localStorage -> Firebase
async function migrateLocalStorageToFirebase() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.email) {
        // Создание пользователя в Firebase
        await window.teacherUchitFirebase.registerUser(userData);
        localStorage.clear();
    }
}
```

## 🎉 Готово!

После выполнения всех шагов у вас будет:
- ✅ Полностью функциональная аутентификация
- ✅ Real-time синхронизация данных
- ✅ Безопасное хранение файлов
- ✅ Масштабируемая архитектура
- ✅ Готовность к продакшену

## Поддержка

При возникновении проблем:
1. Проверьте правила безопасности
2. Убедитесь в корректности конфигурации
3. Проверьте консоль браузера на ошибки
4. Обратитесь к [документации Firebase](https://firebase.google.com/docs)