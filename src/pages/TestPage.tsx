import React, { useState } from 'react';
import { TaskDetailModal } from '../components/TaskDetailModal';
import type { Task } from '../minimal_test/types';

export const TestPage: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const mockTask: Task = {
        id: "123",
        title: "Сделать API авторизации",
        description: "Создать эндпоинты login/register/me",
        status: "in-progress",
        priority: "high",
        startdate: "2025-12-01",
        enddate: "2025-12-10",
        estimatedhours: 14,
    };

    const openWithLoading = () => {
        setLoading(true);
        setOpen(true);

        // имитация загрузки
        setTimeout(() => setLoading(false), 1200);
    };

    return (
        <div className="p-10 flex flex-col gap-4">

            <h1 className="text-2xl font-semibold mb-4">Test TaskDetailModal</h1>

            <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setOpen(true)}
            >
                Открыть модалку (без загрузки)
            </button>

            <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={openWithLoading}
            >
                Открыть модалку (loading = true)
            </button>

            <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
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
        </div>
    );
};

export default TestPage;
