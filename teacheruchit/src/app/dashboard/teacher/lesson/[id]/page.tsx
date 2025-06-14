'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Lesson } from '@/types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function EditLessonPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleAddBlock = async (type: Lesson['blocks'][0]['type']) => {
    if (!lesson) return;

    const newBlock = {
      id: Date.now().toString(),
      type,
      data: {},
      order: lesson.blocks.length,
    };

    const updatedBlocks = [...lesson.blocks, newBlock];
    const updatedLesson = { ...lesson, blocks: updatedBlocks };

    try {
      await updateDoc(doc(db, 'lessons', lesson.id), {
        blocks: updatedBlocks,
        updatedAt: new Date(),
      });
      setLesson(updatedLesson);
    } catch (error) {
      console.error('Error adding block:', error);
    }
  };

  const handleMoveBlock = async (dragIndex: number, hoverIndex: number) => {
    if (!lesson) return;

    const updatedBlocks = [...lesson.blocks];
    const [draggedBlock] = updatedBlocks.splice(dragIndex, 1);
    updatedBlocks.splice(hoverIndex, 0, draggedBlock);

    // Обновляем порядок
    updatedBlocks.forEach((block, index) => {
      block.order = index;
    });

    try {
      await updateDoc(doc(db, 'lessons', lesson.id), {
        blocks: updatedBlocks,
        updatedAt: new Date(),
      });
      setLesson({ ...lesson, blocks: updatedBlocks });
    } catch (error) {
      console.error('Error moving block:', error);
    }
  };

  if (loading || !lesson) {
    return <div>Загрузка...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
                <p className="mt-2 text-gray-600">{lesson.description}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isEditing ? 'Сохранить' : 'Редактировать'}
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleAddBlock('video')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Добавить видео
                      </button>
                      <button
                        onClick={() => handleAddBlock('map')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Добавить карту
                      </button>
                      <button
                        onClick={() => handleAddBlock('document')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Добавить документ
                      </button>
                      <button
                        onClick={() => handleAddBlock('quiz')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Добавить тест
                      </button>
                      <button
                        onClick={() => handleAddBlock('simulator')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Добавить симулятор
                      </button>
                    </div>

                    <div className="space-y-4">
                      {lesson.blocks.map((block, index) => (
                        <div
                          key={block.id}
                          className="p-4 border rounded-md bg-gray-50"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {block.type === 'video' && 'Видео'}
                              {block.type === 'map' && 'Карта'}
                              {block.type === 'document' && 'Документ'}
                              {block.type === 'quiz' && 'Тест'}
                              {block.type === 'simulator' && 'Симулятор'}
                            </span>
                            <button
                              onClick={() => {
                                // Удаление блока
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lesson.blocks.map((block, index) => (
                      <div
                        key={block.id}
                        className="p-4 border rounded-md bg-white"
                      >
                        {/* Предпросмотр блока */}
                        <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                          {block.type === 'video' && 'Видео'}
                          {block.type === 'map' && 'Карта'}
                          {block.type === 'document' && 'Документ'}
                          {block.type === 'quiz' && 'Тест'}
                          {block.type === 'simulator' && 'Симулятор'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 