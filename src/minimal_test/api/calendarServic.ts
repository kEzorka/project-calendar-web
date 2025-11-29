import type { Task } from '../types';

// Моковые данные для календаря
const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Реализовать UserSearch компонент',
    description: 'Компонент для поиска пользователей',
    status: 'completed',
    priority: 'high',
    startdate: '2025-11-25',
    enddate: '2025-11-27',
    estimatedhours: 8,
    parenttaskid: null,
  },
  {
    id: 'task-2',
    title: 'Создать CalendarPage',
    description: 'Страница календаря с задачами',
    status: 'in-progress',
    priority: 'medium',
    startdate: '2025-11-28',
    enddate: '2025-11-30',
    estimatedhours: 12,
    parenttaskid: null,
  },
  {
    id: 'task-3',
    title: 'Разработать ProfilePage',
    description: 'Страница профиля пользователя',
    status: 'not-started',
    priority: 'medium',
    startdate: '2025-12-01',
    enddate: '2025-12-03',
    estimatedhours: 10,
    parenttaskid: null,
  },
];

export const calendarService = {
  async getCalendarTasks(startDate: string, endDate: string): Promise<Task[]> {
    console.log('[MOCK] Get calendar tasks:', { startDate, endDate });
    // Фильтруем задачи по датам
    return mockTasks.filter((task) => {
      if (!task.startdate || !task.enddate) return false;
      return task.startdate >= startDate && task.enddate <= endDate;
    });
  },

  async getTaskById(taskId: string): Promise<Task | null> {
    console.log('[MOCK] Get task by id:', taskId);
    return mockTasks.find((task) => task.id === taskId) || null;
  },
};
