// import { apiClient } from './client'; // использую мок
import type { Assignment, AssignmentData } from '../../types';

let mockAssignments: Assignment[] = [];

const genId = () => Math.random().toString(36).slice(2);

export const assignmentService = {
  async getAssignments(taskId: string): Promise<Assignment[]> {
    return mockAssignments.filter((a) => a.task_id === taskId);
  },

  async assignUser(taskId: string, data: AssignmentData): Promise<Assignment> {
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
    return newAssignment;
  },

  async removeAssignment(assignmentId: string): Promise<void> {
    mockAssignments = mockAssignments.filter((a) => a.id !== assignmentId);
  },
};
