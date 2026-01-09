import { format, startOfDay, differenceInSeconds, parseISO, isToday, subDays, isSameDay } from 'date-fns';

export function getTodayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function formatClockTime(date: Date, use24Hour: boolean, showSeconds: boolean): string {
  const hours = use24Hour 
    ? date.getHours().toString().padStart(2, '0')
    : (date.getHours() % 12 || 12).toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  if (showSeconds) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}`;
}

export function getAmPm(date: Date): string {
  return date.getHours() >= 12 ? 'PM' : 'AM';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getDateLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) {
    return 'Today';
  }
  if (isSameDay(date, subDays(new Date(), 1))) {
    return 'Yesterday';
  }
  return format(date, 'MMM d, yyyy');
}
