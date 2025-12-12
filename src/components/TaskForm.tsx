import React, { useState /*, useEffect*/ } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import type { Task } from '../types';
import './TaskForm.scss';

interface TaskFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  task?: Task;
  isProject?: boolean;
}

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'critical', label: 'Критический' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Новая' },
  { value: 'in_progress', label: 'В процессе' },
  { value: 'completed', label: 'Завершена' },
  { value: 'cancelled', label: 'Отменена' },
];

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  task,
  isProject = false,
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    start_date: task?.start_date || '',
    end_date: task?.end_date || '',
    priority: task?.priority || 'medium',
    estimated_hours: task?.estimated_hours || 0,
    status: task?.status || 'pending',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'Название обязательно';
        return '';
      case 'end_date':
        if (value && formData.start_date && value < formData.start_date) {
          return 'Дата окончания не может быть раньше даты начала';
        }
        return '';
      case 'start_date':
        if (value && formData.end_date && value > formData.end_date) {
          return 'Дата начала не может быть позже даты окончания';
        }
        return '';
      case 'estimated_hours':
        if (value < 0) return 'Количество часов не может быть отрицательным';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData({ ...formData, [field]: value });

      if (touched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    (Object.keys(formData) as (keyof typeof formData)[]).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <Input
        label="Название"
        type="text"
        value={formData.title}
        onChange={handleInputChange('title')}
        onBlur={handleBlur('title')}
        error={errors.title}
        required
      />

      <Input
        label="Описание"
        type="textarea"
        value={formData.description}
        onChange={handleInputChange('description')}
        onBlur={handleBlur('description')}
        isTextarea
      />

      <Input
        label="Дата начала"
        type="date"
        value={formData.start_date}
        onChange={handleInputChange('start_date')}
        onBlur={handleBlur('start_date')}
        error={errors.start_date}
      />

      <Input
        label="Дата окончания"
        type="date"
        value={formData.end_date}
        onChange={handleInputChange('end_date')}
        onBlur={handleBlur('end_date')}
        error={errors.end_date}
      />

      <Select
        label="Приоритет"
        options={PRIORITY_OPTIONS}
        value={formData.priority}
        onChange={(e) => handleSelectChange('priority', e.target.value)}
      />

      <Select
        label="Статус"
        options={STATUS_OPTIONS}
        value={formData.status}
        onChange={(e) => handleSelectChange('status', e.target.value)}
      />

      <Input
        label="Ожидаемые часы"
        type="number"
        value={formData.estimated_hours.toString()}
        onChange={(e) =>
          setFormData({ ...formData, estimated_hours: parseFloat(e.target.value) || 0 })
        }
        onBlur={handleBlur('estimated_hours')}
        error={errors.estimated_hours}
      />

      <div className="task-form__actions">
        <Button type="submit" variant="primary">
          Сохранить
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
};
