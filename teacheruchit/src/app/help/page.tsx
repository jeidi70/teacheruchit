'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function HelpPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Помощь
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Часто задаваемые вопросы и руководства по использованию платформы.
          </p>
        </div>

        <div className="mt-12">
          <div className="space-y-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Как начать использовать платформу?
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  1. Зарегистрируйтесь на платформе, указав свой email и пароль.
                  <br />
                  2. Выберите роль: учитель или ученик.
                  <br />
                  3. Заполните свой профиль, указав необходимую информацию.
                  <br />
                  4. Начните использовать платформу в соответствии с вашей
                  ролью.
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Как создать урок?
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  1. Перейдите в раздел "Уроки" в панели управления.
                  <br />
                  2. Нажмите кнопку "Создать урок".
                  <br />
                  3. Заполните информацию об уроке: название, описание,
                  категорию.
                  <br />
                  4. Добавьте блоки урока: текст, видео, карты, документы.
                  <br />
                  5. Создайте тесты и задания для проверки знаний.
                  <br />
                  6. Опубликуйте урок.
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Как пройти урок?
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  1. Перейдите в раздел "Уроки" в панели управления.
                  <br />
                  2. Выберите интересующий вас урок из списка.
                  <br />
                  3. Изучите материалы урока, следуя инструкциям.
                  <br />
                  4. Выполните тесты и задания.
                  <br />
                  5. Получите обратную связь и оценку.
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Как отслеживать прогресс?
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  1. Перейдите в раздел "Статистика" в панели управления.
                  <br />
                  2. Просмотрите общую статистику: количество уроков,
                  средний балл.
                  <br />
                  3. Изучите детальную статистику по каждому уроку.
                  <br />
                  4. Отслеживайте свой прогресс в достижениях и уровнях.
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Как настроить профиль?
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  1. Перейдите в раздел "Профиль" в панели управления.
                  <br />
                  2. Нажмите кнопку "Редактировать".
                  <br />
                  3. Обновите информацию о себе.
                  <br />
                  4. Сохраните изменения.
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Как настроить уведомления?
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  1. Перейдите в раздел "Настройки" в панели управления.
                  <br />
                  2. Выберите подраздел "Уведомления".
                  <br />
                  3. Настройте параметры уведомлений.
                  <br />
                  4. Сохраните изменения.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="rounded-md shadow">
            <a
              href="/login"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Начать использовать
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 