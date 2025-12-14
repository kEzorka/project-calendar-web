export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  timezone: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
  timezone: string;
  work_schedule: WorkScheduleDay[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface WorkScheduleDay {
  day_of_week: number;
  is_working_day: boolean;
  start_time?: string;
  end_time?: string;
}

export interface Task {
  id: string;
  parent_task_id: string | null;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  start_date: string;
  end_date: string;
  estimated_hours?: number;
}

export interface Assignment {
  id: string;
  task_id: string;
  user_id: string;
  role: 'owner' | 'supervisor' | 'executor' | 'hybrid' | 'spectator';
  allocated_hours?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Task;
}

