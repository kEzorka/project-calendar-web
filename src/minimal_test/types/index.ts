export interface User {
  id: string;
  username: string;
  email: string;
  fullname: string;
  timezone: string;
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
  parenttaskid?: string | null;
}

export interface Assignment {
  id: string;
  taskid: string;
  userid: string;
  role: 'owner' | 'supervisor' | 'executor' | 'hybrid' | 'spectator';
  allocatedhours: number;
}

export interface CalendarEvent {
  id: string;
  taskid: string;
  title: string;
  start: Date;
  end: Date;
  resource?: Task;
}

export interface WorkScheduleDay {
  dayofweek: number;
  isworkingday: boolean;
  starttime?: string;
  endtime?: string;
}
