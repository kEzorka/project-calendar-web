// временно не используем apiClient, пока нет бекенда
// import { apiClient } from './client';
import type { RegisterData, LoginData, User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    // имитация сетевой задержки
    await new Promise((r) => setTimeout(r, 500));

    const fakeUser: User = {
      id: '1',
      username: data.username,
      email: data.email,
      full_name: data.full_name,
      timezone: data.timezone,
    };

    const token = 'fake-jwt-token';
    localStorage.setItem('auth_token', token);
    return { token, user: fakeUser };
  },

  async login(data: LoginData): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 500));

    const fakeUser: User = {
      id: '1',
      username: 'test',
      email: data.email,
      full_name: 'Test User',
      timezone: 'Europe/Moscow',
    };

    const token = 'fake-jwt-token';
    localStorage.setItem('auth_token', token);
    return { token, user: fakeUser };
  },

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    return {
      id: '1',
      username: 'test',
      email: 'test@example.com',
      full_name: 'Test User',
      timezone: 'Europe/Moscow',
    };
  },

  logout(): void {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
