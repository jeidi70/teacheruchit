# 🗂️ Инструкции по очистке базы данных

## 🎯 **Цель:** 
Полностью очистить localStorage от всех пользовательских данных для начала работы с чистой базой.

## 🧹 **Способы очистки:**

### **1. Через консоль браузера (Рекомендуется)**
1. Откройте сайт `http://localhost:8000`
2. Нажмите `F12` для открытия DevTools
3. Перейдите на вкладку `Console`
4. Выполните команду:
```javascript
// Очистить всю базу данных TeacherUchit
Object.keys(localStorage).forEach(key => {
    if (key.startsWith('teacheruchit_') || 
        key === 'currentUser' || 
        key === 'userProfile') {
        localStorage.removeItem(key);
    }
});
console.log('База данных очищена!');
```

### **2. Полная очистка localStorage**
```javascript
localStorage.clear();
console.log('Весь localStorage очищен!');
```

### **3. Через настройки браузера**
1. `F12` → `Application` → `Storage` → `Local Storage`
2. Выберите `http://localhost:8000`
3. Удалите все записи вручную

## 📊 **Данные, которые будут удалены:**

### **Пользовательские аккаунты:**
- `currentUser` - текущий авторизованный пользователь
- `userProfile` - резервная копия профиля

### **Профили пользователей:**
- `teacheruchit_profile_{email}` - профили всех пользователей
- Примеры: 
  - `teacheruchit_profile_student@test.com`
  - `teacheruchit_profile_teacher@test.com`

### **Демо данные:**
- `teacheruchit_demo_users` - демо пользователи (если создавались)

## ✅ **Проверка очистки:**

После очистки выполните в консоли:
```javascript
// Проверяем остались ли данные TeacherUchit
const remainingKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('teacheruchit_') || 
    key === 'currentUser' || 
    key === 'userProfile'
);

if (remainingKeys.length === 0) {
    console.log('✅ База данных полностью очищена!');
} else {
    console.log('❌ Остались ключи:', remainingKeys);
}
```

## 🔄 **После очистки:**

1. **Обновите страницу** `F5`
2. **Проверьте перенаправление** на `auth.html`
3. **Начните регистрацию** заново
4. **Все данные создадутся** с чистого листа

## ⚠️ **Важные замечания:**

- **Очистка необратима** - все пользовательские данные будут потеряны
- **Демо аккаунты** придется создавать заново
- **Настройки браузера** не затрагиваются
- **Cookies и другие данные** не удаляются

## 🛠️ **Для разработчиков:**

### **Очистка из скрипта:**
```javascript
function clearTeacherUchitDatabase() {
    const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('teacheruchit_') || 
        key === 'currentUser' || 
        key === 'userProfile'
    );
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log(`Удалено ${keysToRemove.length} записей:`, keysToRemove);
    return keysToRemove.length;
}

// Использование
clearTeacherUchitDatabase();
```

### **Программная проверка наличия данных:**
```javascript
function checkDatabaseState() {
    const teacheruchitKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('teacheruchit_') || 
        key === 'currentUser' || 
        key === 'userProfile'
    );
    
    return {
        isEmpty: teacheruchitKeys.length === 0,
        keysCount: teacheruchitKeys.length,
        keys: teacheruchitKeys
    };
}

console.log('Состояние БД:', checkDatabaseState());
```

## 🎉 **Результат:**
После выполнения очистки система будет работать как в первый раз - никаких сохраненных данных пользователей не останется.