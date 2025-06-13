# Firebase Integration Plan для TeacherUchit

## Что даст Firebase

✅ **Real-time Database** - синхронизация данных между пользователями в реальном времени
✅ **Authentication** - готовая система регистрации и входа
✅ **Cloud Storage** - загрузка и хранение файлов материалов
✅ **Hosting** - бесплатный хостинг для статических файлов
✅ **Cloud Functions** - серверная логика (при необходимости)

## Этапы интеграции

### Этап 1: Настройка Firebase проекта
1. Создание проекта в Firebase Console
2. Подключение Authentication (Email/Password)
3. Настройка Firestore Database
4. Настройка Cloud Storage
5. Получение конфигурации

### Этап 2: Подключение к фронтенду
1. Добавление Firebase SDK
2. Инициализация Firebase
3. Настройка правил безопасности

### Этап 3: Миграция данных
1. Замена localStorage на Firestore
2. Перенос структуры данных
3. Обновление всех CRUD операций

### Этап 4: Real-time функции
1. Подписки на изменения данных
2. Live обновления в дашбордах
3. Уведомления в реальном времени

## Структура данных в Firestore

```
users/
  {userId}/
    email: string
    role: "student" | "teacher" | "admin"
    createdAt: timestamp
    lastLogin: timestamp

studentProfiles/
  {userId}/
    name: string
    city: string
    schoolId: string
    class: string
    letter: string

teacherProfiles/
  {userId}/
    name: string
    primarySubject: string
    secondarySubject: string
    schoolCode: string
    institution: string

schools/
  {schoolId}/
    name: string
    city: string
    code: string
    createdAt: timestamp
    adminId: string

materials/
  {materialId}/
    title: string
    description: string
    subject: string
    authorId: string
    fileUrl: string
    fileName: string
    status: "active" | "draft"
    createdAt: timestamp

assignments/
  {assignmentId}/
    title: string
    description: string
    subject: string
    teacherId: string
    dueDate: timestamp
    createdAt: timestamp

grades/
  {gradeId}/
    studentId: string
    assignmentId: string
    grade: number
    teacherId: string
    createdAt: timestamp
```

## Правила безопасности Firestore

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
    
    // Школы - только админы
    match /schools/{schoolId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Следующие шаги

1. **Создать Firebase проект**
2. **Получить конфигурацию**
3. **Интегрировать в код**
4. **Протестировать функциональность**
5. **Развернуть на Firebase Hosting**

## Стоимость Firebase (примерно)

**Spark Plan (Бесплатный):**
- Firestore: 50K читать/20K писать в день
- Storage: 1GB
- Authentication: безлимит
- Hosting: 10GB

**Blaze Plan (Pay-as-you-go):**
- После превышения лимитов
- ~$0.06 за 100K операций чтения
- ~$0.18 за 100K операций записи