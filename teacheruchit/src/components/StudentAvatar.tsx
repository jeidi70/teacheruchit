'use client';

import { useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

interface UserProgress {
  xp: number;
  level: number;
  avatarProgress: number;
}

export default function StudentAvatar() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const progressRef = doc(db, 'userProgress', user.uid);
      
      const unsubscribe = onSnapshot(progressRef, 
        (doc) => {
          if (doc.exists()) {
            setProgress(doc.data() as UserProgress);
          } else {
            // Инициализируем прогресс, если его нет
            setProgress({
              xp: 0,
              level: 1,
              avatarProgress: 0
            });
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching avatar progress:', error);
          setError('Ошибка загрузки прогресса аватара');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up avatar progress listener:', err);
      setError('Ошибка инициализации прогресса аватара');
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-yellow-600">Нет данных о прогрессе</p>
      </div>
    );
  }

  // Рассчитываем уровень на основе XP
  const level = Math.floor(progress.xp / 1000) + 1;
  const xpInCurrentLevel = progress.xp % 1000;
  const xpToNextLevel = 1000 - xpInCurrentLevel;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-4">
        {/* Аватар */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {level}
          </div>
        </div>

        {/* Информация о прогрессе */}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            Уровень {level}
          </h3>
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{xpInCurrentLevel} XP</span>
              <span>{xpToNextLevel} XP до следующего уровня</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(xpInCurrentLevel / 1000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Прогресс аватара */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Прогресс аватара
        </h4>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress.avatarProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
} 