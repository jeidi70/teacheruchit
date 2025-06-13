// Subjects Manager для TeacherUchit
class SubjectsManager {
    constructor() {
        this.subjects = [
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
        
        this.init();
    }

    init() {
        this.removeGeographyFromData();
        this.updateSubjectSelectors();
    }

    // Удаление географии из существующих данных
    removeGeographyFromData() {
        try {
            // Удаляем из данных пользователей
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            let updated = false;

            users.forEach(user => {
                if (user.profile) {
                    // Для учителей
                    if (user.profile.primarySubject === 'География') {
                        user.profile.primarySubject = '';
                        updated = true;
                    }
                    if (user.profile.secondarySubject === 'География') {
                        user.profile.secondarySubject = '';
                        updated = true;
                    }
                    
                    // Для студентов - удаляем из интересов если есть
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

            // Удаляем материалы по географии
            const materials = JSON.parse(localStorage.getItem('materials') || '[]');
            const filteredMaterials = materials.filter(material => 
                material.subject !== 'География' && material.subject !== 'география'
            );
            
            if (filteredMaterials.length !== materials.length) {
                localStorage.setItem('materials', JSON.stringify(filteredMaterials));
            }

            // Удаляем задания по географии
            const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
            const filteredAssignments = assignments.filter(assignment => 
                assignment.subject !== 'География' && assignment.subject !== 'география'
            );
            
            if (filteredAssignments.length !== assignments.length) {
                localStorage.setItem('assignments', JSON.stringify(filteredAssignments));
            }

            console.log('География успешно удалена из всех данных');
            
        } catch (error) {
            console.error('Ошибка при удалении географии:', error);
        }
    }

    // Получить все предметы
    getAllSubjects() {
        return this.subjects;
    }

    // Получить предмет по ID
    getSubjectById(id) {
        return this.subjects.find(subject => subject.id === id);
    }

    // Получить предмет по названию
    getSubjectByName(name) {
        return this.subjects.find(subject => subject.name === name);
    }

    // Получить иконку предмета
    getSubjectIcon(subjectName) {
        const subject = this.getSubjectByName(subjectName);
        return subject ? subject.icon : 'icon-materials';
    }

    // Получить цвет предмета
    getSubjectColor(subjectName) {
        const subject = this.getSubjectByName(subjectName);
        return subject ? subject.color : 'primary';
    }

    // Создать бейдж предмета
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

    // Обновить все селекторы предметов на странице
    updateSubjectSelectors() {
        const selectors = document.querySelectorAll('select[name="primarySubject"], select[name="secondarySubject"], select[name="subject"]');
        
        selectors.forEach(select => {
            // Сохраняем текущее значение
            const currentValue = select.value;
            
            // Очищаем опции (кроме первой пустой)
            const firstOption = select.querySelector('option[value=""]');
            select.innerHTML = '';
            
            // Добавляем пустую опцию обратно
            if (firstOption) {
                select.appendChild(firstOption);
            } else {
                const emptyOption = document.createElement('option');
                emptyOption.value = '';
                emptyOption.textContent = 'Выберите предмет';
                select.appendChild(emptyOption);
            }
            
            // Добавляем предметы
            this.subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.name;
                option.textContent = subject.name;
                select.appendChild(option);
            });
            
            // Восстанавливаем значение, если оно валидно
            if (currentValue && this.getSubjectByName(currentValue)) {
                select.value = currentValue;
            }
        });
    }

    // Создать карточку предмета
    createSubjectCard(subject, onClick = null) {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.innerHTML = `
            <div class="subject-icon ${subject.color}">
                <svg class="icon icon-lg">
                    <use href="/assets/modern-icons.svg#${subject.icon}"></use>
                </svg>
            </div>
            <div class="subject-info">
                <h3 class="subject-name">${subject.name}</h3>
                <p class="subject-description">${subject.description}</p>
            </div>
        `;

        if (onClick) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => onClick(subject));
        }

        return card;
    }

    // Создать список материалов по предмету
    createSubjectMaterials(subjectName) {
        const materials = JSON.parse(localStorage.getItem('materials') || '[]');
        const subjectMaterials = materials.filter(material => material.subject === subjectName);
        
        return subjectMaterials.map(material => this.createMaterialCard(material));
    }

    // Создать карточку материала
    createMaterialCard(material) {
        const subject = this.getSubjectByName(material.subject);
        const card = document.createElement('div');
        card.className = 'material-card';
        card.innerHTML = `
            <div class="material-header">
                <div class="material-icon">
                    <svg class="icon icon-md">
                        <use href="/assets/modern-icons.svg#${subject ? subject.icon : 'icon-materials'}"></use>
                    </svg>
                </div>
                <div class="material-meta">
                    ${this.createSubjectBadge(material.subject)}
                    <span class="material-date">${this.formatDate(material.createdAt)}</span>
                </div>
            </div>
            <div class="material-content">
                <h3 class="material-title">${material.title}</h3>
                <p class="material-description">${material.description || 'Описание отсутствует'}</p>
            </div>
            <div class="material-footer">
                <div class="material-stats">
                    <span class="stat-item">
                        <svg class="icon icon-xs">
                            <use href="/assets/modern-icons.svg#icon-materials"></use>
                        </svg>
                        ${material.type || 'Материал'}
                    </span>
                    <span class="stat-item">
                        <svg class="icon icon-xs">
                            <use href="/assets/modern-icons.svg#icon-analytics"></use>
                        </svg>
                        ${material.views || 0} просмотров
                    </span>
                </div>
                <button class="btn btn-primary btn-sm" onclick="subjectsManager.openMaterial('${material.id}')">
                    Открыть
                </button>
            </div>
        `;
        return card;
    }

    // Открыть материал
    openMaterial(materialId) {
        const materials = JSON.parse(localStorage.getItem('materials') || '[]');
        const material = materials.find(m => m.id === materialId);
        
        if (material) {
            // Увеличиваем счетчик просмотров
            material.views = (material.views || 0) + 1;
            localStorage.setItem('materials', JSON.stringify(materials));
            
            // Открываем материал (здесь можно добавить логику открытия)
            console.log('Открытие материала:', material);
            
            // Показываем уведомление
            this.showToast(`Открыт материал: ${material.title}`, 'info');
        }
    }

    // Форматирование даты
    formatDate(dateString) {
        if (!dateString) return 'Дата неизвестна';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Вчера';
        if (diffDays < 7) return `${diffDays} дней назад`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} недель назад`;
        
        return date.toLocaleDateString('ru-RU');
    }

    // Фильтрация материалов
    filterMaterials(filters = {}) {
        const materials = JSON.parse(localStorage.getItem('materials') || '[]');
        let filtered = materials;

        // Фильтр по предмету
        if (filters.subject) {
            filtered = filtered.filter(material => material.subject === filters.subject);
        }

        // Фильтр по типу
        if (filters.type) {
            filtered = filtered.filter(material => material.type === filters.type);
        }

        // Поиск по тексту
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(material => 
                material.title.toLowerCase().includes(searchLower) ||
                (material.description && material.description.toLowerCase().includes(searchLower))
            );
        }

        return filtered;
    }

    // Получить статистику по предметам
    getSubjectsStats() {
        const materials = JSON.parse(localStorage.getItem('materials') || '[]');
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        
        const stats = {};
        
        this.subjects.forEach(subject => {
            stats[subject.name] = {
                materials: materials.filter(m => m.subject === subject.name).length,
                assignments: assignments.filter(a => a.subject === subject.name).length,
                totalViews: materials
                    .filter(m => m.subject === subject.name)
                    .reduce((sum, m) => sum + (m.views || 0), 0)
            };
        });
        
        return stats;
    }

    // Создать виджет статистики предметов
    createStatsWidget() {
        const stats = this.getSubjectsStats();
        const widget = document.createElement('div');
        widget.className = 'subjects-stats-widget';
        
        let totalMaterials = 0;
        let totalAssignments = 0;
        let totalViews = 0;
        
        const subjectStats = this.subjects.map(subject => {
            const subjectStat = stats[subject.name];
            totalMaterials += subjectStat.materials;
            totalAssignments += subjectStat.assignments;
            totalViews += subjectStat.totalViews;
            
            return `
                <div class="subject-stat-item">
                    <div class="subject-stat-icon ${subject.color}">
                        <svg class="icon icon-sm">
                            <use href="/assets/modern-icons.svg#${subject.icon}"></use>
                        </svg>
                    </div>
                    <div class="subject-stat-info">
                        <span class="subject-stat-name">${subject.name}</span>
                        <span class="subject-stat-count">${subjectStat.materials} материалов</span>
                    </div>
                </div>
            `;
        }).join('');
        
        widget.innerHTML = `
            <div class="stats-header">
                <h3>Статистика по предметам</h3>
                <div class="stats-summary">
                    <span>${totalMaterials} материалов</span>
                    <span>${totalAssignments} заданий</span>
                    <span>${totalViews} просмотров</span>
                </div>
            </div>
            <div class="stats-list">
                ${subjectStats}
            </div>
        `;
        
        return widget;
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

        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        container.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    // Экспорт данных предметов
    exportSubjectsData() {
        const data = {
            subjects: this.subjects,
            materials: JSON.parse(localStorage.getItem('materials') || '[]'),
            assignments: JSON.parse(localStorage.getItem('assignments') || '[]'),
            stats: this.getSubjectsStats(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subjects-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Данные предметов экспортированы', 'success');
    }
}

// Создаем глобальный экземпляр
const subjectsManager = new SubjectsManager();
window.subjectsManager = subjectsManager;

// Автоматически обновляем селекторы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    subjectsManager.updateSubjectSelectors();
});

// Обновляем селекторы при динамическом добавлении элементов
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
                const selectors = node.querySelectorAll ? 
                    node.querySelectorAll('select[name="primarySubject"], select[name="secondarySubject"], select[name="subject"]') : 
                    [];
                if (selectors.length > 0) {
                    setTimeout(() => subjectsManager.updateSubjectSelectors(), 100);
                }
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });