import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Modal } from './ui/Modal';
import { assignmentService } from '../minimal_test/api/assignmentService';
import type { Assignment } from '../types';
import './AssignmentManager.scss';

interface AssignmentManagerProps {
  taskId: string;
}

// мок‑пользователи (позже будет поиск от Самины)
const MOCK_USERS = [
  { id: '1', username: 'woroncov', email: 'woroncov@example.com' },
  { id: '2', username: 'eagle', email: 'eagle@example.com' },
  { id: '3', username: 'whitewolf', email: 'whitewolf@example.com' },
  { id: '4', username: 'striker', email: 'striker@example.com' },
];

const ROLE_OPTIONS = [
  { value: 'owner', label: 'Владелец' },
  { value: 'supervisor', label: 'Руководитель' },
  { value: 'executor', label: 'Исполнитель' },
  { value: 'hybrid', label: 'Гибридная' },
  { value: 'spectator', label: 'Наблюдатель' },
];

export const AssignmentManager: React.FC<AssignmentManagerProps> = ({ taskId }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    role: 'executor',
    allocated_hours: 0,
  });
  const [error, setError] = useState('');

  const loadAssignments = React.useCallback(async () => {
    try {
      const data = await assignmentService.getAssignments(taskId);
      setAssignments(data);
    } catch (err) {
      console.error('Ошибка при загрузке назначений:', err);
    }
  }, [taskId]);
  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const handleAssignUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.user_id) {
      setError('Выберите пользователя');
      return;
    }

    try {
      await assignmentService.assignUser(taskId, {
        user_id: formData.user_id,
        role: formData.role as any,
        allocated_hours: formData.allocated_hours,
      });
      loadAssignments();
      setIsModalOpen(false);
      setFormData({ user_id: '', role: 'executor', allocated_hours: 0 });
    } catch (err: any) {
      setError(err.message || 'Ошибка при назначении');
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      await assignmentService.removeAssignment(assignmentId);
      loadAssignments();
    } catch (err) {
      console.error('Ошибка при удалении назначения:', err);
    }
  };

  const getUserName = (userId: string): string => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    return user?.username || 'Unknown';
  };

  return (
    <div className="assignment-manager">
      <div className="assignment-manager__header">
        <h3>Назначения</h3>
        <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm">
          + Назначить
        </Button>
      </div>

      {assignments.length > 0 ? (
        <div className="assignment-manager__list">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-manager__item">
              <div className="assignment-manager__info">
                <span className="assignment-manager__user">{getUserName(assignment.user_id)}</span>
                <span className="assignment-manager__role">{assignment.role}</span>
                {assignment.allocated_hours > 0 && (
                  <span className="assignment-manager__hours">{assignment.allocated_hours}ч</span>
                )}
              </div>
              <Button
                onClick={() => handleRemoveAssignment(assignment.id)}
                variant="danger"
                size="sm"
              >
                Удалить
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="assignment-manager__empty">Никого не назначено</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Назначить на задачу"
        size="md"
      >
        <form onSubmit={handleAssignUser} className="assignment-manager__form">
          <Select
            label="Пользователь"
            options={MOCK_USERS.map((u) => ({
              value: u.id,
              label: u.username,
            }))}
            value={formData.user_id}
            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
            required
          />

          <Select
            label="Роль"
            options={ROLE_OPTIONS}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />

          <Input
            label="Часы"
            type="number"
            value={formData.allocated_hours.toString()}
            onChange={(e) =>
              setFormData({ ...formData, allocated_hours: parseFloat(e.target.value) || 0 })
            }
          />

          {error && <div className="assignment-manager__error">{error}</div>}

          <div className="assignment-manager__actions">
            <Button type="submit" variant="primary">
              Назначить
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Отмена
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
