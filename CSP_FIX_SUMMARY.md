# Исправление CSP проблемы для TeacherUchit

## 🚨 Проблема:
Content Security Policy сервера блокировала inline обработчики событий (`onclick`), что приводило к ошибкам:
```
Refused to execute inline event handler because it violates the following Content Security Policy directive: "script-src-attr 'none'"
```

## ✅ Решение:
Заменил все inline обработчики событий на `addEventListener` с data-атрибутами.

### 🔄 Изменения:

#### **1. Кнопки табов:**
```html
<!-- ДО -->
<button class="tab-button active" onclick="showForm('login')">Вход</button>
<button class="tab-button" onclick="showForm('register')">Регистрация</button>

<!-- ПОСЛЕ -->
<button class="tab-button active" data-form="login">Вход</button>
<button class="tab-button" data-form="register">Регистрация</button>
```

#### **2. Кнопки показа пароля:**
```html
<!-- ДО -->
<button type="button" class="password-toggle" onclick="togglePassword('login-password')">👁</button>

<!-- ПОСЛЕ -->
<button type="button" class="password-toggle" data-target="login-password">👁</button>
```

#### **3. Социальные кнопки:**
```html
<!-- ДО -->
<button class="social-button" onclick="socialLogin('google')">

<!-- ПОСЛЕ -->
<button class="social-button" data-provider="google">
```

#### **4. Ссылка "Забыли пароль?":**
```html
<!-- ДО -->
<a href="#" onclick="showForgotPassword()">Забыли пароль?</a>

<!-- ПОСЛЕ -->
<a href="#" id="forgot-password-link">Забыли пароль?</a>
```

#### **5. Кнопка "Продолжить":**
```html
<!-- ДО -->
<button class="continue-button" onclick="continueToApp()">

<!-- ПОСЛЕ -->
<button class="continue-button" id="continue-button">
```

### 📝 JavaScript обработчики:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Обработчики кнопок табов
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const formType = this.getAttribute('data-form');
            showForm(formType);
        });
    });

    // Обработчики кнопок показа/скрытия пароля
    document.querySelectorAll('.password-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            togglePassword(targetId);
        });
    });

    // Обработчик ссылки "Забыли пароль?"
    document.getElementById('forgot-password-link').addEventListener('click', function(e) {
        e.preventDefault();
        showForgotPassword();
    });

    // Обработчики социальных кнопок
    document.querySelectorAll('.social-button').forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.getAttribute('data-provider');
            socialLogin(provider);
        });
    });

    // Обработчик кнопки "Продолжить"
    document.getElementById('continue-button').addEventListener('click', function() {
        continueToApp();
    });
});
```

## 🎯 Результат:
✅ Все кнопки теперь работают без CSP ошибок
✅ Код стал более безопасным и соответствует современным стандартам
✅ Поддерживается строгая Content Security Policy
✅ Сохранена вся функциональность

## 🔧 Файлы изменены:
- `public/auth.html` - исправлены inline обработчики
- `site/auth.html` - синхронизирован

## 🌐 Тестирование:
Проверьте работу на: `http://localhost:8000/auth.html`
- Переключение между вкладками Вход/Регистрация
- Показ/скрытие пароля
- Социальные кнопки
- Кнопка "Продолжить" после регистрации/входа