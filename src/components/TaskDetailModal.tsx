// TaskDetailModal.tsx
import React from 'react';
import { Modal } from '../minimal_test/ui/Modal';
import { Card } from '../minimal_test/ui/Card';
import { Button } from '../minimal_test/ui/Button';
import { Loader } from '../minimal_test/ui/Loader';
import type { Task } from '../minimal_test/types';

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

            {!loading && task && ( // основные данных задачи
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
                                <strong>Дата начала:</strong> {task.startdate || '—'}
                            </div>
                            <div>
                                <strong>Дата окончания:</strong> {task.enddate || '—'}
                            </div>
                            <div>
                                <strong>Оценка часов:</strong> {task.estimatedhours ?? 0}
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
                                onClick={() => {
                                    if (confirm('Удалить задачу? Это действие необратимо.')) {
                                        onDelete(task.id);
                                    }
                                }}
                            >
                                Удалить
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};
