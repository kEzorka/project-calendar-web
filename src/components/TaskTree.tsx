import React, { useState, useEffect } from 'react';
import { taskService } from '../api/taskService';
import type { Task } from '../types';
import './TaskTree.scss';

interface TaskNodeProps {
  task: Task;
  level: number;
  onTaskClick: (task: Task) => void;
  selectedTaskId: string | null;
}

const TaskNode: React.FC<TaskNodeProps> = ({ task, level, onTaskClick, selectedTaskId }) => {
  const [expanded, setExpanded] = useState(false);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (!expanded) {
      setLoading(true);
      try {
        const data = await taskService.getSubtasks(task.id);
        setSubtasks(data);
      } catch (err) {
        console.error('Ошибка при загрузке подзадач:', err);
      }
      setLoading(false);
    }
    setExpanded(!expanded);
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

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Новая',
      in_progress: 'В процессе',
      completed: 'Завершена',
      cancelled: 'Отменена',
    };
    return labels[status] || status;
  };

  const isSelected = task.id === selectedTaskId;

  return (
    <div className="task-node" style={{ marginLeft: `${level * 20}px` }}>
      <div className={`task-node__content ${isSelected ? 'task-node__content--selected' : ''}`}>
        <button
          className={`task-node__expand ${expanded ? 'task-node__expand--open' : ''}`}
          onClick={handleExpand}
          disabled={loading}
        >
          {loading ? '⌛' : '▶'}
        </button>

        <div className="task-node__info" onClick={() => onTaskClick(task)}>
          <span className="task-node__title">{task.title}</span>
          <span className="task-node__status">{getStatusLabel(task.status)}</span>
          <span
            className="task-node__priority"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="task-node__children">
          {subtasks.length > 0 ? (
            subtasks.map((subtask) => (
              <TaskNode
                key={subtask.id}
                task={subtask}
                level={level + 1}
                onTaskClick={onTaskClick}
                selectedTaskId={selectedTaskId}
              />
            ))
          ) : (
            <div className="task-node__empty">Нет подзадач</div>
          )}
        </div>
      )}
    </div>
  );
};

interface TaskTreeProps {
  taskId: string;
  onTaskSelect?: (task: Task | null) => void;
}

export const TaskTree: React.FC<TaskTreeProps> = ({ taskId, onTaskSelect }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [taskId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getSubtasks(taskId);
      setTasks(data);
    } catch (err) {
      console.error('Ошибка при загрузке дерева задач:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    // Toggle selection: если кликнули на уже выбранную задачу, снимаем выбор
    const newSelectedTask = selectedTask?.id === task.id ? null : task;
    setSelectedTask(newSelectedTask);
    if (onTaskSelect) {
      onTaskSelect(newSelectedTask);
    }
  };

  if (loading) {
    return <div className="task-tree">Загрузка...</div>;
  }

  return (
    <div className="task-tree">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskNode 
            key={task.id} 
            task={task} 
            level={0} 
            onTaskClick={handleTaskClick}
            selectedTaskId={selectedTask?.id || null}
          />
        ))
      ) : (
        <div className="task-tree__empty">Нет задач</div>
      )}
      {selectedTask && (
        <div className="task-tree__selected">
          <strong>Выбрана задача:</strong> {selectedTask.title}
          <button 
            onClick={() => handleTaskClick(selectedTask)}
            className="task-tree__deselect"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
