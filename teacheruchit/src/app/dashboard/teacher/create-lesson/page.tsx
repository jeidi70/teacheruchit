'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth/AuthProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const lessonSchema = z.object({
  title: z.string().min(3, 'Название должно быть не менее 3 символов'),
  description: z.string().min(10, 'Описание должно быть не менее 10 символов'),
  subject: z.enum(['history', 'social']),
  grade: z.number().min(5).max(11),
  classIds: z.array(z.string()).min(1, 'Выберите хотя бы один класс'),
});

type LessonForm = z.infer<typeof lessonSchema>;

export default function CreateLessonPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<LessonForm>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      subject: 'history',
      grade: 5,
      classIds: [],
    },
  });

  const onSubmit = async (data: LessonForm) => {
    try {
      const lessonData = {
        ...data,
        createdBy: user?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        blocks: [],
      };

      await addDoc(collection(db, 'lessons'), lessonData);
      router.push('/dashboard/teacher');
    } catch (err) {
      setError('Ошибка при создании урока');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Создание нового урока
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Название урока
              </label>
              <input
                {...register('title')}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Описание
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Предмет
              </label>
              <select
                {...register('subject')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="history">История</option>
                <option value="social">Обществознание</option>
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                Класс
              </label>
              <select
                {...register('grade', { valueAsNumber: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {[5, 6, 7, 8, 9, 10, 11].map((grade) => (
                  <option key={grade} value={grade}>
                    {grade} класс
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
              )}
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Создать
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 