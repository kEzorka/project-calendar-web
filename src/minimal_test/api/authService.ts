import { apiClient } from './client';
import type { User, WorkScheduleDay } from '../types';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullname: string;
  timezone: string;
  workschedule: WorkScheduleDay[];
}

export interface LoginData {
  email: string;
  password: string;
}

// Моковые данные
const mockUser: User = {
  id: 'mock-user-id-123',
  username: 'testuser',
  email: 'test@example.com',
  fullname: 'Test User',
  timezone: 'Europe/Moscow',
};

const mockWorkSchedule: WorkScheduleDay[] = [
  { dayofweek: 1, isworkingday: true, starttime: '09:00', endtime: '18:00' },
  { dayofweek: 2, isworkingday: true, starttime: '09:00', endtime: '18:00' },
  { dayofweek: 3, isworkingday: true, starttime: '09:00', endtime: '18:00' },
  { dayofweek: 4, isworkingday: true, starttime: '09:00', endtime: '18:00' },
  { dayofweek: 5, isworkingday: true, starttime: '09:00', endtime: '18:00' },
  { dayofweek: 6, isworkingday: false },
  { dayofweek: 7, isworkingday: false },
];

export const authService = {
  async register(data: RegisterData) {
    console.log('[MOCK] Register:', data);
    const mockToken = 'mock-jwt-token-' + Date.now();
    apiClient.setToken(mockToken);
    return {
      success: true,
      token: mockToken,
      user: mockUser,
    };
  },

  async login(data: LoginData) {
    console.log('[MOCK] Login:', data);
    const mockToken = 'mock-jwt-token-' + Date.now();
    apiClient.setToken(mockToken);
    return {
      success: true,
      token: mockToken,
      user: mockUser,
    };
  },

  async getCurrentUser(): Promise<User> {
    console.log('[MOCK] Get current user');
    return mockUser;
  },

  async getUserWorkSchedule(userId: string): Promise<WorkScheduleDay[]> {
    console.log('[MOCK] Get work schedule for user:', userId);
    return mockWorkSchedule;
  },

  logout() {
    console.log('[MOCK] Logout');
    apiClient.clearToken();
  },
};
