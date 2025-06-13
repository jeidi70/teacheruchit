// Profile Editor Component для TeacherUchit
class ProfileEditor {
    constructor() {
        this.currentUser = null;
        this.avatarFile = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
    }

    loadCurrentUser() {
        // Загружаем данные текущего пользователя из localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        this.currentUser = userData;
    }

    // Создание модального окна редактирования профиля
    createProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">
                        <svg class="icon icon-md">
                            <use href="/assets/modern-icons.svg#icon-avatar-edit"></use>
                        </svg>
                        Редактировать профиль
                    </h3>
                    <button type="button" class="modal-close" onclick="this.closest('.modal-backdrop').remove()">
                        <svg class="icon icon-md">
                            <use href="/assets/modern-icons.svg#icon-error"></use>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    ${this.createProfileForm()}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-backdrop').remove()">
                        Отмена
                    </button>
                    <button type="button" class="btn btn-primary" onclick="profileEditor.saveProfile()">
                        <svg class="icon icon-sm">
                            <use href="/assets/modern-icons.svg#icon-success"></use>
                        </svg>
                        Сохранить изменения
                    </button>
                </div>
            </div>
        `;
        return modal;
    }

    // Создание формы редактирования профиля
    createProfileForm() {
        const role = this.currentUser.role || 'student';
        const profile = this.currentUser.profile || {};
        
        return `
            <form id="profileEditForm" class="profile-edit-form">
                <!-- Аватар -->
                <div class="form-group">
                    <label class="form-label">Фото профиля</label>
                    <div class="avatar-upload-container">
                        <div class="avatar-preview">
                            <div class="avatar avatar-xl" id="avatarPreview">
                                ${profile.avatar ? 
                                    `<img src="${profile.avatar}" alt="Avatar">` : 
                                    `<span>${this.getInitials(profile.name || 'User')}</span>`
                                }
                            </div>
                            <div class="avatar-upload-overlay">
                                <svg class="icon icon-lg">
                                    <use href="/assets/modern-icons.svg#icon-upload"></use>
                                </svg>
                                <span>Изменить фото</span>
                            </div>
                        </div>
                        <input type="file" id="avatarInput" accept="image/*" style="display: none;">
                        <div class="avatar-actions">
                            <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('avatarInput').click()">
                                <svg class="icon icon-sm">
                                    <use href="/assets/modern-icons.svg#icon-upload"></use>
                                </svg>
                                Загрузить фото
                            </button>
                            ${profile.avatar ? `
                                <button type="button" class="btn btn-sm btn-ghost" onclick="profileEditor.removeAvatar()">
                                    <svg class="icon icon-sm">
                                        <use href="/assets/modern-icons.svg#icon-delete"></use>
                                    </svg>
                                    Удалить
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Имя (только чтение) -->
                <div class="form-group">
                    <label class="form-label">Полное имя</label>
                    <input type="text" class="form-input" value="${profile.name || ''}" readonly>
                    <small class="form-help">Имя нельзя изменить. Обратитесь к администратору.</small>
                </div>

                <!-- Email (только чтение) -->
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" value="${this.currentUser.email || ''}" readonly>
                    <small class="form-help">Email нельзя изменить.</small>
                </div>

                ${role === 'student' ? this.createStudentFields(profile) : ''}
                ${role === 'teacher' ? this.createTeacherFields(profile) : ''}

                <!-- Дополнительные поля -->
                <div class="form-group">
                    <label for="bio" class="form-label">О себе</label>
                    <textarea id="bio" name="bio" class="form-input form-textarea" placeholder="Расскажите немного о себе...">${profile.bio || ''}</textarea>
                </div>

                <div class="form-group">
                    <label for="phone" class="form-label">Телефон</label>
                    <input type="tel" id="phone" name="phone" class="form-input" placeholder="+7 (999) 123-45-67" value="${profile.phone || ''}">
                </div>

                <div class="form-group">
                    <label for="birthDate" class="form-label">Дата рождения</label>
                    <input type="date" id="birthDate" name="birthDate" class="form-input" value="${profile.birthDate || ''}">
                </div>

                <!-- Настройки уведомлений -->
                <div class="form-group">
                    <label class="form-label">Настройки уведомлений</label>
                    <div class="checkbox-group">
                        <label class="checkbox-item">
                            <input type="checkbox" name="notifications.email" ${profile.notifications?.email !== false ? 'checked' : ''}>
                            <span class="checkbox-label">Email уведомления</span>
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="notifications.push" ${profile.notifications?.push !== false ? 'checked' : ''}>
                            <span class="checkbox-label">Push уведомления</span>
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="notifications.materials" ${profile.notifications?.materials !== false ? 'checked' : ''}>
                            <span class="checkbox-label">Уведомления о новых материалах</span>
                        </label>
                    </div>
                </div>
            </form>
        `;
    }

    // Поля для студентов
    createStudentFields(profile) {
        return `
            <!-- Город (редактируемый) -->
            <div class="form-group">
                <label for="city" class="form-label">Город</label>
                <input type="text" id="city" name="city" class="form-input" value="${profile.city || ''}" placeholder="Ваш город">
            </div>

            <!-- Класс и буква (редактируемые) -->
            <div class="form-row">
                <div class="form-group">
                    <label for="class" class="form-label">Класс</label>
                    <select id="class" name="class" class="form-input form-select">
                        <option value="">Выберите класс</option>
                        ${[5,6,7,8,9,10,11].map(num => 
                            `<option value="${num}" ${profile.class == num ? 'selected' : ''}>${num} класс</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="letter" class="form-label">Буква</label>
                    <input type="text" id="letter" name="letter" class="form-input" value="${profile.letter || ''}" placeholder="А" maxlength="1" style="text-transform: uppercase;">
                </div>
            </div>

            <!-- Школа (только чтение) -->
            <div class="form-group">
                <label class="form-label">Школа</label>
                <input type="text" class="form-input" value="${profile.school || 'Не указана'}" readonly>
                <small class="form-help">Школу нельзя изменить. Обратитесь к администратору.</small>
            </div>

            <!-- Интересы -->
            <div class="form-group">
                <label for="interests" class="form-label">Интересы и хобби</label>
                <input type="text" id="interests" name="interests" class="form-input" value="${profile.interests || ''}" placeholder="Спорт, музыка, чтение...">
            </div>
        `;
    }

    // Поля для учителей
    createTeacherFields(profile) {
        const subjects = [
            'История',
            'Обществознание', 
            'Экономика',
            'Право',
            'Философия',
            'Политология'
        ];

        return `
            <!-- Предметы (редактируемые) -->
            <div class="form-row">
                <div class="form-group">
                    <label for="primarySubject" class="form-label required">Основной предмет</label>
                    <select id="primarySubject" name="primarySubject" class="form-input form-select" required>
                        <option value="">Выберите предмет</option>
                        ${subjects.map(subject => 
                            `<option value="${subject}" ${profile.primarySubject === subject ? 'selected' : ''}>${subject}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="secondarySubject" class="form-label">Дополнительный предмет</label>
                    <select id="secondarySubject" name="secondarySubject" class="form-input form-select">
                        <option value="">Выберите предмет</option>
                        ${subjects.map(subject => 
                            `<option value="${subject}" ${profile.secondarySubject === subject ? 'selected' : ''}>${subject}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>

            <!-- Учебное заведение (редактируемое) -->
            <div class="form-group">
                <label for="institution" class="form-label">Учебное заведение</label>
                <input type="text" id="institution" name="institution" class="form-input" value="${profile.institution || ''}" placeholder="Название школы, университета...">
            </div>

            <!-- Школьный код (только чтение) -->
            <div class="form-group">
                <label class="form-label">Школьный код</label>
                <input type="text" class="form-input" value="${profile.schoolCode || 'Не указан'}" readonly>
                <small class="form-help">Школьный код нельзя изменить.</small>
            </div>

            <!-- Опыт работы -->
            <div class="form-group">
                <label for="experience" class="form-label">Опыт работы (лет)</label>
                <input type="number" id="experience" name="experience" class="form-input" value="${profile.experience || ''}" min="0" max="50" placeholder="5">
            </div>

            <!-- Квалификация -->
            <div class="form-group">
                <label for="qualification" class="form-label">Квалификация</label>
                <select id="qualification" name="qualification" class="form-input form-select">
                    <option value="">Выберите квалификацию</option>
                    <option value="bachelor" ${profile.qualification === 'bachelor' ? 'selected' : ''}>Бакалавр</option>
                    <option value="master" ${profile.qualification === 'master' ? 'selected' : ''}>Магистр</option>
                    <option value="phd" ${profile.qualification === 'phd' ? 'selected' : ''}>Кандидат наук</option>
                    <option value="doctor" ${profile.qualification === 'doctor' ? 'selected' : ''}>Доктор наук</option>
                </select>
            </div>
        `;
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Обработчик загрузки аватара
        document.addEventListener('change', (e) => {
            if (e.target.id === 'avatarInput') {
                this.handleAvatarUpload(e);
            }
        });

        // Обработчик клика на аватар
        document.addEventListener('click', (e) => {
            if (e.target.closest('.avatar-upload-overlay')) {
                document.getElementById('avatarInput')?.click();
            }
        });
    }

    // Обработка загрузки аватара
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Проверка типа файла
        if (!file.type.startsWith('image/')) {
            this.showToast('Пожалуйста, выберите изображение', 'error');
            return;
        }

        // Проверка размера файла (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Размер файла не должен превышать 5MB', 'error');
            return;
        }

        this.avatarFile = file;

        // Предварительный просмотр
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('avatarPreview');
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Avatar Preview">`;
            }
        };
        reader.readAsDataURL(file);
    }

    // Удаление аватара
    removeAvatar() {
        this.avatarFile = null;
        const preview = document.getElementById('avatarPreview');
        if (preview) {
            const name = this.currentUser.profile?.name || 'User';
            preview.innerHTML = `<span>${this.getInitials(name)}</span>`;
        }
        
        // Обновляем данные пользователя
        if (this.currentUser.profile) {
            delete this.currentUser.profile.avatar;
            localStorage.setItem('user', JSON.stringify(this.currentUser));
        }
        
        this.showToast('Фото профиля удалено', 'success');
    }

    // Получение инициалов из имени
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Сохранение профиля
    async saveProfile() {
        const form = document.getElementById('profileEditForm');
        if (!form) return;

        const formData = new FormData(form);
        const updatedProfile = { ...this.currentUser.profile };

        // Обновляем данные из формы
        for (const [key, value] of formData.entries()) {
            if (key.includes('.')) {
                // Обработка вложенных объектов (например, notifications.email)
                const [parent, child] = key.split('.');
                if (!updatedProfile[parent]) updatedProfile[parent] = {};
                updatedProfile[parent][child] = value === 'on';
            } else {
                updatedProfile[key] = value;
            }
        }

        // Обработка чекбоксов уведомлений
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const name = checkbox.name;
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                if (!updatedProfile[parent]) updatedProfile[parent] = {};
                updatedProfile[parent][child] = checkbox.checked;
            }
        });

        // Обработка аватара
        if (this.avatarFile) {
            try {
                const avatarUrl = await this.uploadAvatar(this.avatarFile);
                updatedProfile.avatar = avatarUrl;
            } catch (error) {
                this.showToast('Ошибка загрузки фото: ' + error.message, 'error');
                return;
            }
        }

        // Сохраняем обновленные данные
        this.currentUser.profile = updatedProfile;
        this.currentUser.lastUpdated = new Date().toISOString();
        
        localStorage.setItem('user', JSON.stringify(this.currentUser));

        // Закрываем модальное окно
        document.querySelector('.modal-backdrop')?.remove();

        // Обновляем отображение профиля на странице
        this.updateProfileDisplay();

        this.showToast('Профиль успешно обновлен!', 'success');
    }

    // Загрузка аватара (имитация)
    async uploadAvatar(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Ошибка чтения файла'));
            reader.readAsDataURL(file);
        });
    }

    // Обновление отображения профиля на странице
    updateProfileDisplay() {
        const profile = this.currentUser.profile;
        
        // Обновляем аватары на странице
        document.querySelectorAll('.user-avatar').forEach(avatar => {
            if (profile.avatar) {
                avatar.innerHTML = `<img src="${profile.avatar}" alt="Avatar">`;
            } else {
                avatar.innerHTML = `<span>${this.getInitials(profile.name || 'User')}</span>`;
            }
        });

        // Обновляем имя пользователя
        document.querySelectorAll('.user-name').forEach(nameEl => {
            nameEl.textContent = profile.name || 'Пользователь';
        });

        // Обновляем другие элементы профиля
        const roleEl = document.querySelector('.user-role');
        if (roleEl) {
            const roleText = this.currentUser.role === 'student' ? 'Студент' : 'Преподаватель';
            roleEl.textContent = roleText;
        }

        // Триггерим событие обновления профиля
        window.dispatchEvent(new CustomEvent('profileUpdated', {
            detail: { user: this.currentUser }
        }));
    }

    // Показ уведомления
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} show`;
        
        const iconMap = {
            success: 'icon-success',
            error: 'icon-error',
            warning: 'icon-warning',
            info: 'icon-info'
        };

        toast.innerHTML = `
            <svg class="toast-icon icon icon-sm">
                <use href="/assets/modern-icons.svg#${iconMap[type]}"></use>
            </svg>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <svg class="icon icon-sm">
                    <use href="/assets/modern-icons.svg#icon-error"></use>
                </svg>
            </button>
        `;

        // Добавляем контейнер для уведомлений, если его нет
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        container.appendChild(toast);

        // Автоматически удаляем через 5 секунд
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // Открытие модального окна редактирования
    openProfileEditor() {
        const modal = this.createProfileModal();
        document.body.appendChild(modal);
        
        // Показываем модальное окно с анимацией
        setTimeout(() => {
            modal.classList.add('show');
            modal.querySelector('.modal').classList.add('show');
        }, 10);
    }
}

// Создаем глобальный экземпляр
const profileEditor = new ProfileEditor();

// Экспортируем для использования в других файлах
window.profileEditor = profileEditor;