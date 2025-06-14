'use client';

import { useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  xpReward: number;
}

const BADGES: Badge[] = [
  {
    id: 'historian_lvl1',
    name: 'Начинающий историк',
    description: 'Пройдите свой первый урок по истории',
    icon: '📚',
    requirement: '1 урок',
    xpReward: 100
  },
  {
    id: 'analyst',
    name: 'Аналитик',
    description: 'Напишите 10 эссе с высоким баллом',
    icon: '📝',
    requirement: '10 эссе',
    xpReward: 500
  },
  {
    id: 'researcher',
    name: 'Исследователь',
    description: 'Изучите все материалы по одной исторической эпохе',
    icon: '🔍',
    requirement: '1 эпоха',
    xpReward: 300
  },
  {
    id: 'debater',
    name: 'Оратор',
    description: 'Участвуйте в 5 дискуссиях',
    icon: '🗣️',
    requirement: '5 дискуссий',
    xpReward: 200
  }
];

export default function Badges() {
  const { user } = useAuth();
  const [userBadges, setUserBadges] = useState<string[]>([]);
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
            setUserBadges(doc.data().badges || []);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching badges:', error);
          setError('Ошибка загрузки достижений');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up badges listener:', err);
      setError('Ошибка инициализации достижений');
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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Достижения</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BADGES.map((badge) => {
          const isUnlocked = userBadges.includes(badge.id);
          
          return (
            <div 
              key={badge.id}
              className={`p-4 rounded-lg border ${
                isUnlocked 
                  ? 'border-indigo-200 bg-indigo-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-3xl">{badge.icon}</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {badge.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {badge.description}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>Требование: {badge.requirement}</span>
                    <span className="mx-2">•</span>
                    <span>Награда: {badge.xpReward} XP</span>
                  </div>
                  {isUnlocked && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Получено
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 