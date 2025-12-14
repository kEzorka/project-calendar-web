/**
 * СЕРВИС ЗАДАЧ
 * 
 * ИСПОЛЬЗУЕТСЯ В:
 * 
 * TaskDetailModal.tsx:
 *   import { taskService } from '../minimal_test/api/taskService';
 *   import type { Task, Assignment } from '../minimal_test/types';
 *   
 *   // Загрузка деталей задачи
 *   useEffect(() => {
 *     if (taskId && isOpen) {
 *       const loadTask = async () => {
 *         const taskData = await taskService.getTaskById(taskId);
 *         setTask(taskData);
 *       };
 *       loadTask();
 *     }
 *   }, [taskId, isOpen]);
 * 
 * МЕТОДЫ:
 * - getTaskById(id: string): Promise<Task | null>
 *   Получить задачу по ID
 * 
 * - getTaskAssignments(taskId: string): Promise<Assignment[]>
 *   Получить список назначений на задачу (для будущего AssignmentManager)
 * 
 * ЧТО УВИДИШЬ В КОНСОЛИ:
 * [MOCK] Get task by id: task-1
 * [MOCK] Get assignments for task: task-1
 */

import type { Task, Assignment } from '../../types';

const mockTasks: Task[] = [
  {
    id: 'task-1',
    parent_task_id: null,
    title: 'Реализовать UserSearch компонент',
    description: 'Компонент для поиска пользователей с debounce 300ms',
    status: 'completed',
    priority: 'high',
    start_date: '2025-11-25',
    end_date: '2025-11-27',
    estimated_hours: 8,
  },
  {
    id: 'task-2',
    parent_task_id: null,
    title: 'Создать TaskDetailModal',
    description: 'Модальное окно для отображения деталей задачи',
    status: 'in_progress',
    priority: 'high',
    start_date: '2025-11-26',
    end_date: '2025-11-28',
    estimated_hours: 6,
  },
  {
    id: 'task-3',
    parent_task_id: null,
    title: 'Настроить тестовое окружение',
    description: 'Подготовить моковые данные и API для тестирования',
    status: 'pending',
    priority: 'medium',
    start_date: '2025-11-29',
    end_date: '2025-11-30',
    estimated_hours: 4,
  },
];

const mockAssignments: Assignment[] = [
  {
    id: 'assign-1',
    task_id: 'task-1',
    user_id: 'user-1',
    role: 'owner',
    allocated_hours: 8,
  },
  {
    id: 'assign-2',
    task_id: 'task-1',
    user_id: 'user-2',
    role: 'executor',
    allocated_hours: 4,
  },
  {
    id: 'assign-3',
    task_id: 'task-2',
    user_id: 'user-1',
    role: 'owner',
    allocated_hours: 6,
  },
];

export const taskService = {
  async getTaskById(id: string): Promise<Task | null> {
    console.log('[MOCK] Get task by id:', id);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const task = mockTasks.find(t => t.id === id);
    return task || null;
  },
  async getTaskAssignments(taskId: string): Promise<Assignment[]> {
    console.log('[MOCK] Get assignments for task:', taskId);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockAssignments.filter(a => a.task_id === taskId);
  },
};
