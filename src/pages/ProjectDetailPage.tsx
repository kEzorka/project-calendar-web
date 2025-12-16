import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Loader } from '../components/ui/Loader';
import { TaskForm } from '../components/TaskForm';
import { TaskTree } from '../components/TaskTree';
import { AssignmentManager } from '../components/AssignmentManager';
import { taskService } from '../api/taskService';
import type { Task } from '../types';
import './ProjectDetailPage.scss';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTask(id!);
      setProject(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке проекта');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData: any) => {
    try {
      // Если выбрана задача, создаем подзадачу для нее
      const parentId = selectedTask ? selectedTask.id : id;
      await taskService.createTask({
        ...formData,
        parent_task_id: parentId,
      });
      loadProject();
      setIsModalOpen(false);
      setSelectedTask(null); // Сбрасываем выбор после создания
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании задачи');
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Не сбрасываем выбор задачи при закрытии модалки без создания
  };

  const handleTaskSelect = (task: Task | null) => {
    setSelectedTask(task);
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

  if (loading) {
    return (
      <div className="project-detail-page">
        <Loader size="lg" text="Загрузка проекта..." />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <div className="project-detail-page__error">Проект не найден</div>
        <Button onClick={() => navigate('/')}>Вернуться к проектам</Button>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <div className="project-detail-page__breadcrumbs">
        <button onClick={() => navigate('/')} className="project-detail-page__breadcrumb-link">
          Проекты
        </button>
        <span className="project-detail-page__breadcrumb-separator">/</span>
        <span>{project.title}</span>
      </div>

      <div className="project-detail-page__header">
        <div className="project-detail-page__header-content">
          <h1>{project.title}</h1>
          <p className="project-detail-page__description">{project.description}</p>
          <div className="project-detail-page__meta">
            <span className="project-detail-page__status">{getStatusLabel(project.status)}</span>
            <span className="project-detail-page__priority">{project.priority}</span>
          </div>
        </div>
        <Button onClick={handleOpenModal} variant="primary" size="lg">
          + Создать {selectedTask ? 'подзадачу' : 'задачу'}
        </Button>
      </div>

      {error && <div className="project-detail-page__error">{error}</div>}

      <div className="project-detail-page__tasks">
        <h2>Задачи</h2>
        {id && <TaskTree taskId={id} onTaskSelect={handleTaskSelect} />}
      </div>

      <div className="project-detail-page__assignments">
        <h2>Участники</h2>
        {id && <AssignmentManager taskId={id} />}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedTask ? `Создать подзадачу для "${selectedTask.title}"` : 'Создать задачу'}
        size="md"
      >
        <TaskForm onSubmit={handleCreateTask} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;
