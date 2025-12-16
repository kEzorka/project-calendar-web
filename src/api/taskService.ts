/*
Жду бэкенд

import { apiClient } from './client';
import type { Task, TasksQueryParams } from '../types';

export const taskService = {
  async getTasks(params?: TasksQueryParams) {
    const response = await apiClient.get<Task[]>('/tasks', { params });
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(data: Partial<Task>): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', data);
    return response.data;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async getSubtasks(id: string): Promise<Task[]> {
    const response = await apiClient.get<Task[]>(`/tasks/${id}/subtasks`);
    return response.data;
  },
};

*/

// import { apiClient } from './client';
import type { Task, TasksQueryParams } from '../types';
import { 
  MOCK_TASKS, 
  MOCK_ASSIGNMENTS, 
  getTasksByParentId, 
  getTaskById,
  getAssignmentsByTaskId,
  getUsersByTaskId 
} from '../mock';

// Создаем копию для изменений
let mockTasks: Task[] = [...MOCK_TASKS];
let mockAssignments = [...MOCK_ASSIGNMENTS];

const genId = () => 'task-' + Math.random().toString(36).slice(2);

export const taskService = {
  async getTasks(params?: TasksQueryParams): Promise<Task[]> {
    await new Promise((r) => setTimeout(r, 200)); // имитация задержки

    if (params?.parent_task_id === null) {
      return mockTasks.filter((t) => !t.parent_task_id);
    }
    if (params?.parent_task_id) {
      return mockTasks.filter((t) => t.parent_task_id === params.parent_task_id);
    }
    return mockTasks;
  },

  async getTask(id: string): Promise<Task> {
    await new Promise((r) => setTimeout(r, 100));
    const task = mockTasks.find((t) => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  },

  async createTask(data: Partial<Task>): Promise<Task> {
    await new Promise((r) => setTimeout(r, 300));
    const now = new Date().toISOString().split('T')[0]; // только дата
    const newTask: Task = {
      id: genId(),
      parent_task_id: data.parent_task_id ?? null,
      title: data.title || 'Без названия',
      description: data.description || '',
      status: 'pending', // всегда начинается с pending
      priority: data.priority || 'medium',
      start_date: data.start_date || now,
      end_date: data.end_date || now,
      estimated_hours: data.estimated_hours ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockTasks.push(newTask);
    return newTask;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    await new Promise((r) => setTimeout(r, 200));
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    const updated: Task = {
      ...mockTasks[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    mockTasks[index] = updated;
    return updated;
  },

  async deleteTask(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    // Удаляем задачу и все её подзадачи рекурсивно
    const deleteRecursive = (taskId: string) => {
      const subtasks = mockTasks.filter((t) => t.parent_task_id === taskId);
      subtasks.forEach((st) => deleteRecursive(st.id));
      mockTasks = mockTasks.filter((t) => t.id !== taskId);
      mockAssignments = mockAssignments.filter((a) => a.task_id !== taskId);
    };
    deleteRecursive(id);
  },

  async getSubtasks(id: string): Promise<Task[]> {
    await new Promise((r) => setTimeout(r, 100));
    return mockTasks.filter((t) => t.parent_task_id === id);
  },

  // Дополнительные методы для работы с назначениями
  async getTaskAssignments(taskId: string) {
    await new Promise((r) => setTimeout(r, 100));
    return mockAssignments.filter((a) => a.task_id === taskId);
  },

  async getTaskUsers(taskId: string) {
    await new Promise((r) => setTimeout(r, 100));
    return getUsersByTaskId(taskId);
  },
};
