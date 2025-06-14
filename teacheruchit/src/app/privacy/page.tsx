'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function PrivacyPage() {
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
            Политика конфиденциальности
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Как мы собираем, используем и защищаем ваши данные.
          </p>
        </div>

        <div className="mt-12">
          <div className="space-y-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Сбор информации
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  Мы собираем следующую информацию:
                  <br />
                  - Имя и контактные данные
                  <br />
                  - Информацию об образовании и опыте
                  <br />
                  - Данные об использовании платформы
                  <br />
                  - Техническую информацию о вашем устройстве
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Использование информации
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  Мы используем собранную информацию для:
                  <br />
                  - Предоставления образовательных услуг
                  <br />
                  - Улучшения работы платформы
                  <br />
                  - Отправки уведомлений и обновлений
                  <br />
                  - Анализа использования платформы
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Защита информации
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  Мы принимаем следующие меры для защиты ваших данных:
                  <br />
                  - Шифрование данных при передаче
                  <br />
                  - Регулярное резервное копирование
                  <br />
                  - Ограничение доступа к данным
                  <br />
                  - Мониторинг безопасности
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Передача данных
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  Мы не передаем ваши данные третьим лицам, за исключением:
                  <br />
                  - Когда это необходимо для предоставления услуг
                  <br />
                  - По требованию законодательства
                  <br />
                  - С вашего явного согласия
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Ваши права
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  Вы имеете право:
                  <br />
                  - Получить доступ к своим данным
                  <br />
                  - Исправить неточные данные
                  <br />
                  - Удалить свои данные
                  <br />
                  - Отозвать согласие на обработку
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Контакты
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  По вопросам конфиденциальности обращайтесь:
                  <br />
                  Email: privacy@teacheruchit.com
                  <br />
                  Телефон: +7 (999) 123-45-67
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