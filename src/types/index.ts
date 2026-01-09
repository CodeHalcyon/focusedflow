export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface WorkSession {
  date: string;
  startTime: string | null;
  endTime: string | null;
  duration: number; // in seconds
  isActive: boolean;
}

export interface ClockSettings {
  theme: 'minimal' | 'bold' | 'neon' | 'retro' | 'glass';
  size: 'small' | 'medium' | 'large' | 'xlarge';
  showSeconds: boolean;
  use24Hour: boolean;
  fontWeight: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
}

export interface DayData {
  date: string;
  tasks: Task[];
  workSession: WorkSession;
}

export type ThemeMode = 'light' | 'dark';
