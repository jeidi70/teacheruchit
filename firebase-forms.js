// Firebase Forms Integration для TeacherUchit
// Этот файл заменяет localStorage на Firebase Authentication и Firestore

import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class TeacherUchitFirebase {
    constructor() {
        this.auth = window.firebaseAuth;
        this.db = window.firebaseDB;
        this.storage = window.firebaseStorage;
        this.currentUser = null;
        this.listeners = new Map();
        
        // Слушаем изменения аутентификации
        onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            this.handleAuthStateChange(user);
        });
    }

    // Обработка изменения состояния аутентификации
    handleAuthStateChange(user) {
        if (user) {
            console.log('Пользователь вошел:', user.email);
            this.redirectToDashboard();
        } else {
            console.log('Пользователь вышел');
            // Перенаправляем на главную, если не на главной странице
            if (!window.location.pathname.includes('index.html') && 
                !window.location.pathname === '/') {
                window.location.href = '/';
            }
        }
    }

    // Перенаправление на соответствующий дашборд
    async redirectToDashboard() {
        if (!this.currentUser) return;
        
        try {
            const userData = await this.getCurrentUserData();
            if (userData) {
                const role = userData.role;
                if (role === 'student') {
                    window.location.href = '/student-dashboard.html';
                } else if (role === 'teacher') {
                    window.location.href = '/teacher-dashboard.html';
                } else if (role === 'admin') {
                    window.location.href = '/admin-dashboard.html';
                }
            }
        } catch (error) {
            console.error('Ошибка перенаправления:', error);
        }
    }

    // Регистрация студента
    async registerStudent(formData) {
        try {
            const { email, password, name, city, schoolClass, letter } = formData;
            
            // Создаем пользователя в Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            // Создаем документ пользователя
            await setDoc(doc(this.db, 'users', user.uid), {
                email: email,
                role: 'student',
                createdAt: new Date(),
                lastLogin: new Date()
            });

            // Создаем профиль студента
            await setDoc(doc(this.db, 'studentProfiles', user.uid), {
                name: name,
                city: city,
                schoolId: '', // Пока пустой, потом можно связать с школами
                class: schoolClass,
                letter: letter,
                completedAt: new Date()
            });

            this.showNotification('Регистрация успешна! Добро пожаловать в TeacherUchit!', 'success');
            return { success: true, user: user };
        } catch (error) {
            console.error('Ошибка регистрации студента:', error);
            this.showNotification(`Ошибка регистрации: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    // Регистрация учителя
    async registerTeacher(formData) {
        try {
            const { email, password, name, primarySubject, secondarySubject, schoolCode, institution } = formData;
            
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            await setDoc(doc(this.db, 'users', user.uid), {
                email: email,
                role: 'teacher',
                createdAt: new Date(),
                lastLogin: new Date()
            });

            await setDoc(doc(this.db, 'teacherProfiles', user.uid), {
                name: name,
                primarySubject: primarySubject,
                secondarySubject: secondarySubject || '',
                schoolCode: schoolCode,
                institution: institution,
                completedAt: new Date()
            });

            this.showNotification('Регистрация учителя успешна!', 'success');
            return { success: true, user: user };
        } catch (error) {
            console.error('Ошибка регистрации учителя:', error);
            this.showNotification(`Ошибка регистрации: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    // Вход пользователя
    async loginUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            // Обновляем время последнего входа
            await setDoc(doc(this.db, 'users', user.uid), {
                lastLogin: new Date()
            }, { merge: true });

            this.showNotification('Вход выполнен успешно!', 'success');
            return { success: true, user: user };
        } catch (error) {
            console.error('Ошибка входа:', error);
            this.showNotification(`Ошибка входа: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    // Выход пользователя
    async logoutUser() {
        try {
            await signOut(this.auth);
            this.showNotification('Вы успешно вышли из системы', 'success');
            return { success: true };
        } catch (error) {
            console.error('Ошибка выхода:', error);
            this.showNotification(`Ошибка выхода: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    // Получение данных текущего пользователя
    async getCurrentUserData() {
        if (!this.currentUser) return null;
        
        try {
            const userDoc = await getDoc(doc(this.db, 'users', this.currentUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                let profileData = {};
                if (userData.role === 'student') {
                    const profileDoc = await getDoc(doc(this.db, 'studentProfiles', this.currentUser.uid));
                    if (profileDoc.exists()) {
                        profileData = profileDoc.data();
                    }
                } else if (userData.role === 'teacher') {
                    const profileDoc = await getDoc(doc(this.db, 'teacherProfiles', this.currentUser.uid));
                    if (profileDoc.exists()) {
                        profileData = profileDoc.data();
                    }
                }

                return {
                    uid: this.currentUser.uid,
                    email: this.currentUser.email,
                    role: userData.role,
                    profile: profileData,
                    lastLogin: userData.lastLogin,
                    createdAt: userData.createdAt
                };
            }
            return null;
        } catch (error) {
            console.error('Ошибка получения данных пользователя:', error);
            return null;
        }
    }

    // Проверка админа
    async checkAdminAccess(email, password) {
        const adminCredentials = {
            email: 'admin@teacheruchit.com',
            password: 'admin123'
        };
        
        if (email === adminCredentials.email && password === adminCredentials.password) {
            try {
                let result = await this.loginUser(email, password);
                if (!result.success) {
                    // Создаем админа, если его нет
                    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
                    const user = userCredential.user;
                    
                    await setDoc(doc(this.db, 'users', user.uid), {
                        email: email,
                        role: 'admin',
                        createdAt: new Date(),
                        lastLogin: new Date()
                    });

                    result = { success: true, user: user };
                }
                return result;
            } catch (error) {
                console.error('Ошибка входа админа:', error);
                return { success: false, error: error.message };
            }
        }
        return { success: false, error: 'Неверные данные администратора' };
    }

    // === МАТЕРИАЛЫ ===
    
    async addMaterial(materialData, file = null) {
        try {
            if (!this.currentUser) throw new Error('Необходима аутентификация');
            
            const userData = await this.getCurrentUserData();
            if (!userData || !['teacher', 'admin'].includes(userData.role)) {
                throw new Error('Недостаточно прав для добавления материалов');
            }

            let fileUrl = '';
            let fileName = '';
            
            // TODO: Добавить загрузку файла в Firebase Storage
            if (file) {
                fileName = file.name;
                // Пока сохраняем как placeholder
                fileUrl = 'https://placeholder.firebase.storage.url/' + fileName;
            }
            
            const docRef = await addDoc(collection(this.db, 'materials'), {
                title: materialData.title,
                description: materialData.description,
                subject: materialData.subject,
                authorId: this.currentUser.uid,
                authorName: userData.profile.name,
                fileUrl: fileUrl,
                fileName: fileName,
                status: materialData.status || 'active',
                createdAt: new Date()
            });
            
            this.showNotification('Материал успешно добавлен!', 'success');
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Ошибка добавления материала:', error);
            this.showNotification(`Ошибка: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    async getMaterials(subject = null) {
        try {
            let q = collection(this.db, 'materials');
            
            if (subject) {
                q = query(q, where('subject', '==', subject));
            }
            
            q = query(q, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
            
            const querySnapshot = await getDocs(q);
            const materials = [];
            
            querySnapshot.forEach((doc) => {
                materials.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return { success: true, materials };
        } catch (error) {
            console.error('Ошибка получения материалов:', error);
            return { success: false, error: error.message, materials: [] };
        }
    }

    // Real-time подписка на материалы
    subscribeMaterials(callback, subject = null) {
        let q = collection(this.db, 'materials');
        
        if (subject) {
            q = query(q, where('subject', '==', subject));
        }
        
        q = query(q, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const materials = [];
            querySnapshot.forEach((doc) => {
                materials.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(materials);
        });
        
        const listenerId = `materials_${subject || 'all'}_${Date.now()}`;
        this.listeners.set(listenerId, unsubscribe);
        return listenerId;
    }

    // === УВЕДОМЛЕНИЯ ===
    
    showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        // Устанавливаем цвет в зависимости от типа
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Скрываем через 5 секунд
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Проверка аутентификации
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Получение текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    }

    // Отписка от всех слушателей
    unsubscribeAll() {
        this.listeners.forEach((unsubscribe) => {
            unsubscribe();
        });
        this.listeners.clear();
    }
}

// Создаем глобальный экземпляр
window.teacherUchitFirebase = new TeacherUchitFirebase();

// Экспортируем для использования в других файлах
export default window.teacherUchitFirebase;