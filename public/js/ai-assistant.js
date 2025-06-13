// AI Assistant с DeepSeek интеграцией для TeacherUchit
class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.currentUser = null;
        this.isPremium = false;
        this.conversationHistory = [];
        this.dailyQuestions = 0;
        this.maxFreeQuestions = 5;
        this.init();
    }

    init() {
        this.loadUserData();
        this.createAssistantWidget();
        this.loadConversationHistory();
        this.checkDailyLimit();
    }

    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        this.currentUser = userData;
        this.isPremium = userData.premium || false;
        
        // Загружаем счетчик вопросов за день
        const today = new Date().toDateString();
        const dailyData = JSON.parse(localStorage.getItem('aiDailyUsage') || '{}');
        this.dailyQuestions = dailyData[today] || 0;
    }

    checkDailyLimit() {
        if (!this.isPremium && this.dailyQuestions >= this.maxFreeQuestions) {
            this.showLimitReached();
        }
    }

    // Создание виджета ИИ-помощника
    createAssistantWidget() {
        const widget = document.createElement('div');
        widget.className = 'ai-assistant-widget';
        widget.innerHTML = `
            <!-- Кнопка открытия -->
            <button class="ai-toggle-btn" onclick="aiAssistant.toggleAssistant()">
                <svg class="icon icon-lg">
                    <use href="/assets/modern-icons.svg#icon-ai-assistant"></use>
                </svg>
                <div class="ai-pulse"></div>
                ${!this.isPremium && this.dailyQuestions >= this.maxFreeQuestions ? 
                    '<div class="ai-limit-badge">Лимит</div>' : 
                    this.dailyQuestions > 0 ? `<div class="ai-usage-badge">${this.dailyQuestions}/${this.maxFreeQuestions}</div>` : ''
                }
            </button>

            <!-- Панель чата -->
            <div class="ai-chat-panel" id="aiChatPanel">
                <div class="ai-chat-header">
                    <div class="ai-header-info">
                        <div class="ai-avatar">
                            <svg class="icon icon-md">
                                <use href="/assets/modern-icons.svg#icon-deepseek"></use>
                            </svg>
                        </div>
                        <div class="ai-header-text">
                            <h4>DeepSeek Помощник</h4>
                            <span class="ai-status">
                                ${this.isPremium ? 
                                    '<span class="premium-badge">Premium</span>' : 
                                    `${this.dailyQuestions}/${this.maxFreeQuestions} вопросов`
                                }
                            </span>
                        </div>
                    </div>
                    <div class="ai-header-actions">
                        ${!this.isPremium ? `
                            <button class="btn btn-xs btn-warning" onclick="aiAssistant.showPremiumOffer()">
                                <svg class="icon icon-xs">
                                    <use href="/assets/modern-icons.svg#icon-premium"></use>
                                </svg>
                                Premium
                            </button>
                        ` : ''}
                        <button class="ai-close-btn" onclick="aiAssistant.toggleAssistant()">
                            <svg class="icon icon-sm">
                                <use href="/assets/modern-icons.svg#icon-error"></use>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="ai-chat-messages" id="aiChatMessages">
                    ${this.conversationHistory.length === 0 ? this.createWelcomeMessage() : ''}
                </div>

                <div class="ai-chat-input">
                    ${this.createQuickActions()}
                    <div class="ai-input-container">
                        <textarea 
                            id="aiMessageInput" 
                            placeholder="Задайте вопрос ИИ-помощнику..."
                            rows="1"
                            ${!this.isPremium && this.dailyQuestions >= this.maxFreeQuestions ? 'disabled' : ''}
                        ></textarea>
                        <button 
                            class="ai-send-btn" 
                            onclick="aiAssistant.sendMessage()"
                            ${!this.isPremium && this.dailyQuestions >= this.maxFreeQuestions ? 'disabled' : ''}
                        >
                            <svg class="icon icon-sm">
                                <use href="/assets/modern-icons.svg#icon-chat"></use>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
        this.setupEventListeners();
    }

    // Приветственное сообщение
    createWelcomeMessage() {
        const role = this.currentUser.role;
        const name = this.currentUser.profile?.name || 'Пользователь';
        
        let welcomeText = '';
        let suggestions = [];

        if (role === 'student') {
            welcomeText = `Привет, ${name}! 👋 Я ваш ИИ-помощник по изучению гуманитарных наук. Готов помочь с домашними заданиями, объяснить сложные темы и подготовиться к экзаменам!`;
            suggestions = [
                'Объясни мне тему "Великая французская революция"',
                'Помоги с эссе по обществознанию',
                'Какие права есть у граждан РФ?',
                'Расскажи о философии Платона'
            ];
        } else if (role === 'teacher') {
            welcomeText = `Добро пожаловать, ${name}! 🎓 Я помогу вам создавать увлекательные уроки, разрабатывать задания и находить новые методы преподавания гуманитарных дисциплин.`;
            suggestions = [
                'Создай план урока по истории России',
                'Предложи интерактивные задания по праву',
                'Как объяснить экономические термины?',
                'Идеи для проектной работы по обществознанию'
            ];
        }

        return `
            <div class="ai-message ai-message-assistant">
                <div class="ai-message-avatar">
                    <svg class="icon icon-sm">
                        <use href="/assets/modern-icons.svg#icon-deepseek"></use>
                    </svg>
                </div>
                <div class="ai-message-content">
                    <div class="ai-message-text">${welcomeText}</div>
                    <div class="ai-suggestions">
                        ${suggestions.map(suggestion => `
                            <button class="ai-suggestion-btn" onclick="aiAssistant.sendSuggestion('${suggestion}')">
                                ${suggestion}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Быстрые действия
    createQuickActions() {
        const role = this.currentUser.role;
        
        let actions = [];
        if (role === 'student') {
            actions = [
                { icon: 'icon-materials', text: 'Объяснить тему', action: 'explain' },
                { icon: 'icon-assignments', text: 'Помочь с ДЗ', action: 'homework' },
                { icon: 'icon-grades', text: 'Подготовка к экзамену', action: 'exam' }
            ];
        } else if (role === 'teacher') {
            actions = [
                { icon: 'icon-materials', text: 'План урока', action: 'lesson' },
                { icon: 'icon-assignments', text: 'Создать задание', action: 'assignment' },
                { icon: 'icon-analytics', text: 'Методика', action: 'methodology' }
            ];
        }

        return `
            <div class="ai-quick-actions">
                ${actions.map(action => `
                    <button class="ai-quick-btn" onclick="aiAssistant.quickAction('${action.action}')">
                        <svg class="icon icon-xs">
                            <use href="/assets/modern-icons.svg#${action.icon}"></use>
                        </svg>
                        ${action.text}
                    </button>
                `).join('')}
            </div>
        `;
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        const input = document.getElementById('aiMessageInput');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            input.addEventListener('input', () => {
                this.autoResizeTextarea(input);
            });
        }
    }

    // Автоматическое изменение размера textarea
    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    // Переключение панели помощника
    toggleAssistant() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('aiChatPanel');
        const widget = document.querySelector('.ai-assistant-widget');
        
        if (this.isOpen) {
            panel.classList.add('show');
            widget.classList.add('open');
        } else {
            panel.classList.remove('show');
            widget.classList.remove('open');
        }
    }

    // Отправка сообщения
    async sendMessage(message = null) {
        const input = document.getElementById('aiMessageInput');
        const messageText = message || input.value.trim();
        
        if (!messageText) return;

        // Проверяем лимит для бесплатных пользователей
        if (!this.isPremium && this.dailyQuestions >= this.maxFreeQuestions) {
            this.showPremiumOffer();
            return;
        }

        // Очищаем поле ввода
        if (!message) {
            input.value = '';
            input.style.height = 'auto';
        }

        // Добавляем сообщение пользователя
        this.addMessage(messageText, 'user');

        // Показываем индикатор печати
        this.showTypingIndicator();

        try {
            // Отправляем запрос к DeepSeek API
            const response = await this.callDeepSeekAPI(messageText);
            
            // Удаляем индикатор печати
            this.removeTypingIndicator();
            
            // Добавляем ответ ИИ
            this.addMessage(response, 'assistant');
            
            // Увеличиваем счетчик вопросов
            this.incrementDailyUsage();
            
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('Извините, произошла ошибка. Попробуйте позже.', 'assistant', true);
        }
    }

    // Отправка предложенного вопроса
    sendSuggestion(suggestion) {
        this.sendMessage(suggestion);
    }

    // Быстрые действия
    quickAction(action) {
        const role = this.currentUser.role;
        let prompt = '';

        if (role === 'student') {
            switch (action) {
                case 'explain':
                    prompt = 'Объясни мне простыми словами тему: ';
                    break;
                case 'homework':
                    prompt = 'Помоги мне с домашним заданием по ';
                    break;
                case 'exam':
                    prompt = 'Как подготовиться к экзамену по ';
                    break;
            }
        } else if (role === 'teacher') {
            switch (action) {
                case 'lesson':
                    prompt = 'Создай план урока по теме: ';
                    break;
                case 'assignment':
                    prompt = 'Предложи задания для учеников по ';
                    break;
                case 'methodology':
                    prompt = 'Какие методы преподавания лучше использовать для ';
                    break;
            }
        }

        const input = document.getElementById('aiMessageInput');
        input.value = prompt;
        input.focus();
        this.autoResizeTextarea(input);
    }

    // Добавление сообщения в чат
    addMessage(text, sender, isError = false) {
        const messagesContainer = document.getElementById('aiChatMessages');
        const messageEl = document.createElement('div');
        messageEl.className = `ai-message ai-message-${sender}`;
        
        if (sender === 'user') {
            messageEl.innerHTML = `
                <div class="ai-message-content">
                    <div class="ai-message-text">${text}</div>
                </div>
                <div class="ai-message-avatar">
                    <div class="avatar avatar-sm user-avatar">
                        ${this.currentUser.profile?.avatar ? 
                            `<img src="${this.currentUser.profile.avatar}" alt="User">` :
                            `<span>${this.getInitials(this.currentUser.profile?.name || 'User')}</span>`
                        }
                    </div>
                </div>
            `;
        } else {
            messageEl.innerHTML = `
                <div class="ai-message-avatar">
                    <svg class="icon icon-sm">
                        <use href="/assets/modern-icons.svg#icon-deepseek"></use>
                    </svg>
                </div>
                <div class="ai-message-content">
                    <div class="ai-message-text ${isError ? 'error' : ''}">${text}</div>
                    ${!isError ? `
                        <div class="ai-message-actions">
                            <button class="ai-action-btn" onclick="aiAssistant.copyMessage(this)" title="Копировать">
                                <svg class="icon icon-xs">
                                    <use href="/assets/modern-icons.svg#icon-copy"></use>
                                </svg>
                            </button>
                            <button class="ai-action-btn" onclick="aiAssistant.likeMessage(this)" title="Полезно">
                                <svg class="icon icon-xs">
                                    <use href="/assets/modern-icons.svg#icon-success"></use>
                                </svg>
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Сохраняем в историю
        this.conversationHistory.push({ text, sender, timestamp: new Date().toISOString() });
        this.saveConversationHistory();
    }

    // Показ индикатора печати
    showTypingIndicator() {
        const messagesContainer = document.getElementById('aiChatMessages');
        const typingEl = document.createElement('div');
        typingEl.className = 'ai-message ai-message-assistant ai-typing';
        typingEl.id = 'aiTypingIndicator';
        typingEl.innerHTML = `
            <div class="ai-message-avatar">
                <svg class="icon icon-sm">
                    <use href="/assets/modern-icons.svg#icon-deepseek"></use>
                </svg>
            </div>
            <div class="ai-message-content">
                <div class="ai-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Удаление индикатора печати
    removeTypingIndicator() {
        const typingEl = document.getElementById('aiTypingIndicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    // Вызов DeepSeek API (имитация)
    async callDeepSeekAPI(message) {
        // Имитация API вызова
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Генерируем ответ на основе контекста пользователя
        const role = this.currentUser.role;
        const responses = this.generateContextualResponse(message, role);
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Генерация контекстуального ответа
    generateContextualResponse(message, role) {
        const lowerMessage = message.toLowerCase();
        
        // Ответы для студентов
        if (role === 'student') {
            if (lowerMessage.includes('история') || lowerMessage.includes('революция')) {
                return [
                    'Великая французская революция (1789-1799) была важнейшим событием в истории Франции. Она началась из-за финансового кризиса и социального неравенства. Основные этапы: созыв Генеральных штатов, взятие Бастилии, принятие Декларации прав человека и гражданина.',
                    'Революция привела к свержению монархии и установлению республики. Ключевые фигуры: Робеспьер, Дантон, Марат. Революция оказала огромное влияние на развитие демократии в мире.'
                ];
            }
            
            if (lowerMessage.includes('право') || lowerMessage.includes('конституция')) {
                return [
                    'Конституция РФ гарантирует основные права и свободы граждан: право на жизнь, свободу слова, собраний, вероисповедания. Также закреплены социальные права: на образование, медицинскую помощь, социальное обеспечение.',
                    'Права граждан защищаются судебной системой. Каждый имеет право на справедливое судебное разбирательство и презумпцию невиновности.'
                ];
            }
            
            if (lowerMessage.includes('экономика') || lowerMessage.includes('рынок')) {
                return [
                    'Рыночная экономика основана на свободной конкуренции, частной собственности и ценообразовании по закону спроса и предложения. Основные участники: производители, потребители, государство.',
                    'Преимущества рынка: эффективное распределение ресурсов, стимулирование инноваций. Недостатки: неравенство доходов, возможные кризисы.'
                ];
            }
        }
        
        // Ответы для учителей
        if (role === 'teacher') {
            if (lowerMessage.includes('план урока') || lowerMessage.includes('урок')) {
                return [
                    'План урока по истории России:\n1. Организационный момент (2 мин)\n2. Проверка домашнего задания (8 мин)\n3. Изучение новой темы (25 мин)\n4. Закрепление материала (8 мин)\n5. Домашнее задание (2 мин)\n\nИспользуйте интерактивные методы: работу с картами, документами, групповые дискуссии.',
                    'Для эффективного урока обществознания рекомендую:\n- Начать с актуальной проблемы\n- Использовать кейс-методы\n- Организовать дебаты\n- Применить ролевые игры\n- Завершить рефлексией'
                ];
            }
            
            if (lowerMessage.includes('задание') || lowerMessage.includes('упражнение')) {
                return [
                    'Интерактивные задания по праву:\n1. Разбор судебных кейсов\n2. Ролевая игра "Судебное заседание"\n3. Создание правовых памяток\n4. Анализ нормативных актов\n5. Проектная работа "Права в повседневной жизни"',
                    'Творческие задания по истории:\n- Создание исторических комиксов\n- Интервью с историческими личностями\n- Виртуальные экскурсии\n- Исторические реконструкции\n- Создание документальных фильмов'
                ];
            }
        }
        
        // Общие ответы
        return [
            'Это интересный вопрос! Давайте разберем его подробнее. Для лучшего понимания рекомендую изучить дополнительные материалы и обратиться к первоисточникам.',
            'Хороший вопрос! Эта тема требует комплексного подхода. Предлагаю рассмотреть различные точки зрения и проанализировать исторический контекст.',
            'Отличный вопрос для размышления! Рекомендую изучить эту тему глубже, используя различные источники информации и критический анализ.'
        ];
    }

    // Увеличение счетчика использования
    incrementDailyUsage() {
        this.dailyQuestions++;
        
        const today = new Date().toDateString();
        const dailyData = JSON.parse(localStorage.getItem('aiDailyUsage') || '{}');
        dailyData[today] = this.dailyQuestions;
        localStorage.setItem('aiDailyUsage', JSON.stringify(dailyData));
        
        // Обновляем UI
        this.updateUsageDisplay();
        
        // Проверяем лимит
        if (!this.isPremium && this.dailyQuestions >= this.maxFreeQuestions) {
            this.showLimitReached();
        }
    }

    // Обновление отображения использования
    updateUsageDisplay() {
        const statusEl = document.querySelector('.ai-status');
        const toggleBtn = document.querySelector('.ai-toggle-btn');
        
        if (statusEl && !this.isPremium) {
            statusEl.innerHTML = `${this.dailyQuestions}/${this.maxFreeQuestions} вопросов`;
        }
        
        // Обновляем бейдж на кнопке
        const existingBadge = toggleBtn.querySelector('.ai-usage-badge, .ai-limit-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        if (!this.isPremium) {
            const badge = document.createElement('div');
            if (this.dailyQuestions >= this.maxFreeQuestions) {
                badge.className = 'ai-limit-badge';
                badge.textContent = 'Лимит';
            } else if (this.dailyQuestions > 0) {
                badge.className = 'ai-usage-badge';
                badge.textContent = `${this.dailyQuestions}/${this.maxFreeQuestions}`;
            }
            if (badge.textContent) {
                toggleBtn.appendChild(badge);
            }
        }
    }

    // Показ сообщения о достижении лимита
    showLimitReached() {
        const input = document.getElementById('aiMessageInput');
        const sendBtn = document.querySelector('.ai-send-btn');
        
        if (input) {
            input.disabled = true;
            input.placeholder = 'Дневной лимит исчерпан. Получите Premium для неограниченного доступа!';
        }
        
        if (sendBtn) {
            sendBtn.disabled = true;
        }
        
        this.addMessage(
            'Вы достигли дневного лимита бесплатных вопросов (5/день). Получите Premium подписку для неограниченного доступа к ИИ-помощнику! 🚀',
            'assistant'
        );
    }

    // Показ предложения Premium
    showPremiumOffer() {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop show';
        
        const role = this.currentUser.role;
        const benefits = role === 'student' ? 
            [
                'Неограниченные вопросы ИИ-помощнику',
                'Персональный план обучения',
                'Расширенные материалы по всем предметам',
                'Приоритетная поддержка',
                'Эксклюзивные вебинары и мастер-классы',
                'Продвинутая аналитика успеваемости'
            ] :
            [
                'Неограниченный доступ к ИИ-помощнику',
                'Конструктор уроков с ИИ',
                'Автоматическая проверка заданий',
                'Расширенная аналитика класса',
                'Библиотека премиум-материалов',
                'Инструменты для создания тестов'
            ];

        modal.innerHTML = `
            <div class="modal show">
                <div class="modal-header">
                    <h3 class="modal-title">
                        <svg class="icon icon-md text-warning">
                            <use href="/assets/modern-icons.svg#icon-premium"></use>
                        </svg>
                        TeacherUchit Premium
                    </h3>
                    <button type="button" class="modal-close" onclick="this.closest('.modal-backdrop').remove()">
                        <svg class="icon icon-md">
                            <use href="/assets/modern-icons.svg#icon-error"></use>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="premium-offer">
                        <div class="premium-hero">
                            <div class="premium-icon">
                                <svg class="icon icon-xl">
                                    <use href="/assets/modern-icons.svg#icon-premium"></use>
                                </svg>
                            </div>
                            <h4>Разблокируйте все возможности!</h4>
                            <p>Получите максимум от образовательной платформы TeacherUchit</p>
                        </div>
                        
                        <div class="premium-benefits">
                            <h5>Что входит в Premium:</h5>
                            <ul class="benefits-list">
                                ${benefits.map(benefit => `
                                    <li>
                                        <svg class="icon icon-sm text-success">
                                            <use href="/assets/modern-icons.svg#icon-success"></use>
                                        </svg>
                                        ${benefit}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="premium-pricing">
                            <div class="price-card">
                                <div class="price-header">
                                    <h6>Месячная подписка</h6>
                                    <div class="price">
                                        <span class="amount">299</span>
                                        <span class="currency">₽/мес</span>
                                    </div>
                                </div>
                                <button class="btn btn-primary btn-lg" onclick="aiAssistant.activatePremium('monthly')">
                                    Попробовать 7 дней бесплатно
                                </button>
                            </div>
                            
                            <div class="price-card featured">
                                <div class="price-badge">Выгодно</div>
                                <div class="price-header">
                                    <h6>Годовая подписка</h6>
                                    <div class="price">
                                        <span class="amount">199</span>
                                        <span class="currency">₽/мес</span>
                                    </div>
                                    <div class="price-note">Экономия 1200₽ в год</div>
                                </div>
                                <button class="btn btn-warning btn-lg" onclick="aiAssistant.activatePremium('yearly')">
                                    Получить Premium
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Активация Premium (имитация)
    activatePremium(plan) {
        // Имитация активации Premium
        this.isPremium = true;
        this.currentUser.premium = true;
        this.currentUser.premiumPlan = plan;
        this.currentUser.premiumActivated = new Date().toISOString();
        
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        
        // Закрываем модальное окно
        document.querySelector('.modal-backdrop')?.remove();
        
        // Обновляем UI
        this.updatePremiumStatus();
        
        // Показываем уведомление
        this.showToast('🎉 Premium активирован! Добро пожаловать в мир неограниченных возможностей!', 'success');
    }

    // Обновление статуса Premium
    updatePremiumStatus() {
        // Обновляем статус в заголовке
        const statusEl = document.querySelector('.ai-status');
        if (statusEl) {
            statusEl.innerHTML = '<span class="premium-badge">Premium</span>';
        }
        
        // Убираем кнопку Premium
        const premiumBtn = document.querySelector('.ai-header-actions .btn-warning');
        if (premiumBtn) {
            premiumBtn.remove();
        }
        
        // Включаем ввод
        const input = document.getElementById('aiMessageInput');
        const sendBtn = document.querySelector('.ai-send-btn');
        
        if (input) {
            input.disabled = false;
            input.placeholder = 'Задайте вопрос ИИ-помощнику...';
        }
        
        if (sendBtn) {
            sendBtn.disabled = false;
        }
        
        // Убираем бейдж лимита
        const limitBadge = document.querySelector('.ai-limit-badge');
        if (limitBadge) {
            limitBadge.remove();
        }
    }

    // Копирование сообщения
    copyMessage(button) {
        const messageText = button.closest('.ai-message-content').querySelector('.ai-message-text').textContent;
        navigator.clipboard.writeText(messageText).then(() => {
            this.showToast('Сообщение скопировано!', 'success');
        });
    }

    // Лайк сообщения
    likeMessage(button) {
        button.classList.add('liked');
        button.disabled = true;
        this.showToast('Спасибо за обратную связь!', 'info');
    }

    // Получение инициалов
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Сохранение истории разговора
    saveConversationHistory() {
        localStorage.setItem('aiConversationHistory', JSON.stringify(this.conversationHistory));
    }

    // Загрузка истории разговора
    loadConversationHistory() {
        const history = JSON.parse(localStorage.getItem('aiConversationHistory') || '[]');
        this.conversationHistory = history;
        
        // Восстанавливаем сообщения
        const messagesContainer = document.getElementById('aiChatMessages');
        if (messagesContainer && history.length > 0) {
            messagesContainer.innerHTML = '';
            history.forEach(msg => {
                this.addMessageToUI(msg.text, msg.sender);
            });
        }
    }

    // Добавление сообщения в UI без сохранения в историю
    addMessageToUI(text, sender) {
        const messagesContainer = document.getElementById('aiChatMessages');
        const messageEl = document.createElement('div');
        messageEl.className = `ai-message ai-message-${sender}`;
        
        if (sender === 'user') {
            messageEl.innerHTML = `
                <div class="ai-message-content">
                    <div class="ai-message-text">${text}</div>
                </div>
                <div class="ai-message-avatar">
                    <div class="avatar avatar-sm user-avatar">
                        ${this.currentUser.profile?.avatar ? 
                            `<img src="${this.currentUser.profile.avatar}" alt="User">` :
                            `<span>${this.getInitials(this.currentUser.profile?.name || 'User')}</span>`
                        }
                    </div>
                </div>
            `;
        } else {
            messageEl.innerHTML = `
                <div class="ai-message-avatar">
                    <svg class="icon icon-sm">
                        <use href="/assets/modern-icons.svg#icon-deepseek"></use>
                    </svg>
                </div>
                <div class="ai-message-content">
                    <div class="ai-message-text">${text}</div>
                    <div class="ai-message-actions">
                        <button class="ai-action-btn" onclick="aiAssistant.copyMessage(this)" title="Копировать">
                            <svg class="icon icon-xs">
                                <use href="/assets/modern-icons.svg#icon-copy"></use>
                            </svg>
                        </button>
                        <button class="ai-action-btn" onclick="aiAssistant.likeMessage(this)" title="Полезно">
                            <svg class="icon icon-xs">
                                <use href="/assets/modern-icons.svg#icon-success"></use>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }

        messagesContainer.appendChild(messageEl);
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
}

// Создаем глобальный экземпляр
const aiAssistant = new AIAssistant();
window.aiAssistant = aiAssistant;