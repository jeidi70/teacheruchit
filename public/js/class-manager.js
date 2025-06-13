// Class Manager для TeacherUchit
class ClassManager {
    constructor() {
        this.classes = JSON.parse(localStorage.getItem('teacher_classes') || '[]');
        this.classIcons = this.getClassIcons();
        this.inviteLinks = JSON.parse(localStorage.getItem('class_invite_links') || '{}');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    // Получить доступные иконки для классов
    getClassIcons() {
        return [
            { id: 'icon-class', name: 'Класс', color: 'primary' },
            { id: 'icon-history', name: 'История', color: 'warning' },
            { id: 'icon-social-studies', name: 'Обществознание', color: 'primary' },
            { id: 'icon-book', name: 'Книга', color: 'success' },
            { id: 'icon-education', name: 'Образование', color: 'secondary' },
            { id: 'icon-students', name: 'Ученики', color: 'accent' },
            { id: 'icon-teacher', name: 'Учитель', color: 'error' },
            { id: 'icon-graduation', name: 'Выпуск', color: 'warning' },
            { id: 'icon-library', name: 'Библиотека', color: 'info' },
            { id: 'icon-science', name: 'Наука', color: 'success' },
            { id: 'icon-art', name: 'Искусство', color: 'secondary' },
            { id: 'icon-music', name: 'Музыка', color: 'accent' },
            { id: 'icon-sports', name: 'Спорт', color: 'error' },
            { id: 'icon-globe', name: 'Мир', color: 'info' },
            { id: 'icon-star', name: 'Звезда', color: 'warning' },
            { id: 'icon-trophy', name: 'Трофей', color: 'success' },
            { id: 'icon-medal', name: 'Медаль', color: 'warning' },
            { id: 'icon-crown', name: 'Корона', color: 'error' },
            { id: 'icon-diamond', name: 'Алмаз', color: 'accent' },
            { id: 'icon-heart', name: 'Сердце', color: 'error' }
        ];
    }

    // Создать новый класс
    createClass(classData) {
        const newClass = {
            id: 'class_' + Date.now(),
            name: classData.name,
            description: classData.description || '',
            subject: classData.subject,
            icon: classData.icon || 'icon-class',
            color: classData.color || 'primary',
            students: [],
            materials: [],
            assignments: [],
            createdAt: new Date().toISOString(),
            isActive: true,
            settings: {
                allowSelfJoin: classData.allowSelfJoin || false,
                requireApproval: classData.requireApproval || true,
                maxStudents: classData.maxStudents || 30
            }
        };

        this.classes.push(newClass);
        this.saveClasses();
        this.generateInviteLink(newClass.id);
        
        return newClass;
    }

    // Редактировать класс
    editClass(classId, updates) {
        const classIndex = this.classes.findIndex(cls => cls.id === classId);
        if (classIndex !== -1) {
            this.classes[classIndex] = { ...this.classes[classIndex], ...updates };
            this.saveClasses();
            return this.classes[classIndex];
        }
        return null;
    }

    // Удалить класс
    deleteClass(classId) {
        const classIndex = this.classes.findIndex(cls => cls.id === classId);
        if (classIndex !== -1) {
            this.classes.splice(classIndex, 1);
            this.saveClasses();
            
            // Удаляем ссылку приглашения
            delete this.inviteLinks[classId];
            this.saveInviteLinks();
            
            return true;
        }
        return false;
    }

    // Получить класс по ID
    getClass(classId) {
        return this.classes.find(cls => cls.id === classId);
    }

    // Получить все классы
    getAllClasses() {
        return this.classes;
    }

    // Генерировать ссылку приглашения
    generateInviteLink(classId) {
        const inviteCode = this.generateInviteCode();
        const inviteLink = `${window.location.origin}/join-class.html?code=${inviteCode}`;
        
        this.inviteLinks[classId] = {
            code: inviteCode,
            link: inviteLink,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 дней
            isActive: true
        };
        
        this.saveInviteLinks();
        return inviteLink;
    }

    // Генерировать код приглашения
    generateInviteCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // Получить ссылку приглашения для класса
    getInviteLink(classId) {
        return this.inviteLinks[classId];
    }

    // Добавить ученика в класс
    addStudentToClass(classId, studentData) {
        const cls = this.getClass(classId);
        if (!cls) return false;

        // Проверяем, не добавлен ли уже ученик
        if (cls.students.find(student => student.email === studentData.email)) {
            return { success: false, message: 'Ученик уже добавлен в класс' };
        }

        // Проверяем лимит учеников
        if (cls.students.length >= cls.settings.maxStudents) {
            return { success: false, message: 'Достигнут максимальный размер класса' };
        }

        const student = {
            id: studentData.id || 'student_' + Date.now(),
            email: studentData.email,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            joinedAt: new Date().toISOString(),
            status: cls.settings.requireApproval ? 'pending' : 'active',
            stats: {
                completedAssignments: 0,
                averageGrade: 0,
                lastActivity: new Date().toISOString()
            }
        };

        cls.students.push(student);
        this.saveClasses();
        
        return { success: true, student };
    }

    // Удалить ученика из класса
    removeStudentFromClass(classId, studentId) {
        const cls = this.getClass(classId);
        if (!cls) return false;

        const studentIndex = cls.students.findIndex(student => student.id === studentId);
        if (studentIndex !== -1) {
            cls.students.splice(studentIndex, 1);
            this.saveClasses();
            return true;
        }
        return false;
    }

    // Одобрить ученика
    approveStudent(classId, studentId) {
        const cls = this.getClass(classId);
        if (!cls) return false;

        const student = cls.students.find(s => s.id === studentId);
        if (student) {
            student.status = 'active';
            this.saveClasses();
            return true;
        }
        return false;
    }

    // Получить статистику класса
    getClassStats(classId) {
        const cls = this.getClass(classId);
        if (!cls) return null;

        const activeStudents = cls.students.filter(s => s.status === 'active').length;
        const pendingStudents = cls.students.filter(s => s.status === 'pending').length;
        const totalAssignments = cls.assignments.length;
        const totalMaterials = cls.materials.length;

        // Вычисляем средний балл класса
        const averageGrade = cls.students.reduce((sum, student) => {
            return sum + (student.stats.averageGrade || 0);
        }, 0) / (activeStudents || 1);

        return {
            totalStudents: cls.students.length,
            activeStudents,
            pendingStudents,
            totalAssignments,
            totalMaterials,
            averageGrade: Math.round(averageGrade * 10) / 10,
            createdAt: cls.createdAt,
            lastActivity: this.getLastClassActivity(cls)
        };
    }

    // Получить последнюю активность в классе
    getLastClassActivity(cls) {
        let lastActivity = cls.createdAt;
        
        cls.students.forEach(student => {
            if (student.stats.lastActivity > lastActivity) {
                lastActivity = student.stats.lastActivity;
            }
        });

        return lastActivity;
    }

    // Создать форму создания класса
    createClassForm() {
        return `
            <form id="createClassForm" class="create-class-form">
                <div class="form-group">
                    <label for="className" class="form-label required">Название класса</label>
                    <input type="text" id="className" name="name" class="form-input" required 
                           placeholder="Например: 10А История">
                </div>
                
                <div class="form-group">
                    <label for="classDescription" class="form-label">Описание</label>
                    <textarea id="classDescription" name="description" class="form-textarea" 
                              placeholder="Краткое описание класса..."></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="classSubject" class="form-label required">Предмет</label>
                        <select id="classSubject" name="subject" class="form-select" required>
                            <option value="">Выберите предмет</option>
                            <option value="История">История</option>
                            <option value="Обществознание">Обществознание</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="maxStudents" class="form-label">Максимум учеников</label>
                        <input type="number" id="maxStudents" name="maxStudents" class="form-input" 
                               value="30" min="1" max="50">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Выберите иконку</label>
                    <div class="icon-selector">
                        ${this.classIcons.map(icon => `
                            <div class="icon-option" data-icon="${icon.id}" data-color="${icon.color}">
                                <div class="icon-preview ${icon.color}">
                                    <svg class="icon icon-md">
                                        <use href="/assets/modern-icons.svg#${icon.id}"></use>
                                    </svg>
                                </div>
                                <span class="icon-name">${icon.name}</span>
                            </div>
                        `).join('')}
                    </div>
                    <input type="hidden" id="classIcon" name="icon" value="icon-class">
                    <input type="hidden" id="classColor" name="color" value="primary">
                </div>
                
                <div class="form-group">
                    <h4>Настройки класса</h4>
                    <div class="checkbox-group">
                        <label class="checkbox-item">
                            <input type="checkbox" name="allowSelfJoin">
                            <span class="checkbox-label">Разрешить самостоятельное присоединение</span>
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="requireApproval" checked>
                            <span class="checkbox-label">Требовать одобрение новых учеников</span>
                        </label>
                    </div>
                </div>
            </form>
        `;
    }

    // Создать карточку класса
    createClassCard(cls) {
        const stats = this.getClassStats(cls.id);
        const inviteLink = this.getInviteLink(cls.id);
        
        return `
            <div class="class-card" data-class-id="${cls.id}">
                <div class="class-header">
                    <div class="class-icon ${cls.color}">
                        <svg class="icon icon-lg">
                            <use href="/assets/modern-icons.svg#${cls.icon}"></use>
                        </svg>
                    </div>
                    <div class="class-info">
                        <h3 class="class-name">${cls.name}</h3>
                        <p class="class-description">${cls.description || 'Без описания'}</p>
                        <div class="class-meta">
                            <span class="subject-badge ${subjectsManager.getSubjectColor(cls.subject)}">
                                ${cls.subject}
                            </span>
                            <span class="class-date">Создан ${this.formatDate(cls.createdAt)}</span>
                        </div>
                    </div>
                    <div class="class-actions">
                        <button class="btn btn-sm btn-ghost" onclick="classManager.shareClass('${cls.id}')" 
                                title="Поделиться">
                            <svg class="icon icon-xs">
                                <use href="/assets/modern-icons.svg#icon-share"></use>
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="classManager.editClass('${cls.id}')" 
                                title="Редактировать">
                            <svg class="icon icon-xs">
                                <use href="/assets/modern-icons.svg#icon-edit"></use>
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="classManager.deleteClass('${cls.id}')" 
                                title="Удалить">
                            <svg class="icon icon-xs">
                                <use href="/assets/modern-icons.svg#icon-delete"></use>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="class-stats">
                    <div class="stat-item">
                        <svg class="stat-icon icon icon-sm">
                            <use href="/assets/modern-icons.svg#icon-students"></use>
                        </svg>
                        <div class="stat-info">
                            <span class="stat-value">${stats.activeStudents}</span>
                            <span class="stat-label">Учеников</span>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <svg class="stat-icon icon icon-sm">
                            <use href="/assets/modern-icons.svg#icon-assignments"></use>
                        </svg>
                        <div class="stat-info">
                            <span class="stat-value">${stats.totalAssignments}</span>
                            <span class="stat-label">Заданий</span>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <svg class="stat-icon icon icon-sm">
                            <use href="/assets/modern-icons.svg#icon-materials"></use>
                        </svg>
                        <div class="stat-info">
                            <span class="stat-value">${stats.totalMaterials}</span>
                            <span class="stat-label">Материалов</span>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <svg class="stat-icon icon icon-sm">
                            <use href="/assets/modern-icons.svg#icon-grades"></use>
                        </svg>
                        <div class="stat-info">
                            <span class="stat-value">${stats.averageGrade}</span>
                            <span class="stat-label">Ср. балл</span>
                        </div>
                    </div>
                </div>
                
                ${stats.pendingStudents > 0 ? `
                    <div class="class-notifications">
                        <div class="notification-item warning">
                            <svg class="icon icon-sm">
                                <use href="/assets/modern-icons.svg#icon-warning"></use>
                            </svg>
                            ${stats.pendingStudents} учеников ожидают одобрения
                            <button class="btn btn-xs btn-primary" onclick="classManager.showPendingStudents('${cls.id}')">
                                Просмотреть
                            </button>
                        </div>
                    </div>
                ` : ''}
                
                <div class="class-footer">
                    <button class="btn btn-primary btn-sm" onclick="classManager.openClass('${cls.id}')">
                        <svg class="icon icon-sm">
                            <use href="/assets/modern-icons.svg#icon-open"></use>
                        </svg>
                        Открыть класс
                    </button>
                    
                    <button class="btn btn-secondary btn-sm" onclick="classManager.manageStudents('${cls.id}')">
                        <svg class="icon icon-sm">
                            <use href="/assets/modern-icons.svg#icon-students"></use>
                        </svg>
                        Ученики
                    </button>
                </div>
            </div>
        `;
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Обработка выбора иконки
            if (e.target.closest('.icon-option')) {
                const option = e.target.closest('.icon-option');
                const icon = option.dataset.icon;
                const color = option.dataset.color;
                
                // Убираем выделение с других иконок
                document.querySelectorAll('.icon-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Выделяем выбранную иконку
                option.classList.add('selected');
                
                // Обновляем скрытые поля
                const iconInput = document.getElementById('classIcon');
                const colorInput = document.getElementById('classColor');
                if (iconInput) iconInput.value = icon;
                if (colorInput) colorInput.value = color;
            }
        });
    }

    // Открыть класс
    openClass(classId) {
        window.location.href = `/class-detail.html?id=${classId}`;
    }

    // Поделиться классом
    shareClass(classId) {
        const inviteLink = this.getInviteLink(classId);
        if (inviteLink) {
            this.copyToClipboard(inviteLink.link);
            this.showToast('Ссылка приглашения скопирована!', 'success');
        }
    }

    // Управление учениками
    manageStudents(classId) {
        window.location.href = `/class-students.html?id=${classId}`;
    }

    // Показать ожидающих учеников
    showPendingStudents(classId) {
        const cls = this.getClass(classId);
        const pendingStudents = cls.students.filter(s => s.status === 'pending');
        
        // Здесь можно показать модальное окно со списком ожидающих
        console.log('Pending students:', pendingStudents);
    }

    // Копировать в буфер обмена
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    // Форматирование даты
    formatDate(dateString) {
        if (!dateString) return 'Дата неизвестна';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    // Сохранение данных
    saveClasses() {
        localStorage.setItem('teacher_classes', JSON.stringify(this.classes));
    }

    saveInviteLinks() {
        localStorage.setItem('class_invite_links', JSON.stringify(this.inviteLinks));
    }

    // Показать уведомление
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
                    <use href="/assets/modern-icons.svg#icon-close"></use>
                </svg>
            </button>
        `;

        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        container.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }
}

// Создаем глобальный экземпляр
const classManager = new ClassManager();
window.classManager = classManager;