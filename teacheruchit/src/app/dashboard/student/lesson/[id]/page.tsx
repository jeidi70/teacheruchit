'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Lesson } from '@/types';

export default function LessonPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentBlock, setCurrentBlock] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchLesson = async () => {
      const lessonDoc = await getDoc(doc(db, 'lessons', params.id));
      if (lessonDoc.exists()) {
        setLesson({ id: lessonDoc.id, ...lessonDoc.data() } as Lesson);
      }
    };

    fetchLesson();
  }, [params.id]);

  if (loading || !lesson) {
    return <div>Загрузка...</div>;
  }

  const renderBlock = (block: Lesson['blocks'][0]) => {
    switch (block.type) {
      case 'video':
        return (
          <div className="aspect-w-16 aspect-h-9">
            <video
              src={block.data.url}
              controls
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'map':
        return (
          <div className="h-96">
            {/* Здесь будет компонент карты */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              Интерактивная карта
            </div>
          </div>
        );
      case 'document':
        return (
          <div className="h-96">
            {/* Здесь будет компонент документа */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              Документ
            </div>
          </div>
        );
      case 'quiz':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{block.data.question}</h3>
            <div className="space-y-2">
              {block.data.options.map((option: string, index: number) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-50"
                  onClick={() => {
                    // Обработка ответа
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      case 'simulator':
        return (
          <div className="h-96">
            {/* Здесь будет компонент симулятора */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              Симулятор
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="mt-2 text-gray-600">{lesson.description}</p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {lesson.blocks[currentBlock] && (
                <div className="space-y-6">
                  {renderBlock(lesson.blocks[currentBlock])}
                  
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setCurrentBlock(prev => Math.max(0, prev - 1))}
                      disabled={currentBlock === 0}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50"
                    >
                      Назад
                    </button>
                    <button
                      onClick={() => setCurrentBlock(prev => Math.min(lesson.blocks.length - 1, prev + 1))}
                      disabled={currentBlock === lesson.blocks.length - 1}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Далее
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 