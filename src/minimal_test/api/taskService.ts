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

import type { Task, Assignment } from '../types';

const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Реализовать UserSearch компонент',
    description: 'Компонент для поиска пользователей с debounce 300ms',
    status: 'completed',
    priority: 'high',
    startdate: '2025-11-25',
    enddate: '2025-11-27',
    estimatedhours: 8,
  },
  {
    id: 'task-2',
    title: 'Создать TaskDetailModal',
    description: 'Модальное окно для отображения деталей задачи',
    status: 'in-progress',
    priority: 'high',
    startdate: '2025-11-26',
    enddate: '2025-11-28',
    estimatedhours: 6,
  },
  {
    id: 'task-3',
    title: 'Настроить тестовое окружение',
    description: 'Подготовить моковые данные и API для тестирования',
    status: 'not-started',
    priority: 'medium',
    startdate: '2025-11-29',
    enddate: '2025-11-30',
    estimatedhours: 4,
  },
];

const mockAssignments: Assignment[] = [
  {
    id: 'assign-1',
    taskid: 'task-1',
    userid: 'user-1',
    role: 'owner',
    allocatedhours: 8,
  },
  {
    id: 'assign-2',
    taskid: 'task-1',
    userid: 'user-2',
    role: 'executor',
    allocatedhours: 4,
  },
  {
    id: 'assign-3',
    taskid: 'task-2',
    userid: 'user-1',
    role: 'owner',
    allocatedhours: 6,
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
    
    return mockAssignments.filter(a => a.taskid === taskId);
  },
};
