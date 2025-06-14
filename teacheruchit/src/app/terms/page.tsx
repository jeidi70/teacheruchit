'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function TermsPage() {
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
            Условия использования
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Правила и условия использования платформы TeacherUchit.
          </p>
        </div>

        <div className="mt-12">
          <div className="space-y-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Общие положения
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  1. Используя платформу TeacherUchit, вы соглашаетесь с
                  настоящими условиями использования.
                  <br />
                  2. Платформа предназначена для образовательных целей.
                  <br />
                  3. Мы оставляем за собой право изменять условия использования.
                  <br />
                  4. Продолжение использования платформы после изменений
                  означает принятие новых условий.
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Регистрация и аккаунт
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  1. Для использования платформы необходима регистрация.
                  <br />
                  2. Вы обязаны предоставить достоверную информацию.
                  <br />
                  3. Вы несете ответственность за безопасность своего аккаунта.
                  <br />
                  4. Мы оставляем за собой право блокировать аккаунты при
                  нарушении правил.
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Использование платформы
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  1. Вы обязуетесь использовать платформу законным образом.
                  <br />
                  2. Запрещается нарушать работу платформы.
                  <br />
                  3. Запрещается распространять вредоносное ПО.
                  <br />
                  4. Запрещается нарушать права других пользователей.
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Контент
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  1. Вы сохраняете права на созданный вами контент.
                  <br />
                  2. Вы предоставляете нам право использовать контент для
                  работы платформы.
                  <br />
                  3. Запрещается размещать незаконный контент.
                  <br />
                  4. Мы оставляем за собой право удалять контент.
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Ответственность
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  1. Мы не несем ответственности за действия пользователей.
                  <br />
                  2. Мы не гарантируем бесперебойную работу платформы.
                  <br />
                  3. Вы несете ответственность за свои действия на платформе.
                  <br />
                  4. Мы не несем ответственности за потерю данных.
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
                  По вопросам условий использования обращайтесь:
                  <br />
                  Email: terms@teacheruchit.com
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