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

let mockTasks: Task[] = [];

const genId = () => Math.random().toString(36).slice(2);

export const taskService = {
  async getTasks(params?: TasksQueryParams): Promise<Task[]> {
    if (params?.parent_task_id === null) {
      return mockTasks.filter((t) => !t.parent_task_id);
    }
    if (params?.parent_task_id) {
      return mockTasks.filter((t) => t.parent_task_id === params.parent_task_id);
    }
    return mockTasks;
  },

  async getTask(id: string): Promise<Task> {
    const task = mockTasks.find((t) => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  },

  async createTask(data: Partial<Task>): Promise<Task> {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: genId(),
      parent_task_id: data.parent_task_id ?? null,
      title: data.title || 'Без названия',
      description: data.description || '',
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      start_date: data.start_date || now,
      end_date: data.end_date || now,
      estimated_hours: data.estimated_hours ?? 0,
      created_at: now,
      updated_at: now,
    };
    mockTasks.push(newTask);
    return newTask;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
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
    mockTasks = mockTasks.filter((t) => t.id !== id);
  },

  async getSubtasks(id: string): Promise<Task[]> {
    return mockTasks.filter((t) => t.parent_task_id === id);
  },
};
