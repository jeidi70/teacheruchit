// Firebase Authentication Service для TeacherUchit

import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

class FirebaseAuthService {
    constructor() {
        this.currentUser = null;
        this.authStateListeners = [];
        
        // Слушаем изменения состояния аутентификации
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.authStateListeners.forEach(callback => callback(user));
        });
    }

    // Регистрация нового пользователя
    async registerUser(email, password, userData) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Создаем документ пользователя в Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                role: userData.role,
                createdAt: new Date(),
                lastLogin: new Date()
            });

            // Создаем профиль в зависимости от роли
            if (userData.role === 'student') {
                await setDoc(doc(db, 'studentProfiles', user.uid), {
                    name: userData.name,
                    city: userData.city,
                    schoolId: userData.schoolId || '',
                    class: userData.class,
                    letter: userData.letter
                });
            } else if (userData.role === 'teacher') {
                await setDoc(doc(db, 'teacherProfiles', user.uid), {
                    name: userData.name,
                    primarySubject: userData.primarySubject,
                    secondarySubject: userData.secondarySubject || '',
                    schoolCode: userData.schoolCode,
                    institution: userData.institution
                });
            }

            return { success: true, user: user };
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            return { success: false, error: error.message };
        }
    }

    // Вход пользователя
    async loginUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Обновляем время последнего входа
            await setDoc(doc(db, 'users', user.uid), {
                lastLogin: new Date()
            }, { merge: true });

            return { success: true, user: user };
        } catch (error) {
            console.error('Ошибка входа:', error);
            return { success: false, error: error.message };
        }
    }

    // Выход пользователя
    async logoutUser() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error('Ошибка выхода:', error);
            return { success: false, error: error.message };
        }
    }

    // Получение данных текущего пользователя
    async getCurrentUserData() {
        if (!this.currentUser) return null;
        
        try {
            const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // Получаем профиль в зависимости от роли
                let profileData = {};
                if (userData.role === 'student') {
                    const profileDoc = await getDoc(doc(db, 'studentProfiles', this.currentUser.uid));
                    if (profileDoc.exists()) {
                        profileData = profileDoc.data();
                    }
                } else if (userData.role === 'teacher') {
                    const profileDoc = await getDoc(doc(db, 'teacherProfiles', this.currentUser.uid));
                    if (profileDoc.exists()) {
                        profileData = profileDoc.data();
                    }
                }

                return {
                    uid: this.currentUser.uid,
                    email: this.currentUser.email,
                    role: userData.role,
                    profile: profileData,
                    lastLogin: userData.lastLogin
                };
            }
            return null;
        } catch (error) {
            console.error('Ошибка получения данных пользователя:', error);
            return null;
        }
    }

    // Проверка аутентификации для админа
    async checkAdminAccess(email, password) {
        const adminCredentials = {
            email: 'admin@teacheruchit.com',
            password: 'admin123'
        };
        
        if (email === adminCredentials.email && password === adminCredentials.password) {
            // Создаем или обновляем админа в Firebase
            try {
                let adminUser = this.currentUser;
                if (!adminUser || adminUser.email !== adminCredentials.email) {
                    const result = await this.loginUser(email, password);
                    if (!result.success) {
                        // Если админа нет, создаем его
                        const registerResult = await this.registerUser(email, password, {
                            role: 'admin',
                            name: 'System Administrator'
                        });
                        if (registerResult.success) {
                            adminUser = registerResult.user;
                        }
                    } else {
                        adminUser = result.user;
                    }
                }
                return { success: true, user: adminUser };
            } catch (error) {
                console.error('Ошибка входа админа:', error);
                return { success: false, error: error.message };
            }
        }
        return { success: false, error: 'Неверные данные администратора' };
    }

    // Добавление слушателя состояния аутентификации
    onAuthStateChange(callback) {
        this.authStateListeners.push(callback);
        // Сразу вызываем с текущим состоянием
        callback(this.currentUser);
    }

    // Получение текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    }

    // Проверка аутентификации
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Создаем единственный экземпляр сервиса
const firebaseAuth = new FirebaseAuthService();
export default firebaseAuth;