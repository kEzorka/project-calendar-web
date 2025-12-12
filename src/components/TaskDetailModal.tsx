import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import type { Task } from '../types';

const formatDate = (date: string | undefined): string => {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return date;
  }
};

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  loading?: boolean;
  onClose: () => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  loading = false,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

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

      {!loading && task && (
        <div className="flex flex-col gap-4 -mt-6">
          <Card title={task.title}>
            <div>
              <strong>Описание:</strong> {task.description || '—'}
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

          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-start',
              columnGap: '12px',
            }}
          >
            {onEdit && (
              <Button
                variant="primary"
                onClick={() => {
                  if (task) {
                    onEdit(task.id);
                  }
                }}
              >
                Редактировать
              </Button>
            )}

            {onDelete && (
              <Button variant="danger" onClick={() => setShowConfirm(true)}>
                Удалить
              </Button>
            )}
          </div>
        </div>
      )}

      {showConfirm && (
        <Modal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          title="Подтверждение удаления"
        >
          <div className="flex flex-col gap-4">
            <p>Вы уверены, что хотите удалить эту задачу? Это действие необратимо.</p>

            <div
              style={{
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'flex-start',
                columnGap: '12px',
              }}
            >
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                Отмена
              </Button>

              <Button
                variant="danger"
                onClick={() => {
                  if (task) {
                    setShowConfirm(false);
                    onDelete?.(task.id);
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
