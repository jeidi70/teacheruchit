'use client';

import { useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

interface UserProgress {
  xp: number;
  badges: string[];
  lastCompleted?: {
    lessonId: string;
    timestamp: Date;
  };
}

export default function StudentProgress() {
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
              badges: []
            });
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching progress:', error);
          setError('Ошибка загрузки прогресса');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up progress listener:', err);
      setError('Ошибка инициализации прогресса');
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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Мой прогресс</h2>
      
      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Опыт</span>
          <span className="text-sm font-medium text-gray-700">{progress.xp} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${(progress.xp % 1000) / 10}%` }}
          ></div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Достижения</h3>
        <div className="grid grid-cols-2 gap-4">
          {progress.badges.length > 0 ? (
            progress.badges.map((badge) => (
              <div 
                key={badge}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-indigo-600">🏆</span>
                </div>
                <span className="text-sm font-medium">{badge}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-2">Пока нет достижений</p>
          )}
        </div>
      </div>

      {/* Last Completed Lesson */}
      {progress.lastCompleted && (
        <div>
          <h3 className="text-lg font-medium mb-3">Последний пройденный урок</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              {new Date(progress.lastCompleted.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 