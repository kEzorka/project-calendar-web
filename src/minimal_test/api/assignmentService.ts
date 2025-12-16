// import { apiClient } from './client'; // использую мок
import type { Assignment, AssignmentData } from '../../types';
import { MOCK_ASSIGNMENTS, MOCK_TASKS } from '../../mock';
import { taskService } from '../../api/taskService';

// Создаем копию для изменений
let mockAssignments: Assignment[] = [...MOCK_ASSIGNMENTS];

const genId = () => 'assign-' + Math.random().toString(36).slice(2);

export const assignmentService = {
  async getAssignments(taskId: string): Promise<Assignment[]> {
    await new Promise((r) => setTimeout(r, 100));
    return mockAssignments.filter((a) => a.task_id === taskId);
  },

  async assignUser(taskId: string, data: AssignmentData): Promise<Assignment> {
    await new Promise((r) => setTimeout(r, 200));
    
    const newAssignment: Assignment = {
      id: genId(),
      task_id: taskId,
      user_id: data.user_id,
      role: data.role,
      allocated_hours: data.allocated_hours ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockAssignments.push(newAssignment);

    // Автоматически меняем статус задачи на "in_progress" при назначении
    try {
      const task = await taskService.getTask(taskId);
      if (task.status === 'pending') {
        await taskService.updateTask(taskId, { status: 'in_progress' });
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }

    return newAssignment;
  },

  async removeAssignment(assignmentId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    mockAssignments = mockAssignments.filter((a) => a.id !== assignmentId);
  },

  // Экспортируем для синхронизации с taskService
  getMockAssignments(): Assignment[] {
    return mockAssignments;
  },

  setMockAssignments(assignments: Assignment[]): void {
    mockAssignments = assignments;
  },
};
