import React from 'react';
import type { Task } from '../types';
import './TaskDetailView.scss';

interface TaskDetailViewProps {
  task: Task;
}

export const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Новая',
      in_progress: 'В процессе',
      completed: 'Завершена',
      cancelled: 'Отменена',
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string): string => {
    const labels: Record<string, string> = {
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий',
      critical: 'Критический',
    };
    return labels[priority] || priority;
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      critical: '#ef4444',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#10b981',
    };
    return colors[priority] || '#6b7280';
  };

  return (
    <div className="task-detail-view">
      <div className="task-detail-view__header">
        <h2>{task.title}</h2>
        <div className="task-detail-view__badges">
          <span className="task-detail-view__status">{getStatusLabel(task.status)}</span>
          {task.parent_task_id && (
            <span
              className="task-detail-view__priority"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {getPriorityLabel(task.priority)}
            </span>
          )}
        </div>
      </div>

      {task.description && (
        <div className="task-detail-view__section">
          <h3>Описание</h3>
          <p>{task.description}</p>
        </div>
      )}

      <div className="task-detail-view__section">
        <h3>Сроки</h3>
        <div className="task-detail-view__dates">
          <div className="task-detail-view__date-item">
            <span className="task-detail-view__label">Дата начала:</span>
            <span className="task-detail-view__value">{formatDate(task.start_date)}</span>
          </div>
          <div className="task-detail-view__date-item">
            <span className="task-detail-view__label">Дата окончания:</span>
            <span className="task-detail-view__value">{formatDate(task.end_date)}</span>
          </div>
          {task.duration_days !== undefined && task.duration_days > 0 && (
            <div className="task-detail-view__date-item">
              <span className="task-detail-view__label">Длительность:</span>
              <span className="task-detail-view__value">
                {task.duration_days} {task.duration_days === 1 ? 'день' : 'дней'}
              </span>
            </div>
          )}
        </div>
      </div>

      {task.estimated_hours !== undefined && task.estimated_hours > 0 && (
        <div className="task-detail-view__section">
          <h3>Трудозатраты</h3>
          <p>{task.estimated_hours} часов</p>
        </div>
      )}
    </div>
  );
};
