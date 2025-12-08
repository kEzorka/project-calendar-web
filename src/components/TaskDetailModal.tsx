import React, { useState } from 'react';
import { Modal } from '../minimal_test/ui/Modal';
import { Card } from '../minimal_test/ui/Card';
import { Button } from '../minimal_test/ui/Button';
import { Loader } from '../minimal_test/ui/Loader';
import type { Task } from '../types'

const formatDate = (date: string | undefined): string => {
    if (!date) return '—';
    try {
        return new Date(date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return date;
    }
};

interface TaskDetailModalProps { // входные пропсы
    task: Task | null; // объект задачи
    isOpen: boolean; // нужно ли показывать модалку
    loading?: boolean; // флаг загрузки
    onClose: () => void; // закрытие модалки
    onEdit?: (taskId: string) => void; // кнопка редактировать
    onDelete?: (taskId: string) => void; // кнопка удалить
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ // деструктурируем входящие пропсы
    task,
    isOpen,
    loading = false,
    onClose,
    onEdit,
    onDelete,
}) => {
    if (!isOpen) return null; // если модалка закрыта, то ничего не рисуем

    const [showConfirm, setShowConfirm] = useState(false); // локальный стейт для модалки подтверждения

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Детали задачи">
            {loading && (
                <div className="flex justify-center">
                    <Loader text="Загрузка данных задачи..." />
                </div>
            )}

            {!loading && !task && (
                <Card>
                    <div className="text-gray-500">Нет данных о задаче.</div>
                </Card>
            )}

            {!loading && task && ( // основные данные задачи
                <div className="flex flex-col gap-4">

                    <Card title={task.title}>
                        <div>
                            <strong>Описание:</strong>{' '}
                            {task.description || '—'}
                        </div>
                    </Card>

                    <Card>
                        <div className="flex flex-col gap-1">
                            <div>
                                <strong>Статус:</strong> {task.status}
                            </div>
                            <div>
                                <strong>Приоритет:</strong> {task.priority}
                            </div>
                        </div>
                    </Card>

                    <Card title="Сроки">
                        <div className="flex flex-col gap-1">
                            <div>
                                <strong>Дата начала:</strong> {formatDate(task.start_date)}
                            </div>
                            <div>
                                <strong>Дата окончания:</strong> {formatDate(task.end_date)}
                            </div>
                            <div>
                                <strong>Оценка часов:</strong> {task.estimated_hours ?? 0}
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="secondary" onClick={onClose}>
                            Закрыть
                        </Button>

                        {onEdit && (
                            <Button
                                variant="primary"
                                onClick={() => onEdit(task.id)}
                            >
                                Редактировать
                            </Button>
                        )}

                        {onDelete && (
                            <Button
                                variant="danger"
                                onClick={() => setShowConfirm(true)} // вместо confirm() открываем кастомную модалку
                            >
                                Удалить
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {showConfirm && (
                <Modal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)} // закрыть модалку
                    title="Подтверждение удаления"
                >
                    <div className="flex flex-col gap-4">
                        <p>Вы уверены, что хотите удалить эту задачу? Это действие необратимо.</p>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setShowConfirm(false)} // отмена удаления
                            >
                                Отмена
                            </Button>

                            <Button
                                variant="danger"
                                onClick={() => {
                                    if (task) {
                                        setShowConfirm(false); // закрыть модалку
                                        onDelete?.(task.id); // выполнить удаление
                                    }
                                }}
                            >
                                Удалить
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </Modal>
    );
};
