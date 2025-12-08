import React, { useState } from 'react';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { UserSearch } from '../components/UserSearch';
import type { Task, User } from '../types';

export const TestPage: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const mockTask: Task = {
        id: "123",
        title: "Сделать API авторизации",
        description: "Создать эндпоинты login/register/me",
        status: "in_progress",
        priority: "high",
        start_date: "2025-12-01",
        end_date: "2025-12-10",
        estimated_hours: 14,
    };

    const openWithLoading = () => {
        setLoading(true);
        setOpen(true);

        // имитация загрузки
        setTimeout(() => setLoading(false), 1200);
    };

    return (
        <div className="p-10 flex flex-col gap-8">
            {/* === TaskDetailModal === */}
            <section>
                <h1 className="text-2xl font-semibold mb-4">📋 TaskDetailModal Component</h1>

                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setOpen(true)}
                >
                    Открыть модалку (без загрузки)
                </button>

                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-2"
                    onClick={openWithLoading}
                >
                    Открыть модалку (с загрузкой)
                </button>

                <button
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 ml-2"
                    onClick={() => {
                        setOpen(true);
                        setLoading(false);
                    }}
                >
                    Открыть пустую модалку (task = null)
                </button>

                <TaskDetailModal
                    task={loading ? null : mockTask}
                    isOpen={open}
                    loading={loading}
                    onClose={() => setOpen(false)}
                    onEdit={(id) => alert("Редактировать задачу с id: " + id)}
                    onDelete={(id) => alert("Удалить задачу с id: " + id)}
                />
            </section>

            {/* === UserSearch === */}
            <section className="border-t pt-8">
                <h1 className="text-2xl font-semibold mb-4">🔍 UserSearch Component</h1>
                
                <div className="max-w-sm">
                    <UserSearch
                        onSelect={(user) => {
                            setSelectedUser(user);
                            alert(`Выбран пользователь: ${user.full_name}`);
                        }}
                        excludeIds={[]} // можете добавить id для исключения
                    />
                </div>

                {selectedUser && (
                    <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
                        <h3 className="font-semibold mb-2">✅ Выбранный пользователь:</h3>
                        <p><strong>Имя:</strong> {selectedUser.full_name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Username:</strong> {selectedUser.username}</p>
                        <p><strong>Часовой пояс:</strong> {selectedUser.timezone}</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default TestPage;
