import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getTodayKey, generateId } from '@/lib/dateUtils';
import type { DayData, Task, WorkSession } from '@/types';
import { subDays, format, parseISO, isBefore } from 'date-fns';

const createEmptyWorkSession = (date: string): WorkSession => ({
  date,
  startTime: null,
  endTime: null,
  duration: 0,
  isActive: false,
});

const createEmptyDayData = (date: string): DayData => ({
  date,
  tasks: [],
  workSession: createEmptyWorkSession(date),
});

export function useWorkData() {
  const [allData, setAllData] = useLocalStorage<Record<string, DayData>>('workData', {});
  
  const todayKey = getTodayKey();
  
  const todayData = useMemo(() => {
    return allData[todayKey] || createEmptyDayData(todayKey);
  }, [allData, todayKey]);

  const updateTodayData = useCallback((updater: (prev: DayData) => DayData) => {
    setAllData(prev => ({
      ...prev,
      [todayKey]: updater(prev[todayKey] || createEmptyDayData(todayKey)),
    }));
  }, [setAllData, todayKey]);

  // Task operations
  const addTask = useCallback((text: string) => {
    updateTodayData(prev => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          id: generateId(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, [updateTodayData]);

  const toggleTask = useCallback((taskId: string) => {
    updateTodayData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  }, [updateTodayData]);

  const deleteTask = useCallback((taskId: string) => {
    updateTodayData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
    }));
  }, [updateTodayData]);

  // Work session operations
  const startWork = useCallback(() => {
    updateTodayData(prev => ({
      ...prev,
      workSession: {
        ...prev.workSession,
        startTime: new Date().toISOString(),
        isActive: true,
      },
    }));
  }, [updateTodayData]);

  const stopWork = useCallback(() => {
    updateTodayData(prev => {
      if (!prev.workSession.startTime) return prev;
      
      const startTime = new Date(prev.workSession.startTime);
      const endTime = new Date();
      const sessionDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      
      return {
        ...prev,
        workSession: {
          ...prev.workSession,
          endTime: endTime.toISOString(),
          duration: prev.workSession.duration + sessionDuration,
          isActive: false,
          startTime: null,
        },
      };
    });
  }, [updateTodayData]);

  // Analytics helpers
  const getRecentDays = useCallback((count: number): DayData[] => {
    const days: DayData[] = [];
    for (let i = 0; i < count; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      days.push(allData[date] || createEmptyDayData(date));
    }
    return days.reverse();
  }, [allData]);

  const getStreak = useCallback((): number => {
    let streak = 0;
    let currentDate = new Date();
    
    // Check if today has work, if not start from yesterday
    const todayHasWork = todayData.workSession.duration > 0 || todayData.workSession.isActive;
    if (!todayHasWork) {
      currentDate = subDays(currentDate, 1);
    } else {
      streak = 1;
      currentDate = subDays(currentDate, 1);
    }
    
    while (true) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const dayData = allData[dateKey];
      
      if (dayData && dayData.workSession.duration > 0) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  }, [allData, todayData]);

  return {
    todayData,
    allData,
    addTask,
    toggleTask,
    deleteTask,
    startWork,
    stopWork,
    getRecentDays,
    getStreak,
  };
}
