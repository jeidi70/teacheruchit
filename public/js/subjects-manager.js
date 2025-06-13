// Subjects Manager для TeacherUchit - обновленная версия
class SubjectsManager {
    constructor() {
        // Только История и Обществознание для учителей
        this.teacherSubjects = [
            {
                id: 'history',
                name: 'История',
                icon: 'icon-history',
                color: 'warning',
                description: 'Изучение исторических событий и процессов'
            },
            {
                id: 'social-studies',
                name: 'Обществознание',
                icon: 'icon-social-studies',
                color: 'primary',
                description: 'Основы общественных наук и социальных отношений'
            }
        ];

        // Все предметы для студентов (расширенный список)
        this.allSubjects = [
            {
                id: 'history',
                name: 'История',
                icon: 'icon-history',
                color: 'warning',
                description: 'Изучение исторических событий и процессов'
            },
            {
                id: 'social-studies',
                name: 'Обществознание',
                icon: 'icon-social-studies',
                color: 'primary',
                description: 'Основы общественных наук и социальных отношений'
            },
            {
                id: 'economics',
                name: 'Экономика',
                icon: 'icon-economics',
                color: 'success',
                description: 'Экономические теории и практические основы'
            },
            {
                id: 'law',
                name: 'Право',
                icon: 'icon-law',
                color: 'error',
                description: 'Правовые основы и юридические знания'
            },
            {
                id: 'philosophy',
                name: 'Философия',
                icon: 'icon-philosophy',
                color: 'secondary',
                description: 'Философские концепции и мировоззренческие вопросы'
            },
            {
                id: 'political-science',
                name: 'Политология',
                icon: 'icon-political-science',
                color: 'accent',
                description: 'Политические системы и государственное устройство'
            }
        ];

        // Список школ
        this.schools = [
            { id: 'school_001', name: 'МБОУ СОШ №1 им. А.С. Пушкина', city: 'Москва' },
            { id: 'school_002', name: 'МБОУ Гимназия №2', city: 'Москва' },
            { id: 'school_003', name: 'МБОУ Лицей №3', city: 'Москва' },
            { id: 'school_004', name: 'МБОУ СОШ №5 им. М.В. Ломоносова', city: 'Санкт-Петербург' },
            { id: 'school_005', name: 'МБОУ Гимназия №7', city: 'Санкт-Петербург' },
            { id: 'school_006', name: 'МБОУ СОШ №10', city: 'Екатеринбург' },
            { id: 'school_007', name: 'МБОУ Лицей №12', city: 'Новосибирск' },
            { id: 'school_008', name: 'МБОУ СОШ №15', city: 'Казань' },
            { id: 'school_009', name: 'МБОУ Гимназия №18', city: 'Нижний Новгород' },
            { id: 'school_010', name: 'МБОУ СОШ №20', city: 'Челябинск' },
            { id: 'school_011', name: 'МБОУ Лицей №25', city: 'Самара' },
            { id: 'school_012', name: 'МБОУ СОШ №30', city: 'Омск' },
            { id: 'school_013', name: 'МБОУ Гимназия №35', city: 'Ростов-на-Дону' },
            { id: 'school_014', name: 'МБОУ СОШ №40', city: 'Уфа' },
            { id: 'school_015', name: 'МБОУ Лицей №45', city: 'Красноярск' }
        ];

        this.init();
    }

    init() {
        this.removeGeographyFromData();
        this.updateSubjectSelectors();
        this.setupMutuallyExclusiveSubjects();
    }

    // Получить предметы в зависимости от роли
    getSubjectsForRole(role) {
        return role === 'teacher' ? this.teacherSubjects : this.allSubjects;
    }

    // Получить все школы
    getSchools() {
        return this.schools;
    }

    // Получить школы по городу
    getSchoolsByCity(city) {
        return this.schools.filter(school => school.city === city);
    }

    // Получить уникальные города
    getCities() {
        return [...new Set(this.schools.map(school => school.city))].sort();
    }

    // Настройка взаимоисключающих предметов
    setupMutuallyExclusiveSubjects() {
        document.addEventListener('change', (e) => {
            if (e.target.name === 'primarySubject' || e.target.name === 'secondarySubject') {
                this.handleSubjectChange(e.target);
            }
        });
    }

    // Обработка изменения предмета
    handleSubjectChange(changedSelect) {
        const form = changedSelect.closest('form');
        if (!form) return;

        const primarySelect = form.querySelector('select[name="primarySubject"]');
        const secondarySelect = form.querySelector('select[name="secondarySubject"]');

        if (!primarySelect || !secondarySelect) return;

        const primaryValue = primarySelect.value;
        const secondaryValue = secondarySelect.value;

        // Обновляем опции в зависимости от выбранного значения
        this.updateSelectOptions(primarySelect, secondaryValue);
        this.updateSelectOptions(secondarySelect, primaryValue);
    }

    // Обновление опций селекта с исключением выбранного значения
    updateSelectOptions(select, excludeValue) {
        const currentValue = select.value;
        const isTeacher = this.isTeacherForm(select);
        const subjects = isTeacher ? this.teacherSubjects : this.allSubjects;

        // Очищаем и заполняем заново
        select.innerHTML = '';
        
        // Добавляем пустую опцию
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Выберите предмет';
        select.appendChild(emptyOption);

        // Добавляем предметы, исключая уже выбранный
        subjects.forEach(subject => {
            if (subject.name !== excludeValue) {
                const option = document.createElement('option');
                option.value = subject.name;
                option.textContent = subject.name;
                select.appendChild(option);
            }
        });

        // Восстанавливаем значение, если оно не исключено
        if (currentValue && currentValue !== excludeValue) {
            select.value = currentValue;
        }
    }

    // Определение, является ли форма учительской
    isTeacherForm(element) {
        const form = element.closest('form');
        if (!form) return false;
        
        // Проверяем наличие полей, характерных для учителей
        return form.querySelector('input[name="experience"]') || 
               form.querySelector('select[name="qualification"]') ||
               element.closest('.teacher-form');
    }

    // Обновить все селекторы предметов на странице
    updateSubjectSelectors() {
        const selectors = document.querySelectorAll('select[name="primarySubject"], select[name="secondarySubject"], select[name="subject"]');
        
        selectors.forEach(select => {
            const currentValue = select.value;
            const isTeacher = this.isTeacherForm(select);
            const subjects = isTeacher ? this.teacherSubjects : this.allSubjects;
            
            // Очищаем опции
            select.innerHTML = '';
            
            // Добавляем пустую опцию
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Выберите предмет';
            select.appendChild(emptyOption);
            
            // Добавляем предметы
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.name;
                option.textContent = subject.name;
                select.appendChild(option);
            });
            
            // Восстанавливаем значение, если оно валидно
            if (currentValue && subjects.find(s => s.name === currentValue)) {
                select.value = currentValue;
            }
        });
    }

    // Обновить селекторы школ
    updateSchoolSelectors() {
        const selectors = document.querySelectorAll('select[name="school"], select[name="schoolName"]');
        
        selectors.forEach(select => {
            const currentValue = select.value;
            
            // Очищаем опции
            select.innerHTML = '';
            
            // Добавляем пустую опцию
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Выберите школу';
            select.appendChild(emptyOption);
            
            // Группируем по городам
            const cities = this.getCities();
            cities.forEach(city => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = city;
                
                const citySchools = this.getSchoolsByCity(city);
                citySchools.forEach(school => {
                    const option = document.createElement('option');
                    option.value = school.name;
                    option.textContent = school.name;
                    optgroup.appendChild(option);
                });
                
                select.appendChild(optgroup);
            });
            
            // Восстанавливаем значение
            if (currentValue) {
                select.value = currentValue;
            }
        });
    }

    // Добавить новую школу (для админ панели)
    addSchool(schoolData) {
        const newSchool = {
            id: `school_${Date.now()}`,
            name: schoolData.name,
            city: schoolData.city
        };
        
        this.schools.push(newSchool);
        this.saveSchoolsToStorage();
        this.updateSchoolSelectors();
        
        return newSchool;
    }

    // Добавить новый предмет (для админ панели)
    addSubject(subjectData) {
        const newSubject = {
            id: subjectData.id || subjectData.name.toLowerCase().replace(/\s+/g, '-'),
            name: subjectData.name,
            icon: subjectData.icon || 'icon-materials',
            color: subjectData.color || 'primary',
            description: subjectData.description || ''
        };
        
        // Добавляем в общий список
        this.allSubjects.push(newSubject);
        
        // Если это основной предмет для учителей, добавляем и туда
        if (subjectData.isTeacherSubject) {
            this.teacherSubjects.push(newSubject);
        }
        
        this.saveSubjectsToStorage();
        this.updateSubjectSelectors();
        
        return newSubject;
    }

    // Сохранение школ в localStorage
    saveSchoolsToStorage() {
        localStorage.setItem('schools', JSON.stringify(this.schools));
    }

    // Сохранение предметов в localStorage
    saveSubjectsToStorage() {
        localStorage.setItem('teacherSubjects', JSON.stringify(this.teacherSubjects));
        localStorage.setItem('allSubjects', JSON.stringify(this.allSubjects));
    }

    // Загрузка данных из localStorage
    loadFromStorage() {
        try {
            const savedSchools = localStorage.getItem('schools');
            if (savedSchools) {
                this.schools = JSON.parse(savedSchools);
            }
            
            const savedTeacherSubjects = localStorage.getItem('teacherSubjects');
            if (savedTeacherSubjects) {
                this.teacherSubjects = JSON.parse(savedTeacherSubjects);
            }
            
            const savedAllSubjects = localStorage.getItem('allSubjects');
            if (savedAllSubjects) {
                this.allSubjects = JSON.parse(savedAllSubjects);
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }

    // Создание формы добавления предмета для админ панели
    createAddSubjectForm() {
        return `
            <form id="addSubjectForm" class="add-subject-form">
                <div class="form-group">
                    <label for="subjectName" class="form-label required">Название предмета</label>
                    <input type="text" id="subjectName" name="name" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label for="subjectDescription" class="form-label">Описание</label>
                    <textarea id="subjectDescription" name="description" class="form-input form-textarea" placeholder="Краткое описание предмета"></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="subjectIcon" class="form-label">Иконка</label>
                        <select id="subjectIcon" name="icon" class="form-input form-select">
                            <option value="icon-materials">Материалы</option>
                            <option value="icon-history">История</option>
                            <option value="icon-social-studies">Обществознание</option>
                            <option value="icon-economics">Экономика</option>
                            <option value="icon-law">Право</option>
                            <option value="icon-philosophy">Философия</option>
                            <option value="icon-political-science">Политология</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="subjectColor" class="form-label">Цвет</label>
                        <select id="subjectColor" name="color" class="form-input form-select">
                            <option value="primary">Синий</option>
                            <option value="secondary">Фиолетовый</option>
                            <option value="success">Зеленый</option>
                            <option value="warning">Оранжевый</option>
                            <option value="error">Красный</option>
                            <option value="accent">Голубой</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-item">
                        <input type="checkbox" name="isTeacherSubject">
                        <span class="checkbox-label">Доступен для учителей</span>
                    </label>
                </div>
            </form>
        `;
    }

    // Создание формы добавления школы для админ панели
    createAddSchoolForm() {
        return `
            <form id="addSchoolForm" class="add-school-form">
                <div class="form-group">
                    <label for="schoolName" class="form-label required">Название школы</label>
                    <input type="text" id="schoolName" name="name" class="form-input" required placeholder="МБОУ СОШ №...">
                </div>
                
                <div class="form-group">
                    <label for="schoolCity" class="form-label required">Город</label>
                    <input type="text" id="schoolCity" name="city" class="form-input" required placeholder="Москва">
                </div>
            </form>
        `;
    }

    // Удаление географии из существующих данных
    removeGeographyFromData() {
        try {
            // Удаляем из данных пользователей
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            let updated = false;

            users.forEach(user => {
                if (user.profile) {
                    // Для учителей - заменяем географию на пустое значение
                    if (user.profile.primarySubject === 'География') {
                        user.profile.primarySubject = '';
                        updated = true;
                    }
                    if (user.profile.secondarySubject === 'География') {
                        user.profile.secondarySubject = '';
                        updated = true;
                    }
                    
                    // Для студентов - удаляем из интересов
                    if (user.profile.interests && user.profile.interests.includes('География')) {
                        user.profile.interests = user.profile.interests.replace(/География,?\s*/g, '');
                        updated = true;
                    }
                }
            });

            if (updated) {
                localStorage.setItem('users', JSON.stringify(users));
            }

            // Удаляем из текущего пользователя
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser.profile) {
                let userUpdated = false;
                
                if (currentUser.profile.primarySubject === 'География') {
                    currentUser.profile.primarySubject = '';
                    userUpdated = true;
                }
                if (currentUser.profile.secondarySubject === 'География') {
                    currentUser.profile.secondarySubject = '';
                    userUpdated = true;
                }
                if (currentUser.profile.interests && currentUser.profile.interests.includes('География')) {
                    currentUser.profile.interests = currentUser.profile.interests.replace(/География,?\s*/g, '');
                    userUpdated = true;
                }

                if (userUpdated) {
                    localStorage.setItem('user', JSON.stringify(currentUser));
                }
            }

            console.log('География успешно удалена из всех данных');
            
        } catch (error) {
            console.error('Ошибка при удалении географии:', error);
        }
    }

    // Остальные методы остаются без изменений...
    getAllSubjects() {
        return this.allSubjects;
    }

    getSubjectById(id) {
        return this.allSubjects.find(subject => subject.id === id);
    }

    getSubjectByName(name) {
        return this.allSubjects.find(subject => subject.name === name);
    }

    getSubjectIcon(subjectName) {
        const subject = this.getSubjectByName(subjectName);
        return subject ? subject.icon : 'icon-materials';
    }

    getSubjectColor(subjectName) {
        const subject = this.getSubjectByName(subjectName);
        return subject ? subject.color : 'primary';
    }

    createSubjectBadge(subjectName) {
        const subject = this.getSubjectByName(subjectName);
        if (!subject) return '';

        return `
            <span class="subject-badge ${subject.color}">
                <svg class="icon icon-xs">
                    <use href="/assets/modern-icons.svg#${subject.icon}"></use>
                </svg>
                ${subject.name}
            </span>
        `;
    }

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
const subjectsManager = new SubjectsManager();
window.subjectsManager = subjectsManager;

// Автоматически обновляем селекторы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    subjectsManager.loadFromStorage();
    subjectsManager.updateSubjectSelectors();
    subjectsManager.updateSchoolSelectors();
});

// Обновляем селекторы при динамическом добавлении элементов
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
                const subjectSelectors = node.querySelectorAll ? 
                    node.querySelectorAll('select[name="primarySubject"], select[name="secondarySubject"], select[name="subject"]') : 
                    [];
                const schoolSelectors = node.querySelectorAll ? 
                    node.querySelectorAll('select[name="school"], select[name="schoolName"]') : 
                    [];
                    
                if (subjectSelectors.length > 0 || schoolSelectors.length > 0) {
                    setTimeout(() => {
                        subjectsManager.updateSubjectSelectors();
                        subjectsManager.updateSchoolSelectors();
                    }, 100);
                }
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });