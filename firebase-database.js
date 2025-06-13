// Firebase Firestore Database Service для TeacherUchit

import { db, storage } from './firebase-config.js';
import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit,
    onSnapshot 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

class FirebaseDatabaseService {
    constructor() {
        this.listeners = new Map(); // Для хранения real-time слушателей
    }

    // === МАТЕРИАЛЫ ===
    
    // Добавление материала
    async addMaterial(materialData, file = null) {
        try {
            let fileUrl = '';
            let fileName = '';
            
            // Если есть файл, загружаем его в Storage
            if (file) {
                const fileRef = ref(storage, `materials/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(fileRef, file);
                fileUrl = await getDownloadURL(snapshot.ref);
                fileName = file.name;
            }
            
            const docRef = await addDoc(collection(db, 'materials'), {
                ...materialData,
                fileUrl: fileUrl,
                fileName: fileName,
                createdAt: new Date(),
                status: materialData.status || 'active'
            });
            
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Ошибка добавления материала:', error);
            return { success: false, error: error.message };
        }
    }

    // Получение всех материалов
    async getMaterials(subject = null) {
        try {
            let q = collection(db, 'materials');
            
            if (subject) {
                q = query(q, where('subject', '==', subject));
            }
            
            q = query(q, orderBy('createdAt', 'desc'));
            
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
            return { success: false, error: error.message };
        }
    }

    // Обновление материала
    async updateMaterial(materialId, updates) {
        try {
            const materialRef = doc(db, 'materials', materialId);
            await updateDoc(materialRef, {
                ...updates,
                updatedAt: new Date()
            });
            
            return { success: true };
        } catch (error) {
            console.error('Ошибка обновления материала:', error);
            return { success: false, error: error.message };
        }
    }

    // Удаление материала
    async deleteMaterial(materialId) {
        try {
            // Сначала получаем данные материала для удаления файла
            const materialDoc = await getDoc(doc(db, 'materials', materialId));
            if (materialDoc.exists()) {
                const materialData = materialDoc.data();
                
                // Удаляем файл из Storage, если он есть
                if (materialData.fileUrl) {
                    try {
                        const fileRef = ref(storage, materialData.fileUrl);
                        await deleteObject(fileRef);
                    } catch (fileError) {
                        console.warn('Не удалось удалить файл:', fileError);
                    }
                }
            }
            
            // Удаляем документ из Firestore
            await deleteDoc(doc(db, 'materials', materialId));
            
            return { success: true };
        } catch (error) {
            console.error('Ошибка удаления материала:', error);
            return { success: false, error: error.message };
        }
    }

    // === ШКОЛЫ ===
    
    // Добавление школы
    async addSchool(schoolData) {
        try {
            const docRef = await addDoc(collection(db, 'schools'), {
                ...schoolData,
                createdAt: new Date()
            });
            
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Ошибка добавления школы:', error);
            return { success: false, error: error.message };
        }
    }

    // Получение всех школ
    async getSchools() {
        try {
            const q = query(collection(db, 'schools'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const schools = [];
            
            querySnapshot.forEach((doc) => {
                schools.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return { success: true, schools };
        } catch (error) {
            console.error('Ошибка получения школ:', error);
            return { success: false, error: error.message };
        }
    }

    // === ПОЛЬЗОВАТЕЛИ ===
    
    // Получение всех пользователей (только для админа)
    async getAllUsers() {
        try {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const users = [];
            
            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();
                let profileData = {};
                
                // Получаем профиль в зависимости от роли
                if (userData.role === 'student') {
                    const profileDoc = await getDoc(doc(db, 'studentProfiles', userDoc.id));
                    if (profileDoc.exists()) {
                        profileData = profileDoc.data();
                    }
                } else if (userData.role === 'teacher') {
                    const profileDoc = await getDoc(doc(db, 'teacherProfiles', userDoc.id));
                    if (profileDoc.exists()) {
                        profileData = profileDoc.data();
                    }
                }
                
                users.push({
                    id: userDoc.id,
                    email: userData.email,
                    role: userData.role,
                    createdAt: userData.createdAt,
                    lastLogin: userData.lastLogin,
                    profile: profileData
                });
            }
            
            return { success: true, users };
        } catch (error) {
            console.error('Ошибка получения пользователей:', error);
            return { success: false, error: error.message };
        }
    }

    // Удаление пользователя
    async deleteUser(userId) {
        try {
            // Удаляем основную запись пользователя
            await deleteDoc(doc(db, 'users', userId));
            
            // Удаляем профиль студента, если существует
            try {
                await deleteDoc(doc(db, 'studentProfiles', userId));
            } catch (e) { /* профиль может не существовать */ }
            
            // Удаляем профиль учителя, если существует
            try {
                await deleteDoc(doc(db, 'teacherProfiles', userId));
            } catch (e) { /* профиль может не существовать */ }
            
            return { success: true };
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error);
            return { success: false, error: error.message };
        }
    }

    // === REAL-TIME СЛУШАТЕЛИ ===
    
    // Подписка на изменения материалов
    subscribeMaterials(callback, subject = null) {
        let q = collection(db, 'materials');
        
        if (subject) {
            q = query(q, where('subject', '==', subject));
        }
        
        q = query(q, orderBy('createdAt', 'desc'));
        
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
        
        // Сохраняем функцию отписки
        const listenerId = `materials_${subject || 'all'}_${Date.now()}`;
        this.listeners.set(listenerId, unsubscribe);
        return listenerId;
    }

    // Подписка на изменения школ
    subscribeSchools(callback) {
        const q = query(collection(db, 'schools'), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const schools = [];
            querySnapshot.forEach((doc) => {
                schools.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(schools);
        });
        
        const listenerId = `schools_${Date.now()}`;
        this.listeners.set(listenerId, unsubscribe);
        return listenerId;
    }

    // Подписка на изменения пользователей
    subscribeUsers(callback) {
        const unsubscribe = onSnapshot(collection(db, 'users'), async (querySnapshot) => {
            const users = [];
            
            for (const userDoc of querySnapshot.docs) {
                const userData = userDoc.data();
                let profileData = {};
                
                // Получаем профиль в зависимости от роли
                if (userData.role === 'student') {
                    const profileDoc = await getDoc(doc(db, 'studentProfiles', userDoc.id));
                    if (profileDoc.exists()) {
                        profileData = profileDoc.data();
                    }
                } else if (userData.role === 'teacher') {
                    const profileDoc = await getDoc(doc(db, 'teacherProfiles', userDoc.id));
                    if (profileDoc.exists()) {
                        profileData = profileDoc.data();
                    }
                }
                
                users.push({
                    id: userDoc.id,
                    email: userData.email,
                    role: userData.role,
                    createdAt: userData.createdAt,
                    lastLogin: userData.lastLogin,
                    profile: profileData
                });
            }
            
            callback(users);
        });
        
        const listenerId = `users_${Date.now()}`;
        this.listeners.set(listenerId, unsubscribe);
        return listenerId;
    }

    // Отписка от слушателя
    unsubscribe(listenerId) {
        const unsubscribeFunction = this.listeners.get(listenerId);
        if (unsubscribeFunction) {
            unsubscribeFunction();
            this.listeners.delete(listenerId);
            return true;
        }
        return false;
    }

    // Отписка от всех слушателей
    unsubscribeAll() {
        this.listeners.forEach((unsubscribeFunction) => {
            unsubscribeFunction();
        });
        this.listeners.clear();
    }

    // === АНАЛИТИКА ===
    
    // Получение статистики для дашборда
    async getStatistics() {
        try {
            // Подсчет пользователей
            const usersSnapshot = await getDocs(collection(db, 'users'));
            let studentsCount = 0;
            let teachersCount = 0;
            let adminsCount = 0;
            
            usersSnapshot.forEach((doc) => {
                const role = doc.data().role;
                if (role === 'student') studentsCount++;
                else if (role === 'teacher') teachersCount++;
                else if (role === 'admin') adminsCount++;
            });
            
            // Подсчет материалов
            const materialsSnapshot = await getDocs(collection(db, 'materials'));
            const materialsCount = materialsSnapshot.size;
            
            // Подсчет школ
            const schoolsSnapshot = await getDocs(collection(db, 'schools'));
            const schoolsCount = schoolsSnapshot.size;
            
            return {
                success: true,
                statistics: {
                    users: {
                        total: usersSnapshot.size,
                        students: studentsCount,
                        teachers: teachersCount,
                        admins: adminsCount
                    },
                    materials: materialsCount,
                    schools: schoolsCount
                }
            };
        } catch (error) {
            console.error('Ошибка получения статистики:', error);
            return { success: false, error: error.message };
        }
    }
}

// Создаем единственный экземпляр сервиса
const firebaseDB = new FirebaseDatabaseService();
export default firebaseDB;