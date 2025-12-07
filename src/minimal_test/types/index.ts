/**
 * ИСПОЛЬЗУЕТСЯ В:
 * 
 * UserSearch.tsx:
 *   import type { User } from '../minimal_test/types';
 * 
 * TaskDetailModal.tsx:
 *   import type { Task, Assignment } from '../minimal_test/types';
 */

export interface User {
  id: string;
  username: string;
  email: string;
  fullname: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startdate?: string;
  enddate?: string;
  estimatedhours?: number;
}

export interface Assignment {
  id: string;
  taskid: string;
  userid: string;
  role: 'owner' | 'supervisor' | 'executor' | 'hybrid' | 'spectator';
  allocatedhours: number;
}
