import { useCallback, useMemo, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getTodayKey, generateId } from '@/lib/dateUtils';
import type { DayData, Task, WorkSession } from '@/types';
import { subDays, format, parseISO } from 'date-fns';

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
  const { user } = useAuth();
  const [allData, setAllData] = useState<Record<string, DayData>>({});
  const [loading, setLoading] = useState(true);

  const todayKey = getTodayKey();

  // Fetch all data from database
  useEffect(() => {
    if (!user) {
      setAllData({});
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch work sessions
        const { data: sessions } = await supabase
          .from('work_sessions')
          .select('*')
          .eq('user_id', user.id);

        // Fetch tasks
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id);

        const dataMap: Record<string, DayData> = {};

        // Process work sessions
        sessions?.forEach((session) => {
          if (!dataMap[session.date]) {
            dataMap[session.date] = createEmptyDayData(session.date);
          }
          dataMap[session.date].workSession = {
            date: session.date,
            startTime: session.start_time,
            endTime: session.end_time,
            duration: (session.total_minutes || 0) * 60, // Convert minutes to seconds
            isActive: session.is_running || false,
          };
        });

        // Process tasks
        tasks?.forEach((task) => {
          if (!dataMap[task.date]) {
            dataMap[task.date] = createEmptyDayData(task.date);
          }
          dataMap[task.date].tasks.push({
            id: task.id,
            text: task.text,
            completed: task.completed || false,
            createdAt: task.created_at,
          });
        });

        setAllData(dataMap);
      } catch (error) {
        console.error('Error fetching work data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const todayData = useMemo(() => {
    return allData[todayKey] || createEmptyDayData(todayKey);
  }, [allData, todayKey]);

  // Task operations
  const addTask = useCallback(async (text: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        date: todayKey,
        text,
        completed: false,
      })
      .select()
      .single();

    if (!error && data) {
      setAllData((prev) => {
        const dayData = prev[todayKey] || createEmptyDayData(todayKey);
        return {
          ...prev,
          [todayKey]: {
            ...dayData,
            tasks: [
              ...dayData.tasks,
              {
                id: data.id,
                text: data.text,
                completed: data.completed || false,
                createdAt: data.created_at,
              },
            ],
          },
        };
      });
    }
  }, [user, todayKey]);

  const toggleTask = useCallback(async (taskId: string) => {
    if (!user) return;

    const task = todayData.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', taskId);

    if (!error) {
      setAllData((prev) => {
        const dayData = prev[todayKey] || createEmptyDayData(todayKey);
        return {
          ...prev,
          [todayKey]: {
            ...dayData,
            tasks: dayData.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          },
        };
      });
    }
  }, [user, todayKey, todayData.tasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) return;

    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (!error) {
      setAllData((prev) => {
        const dayData = prev[todayKey] || createEmptyDayData(todayKey);
        return {
          ...prev,
          [todayKey]: {
            ...dayData,
            tasks: dayData.tasks.filter((t) => t.id !== taskId),
          },
        };
      });
    }
  }, [user, todayKey]);

  // Work session operations
  const startWork = useCallback(async () => {
    if (!user) return;

    const now = new Date().toISOString();

    // Check if session exists for today
    const { data: existingSession } = await supabase
      .from('work_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', todayKey)
      .maybeSingle();

    if (existingSession) {
      // Update existing session
      const { error } = await supabase
        .from('work_sessions')
        .update({
          start_time: now,
          is_running: true,
        })
        .eq('id', existingSession.id);

      if (!error) {
        setAllData((prev) => {
          const dayData = prev[todayKey] || createEmptyDayData(todayKey);
          return {
            ...prev,
            [todayKey]: {
              ...dayData,
              workSession: {
                ...dayData.workSession,
                startTime: now,
                isActive: true,
              },
            },
          };
        });
      }
    } else {
      // Create new session
      const { error } = await supabase.from('work_sessions').insert({
        user_id: user.id,
        date: todayKey,
        start_time: now,
        is_running: true,
        total_minutes: 0,
      });

      if (!error) {
        setAllData((prev) => {
          const dayData = prev[todayKey] || createEmptyDayData(todayKey);
          return {
            ...prev,
            [todayKey]: {
              ...dayData,
              workSession: {
                date: todayKey,
                startTime: now,
                endTime: null,
                duration: dayData.workSession.duration,
                isActive: true,
              },
            },
          };
        });
      }
    }
  }, [user, todayKey]);

  const stopWork = useCallback(async () => {
    if (!user || !todayData.workSession.startTime) return;

    const startTime = new Date(todayData.workSession.startTime);
    const endTime = new Date();
    const sessionDurationSeconds = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000
    );
    const newTotalSeconds = todayData.workSession.duration + sessionDurationSeconds;
    const newTotalMinutes = Math.floor(newTotalSeconds / 60);

    const { error } = await supabase
      .from('work_sessions')
      .update({
        end_time: endTime.toISOString(),
        is_running: false,
        total_minutes: newTotalMinutes,
        start_time: null,
      })
      .eq('user_id', user.id)
      .eq('date', todayKey);

    if (!error) {
      setAllData((prev) => {
        const dayData = prev[todayKey] || createEmptyDayData(todayKey);
        return {
          ...prev,
          [todayKey]: {
            ...dayData,
            workSession: {
              ...dayData.workSession,
              endTime: endTime.toISOString(),
              duration: newTotalSeconds,
              isActive: false,
              startTime: null,
            },
          },
        };
      });
    }
  }, [user, todayKey, todayData.workSession]);

  // Analytics helpers
  const getRecentDays = useCallback(
    (count: number): DayData[] => {
      const days: DayData[] = [];
      for (let i = 0; i < count; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        days.push(allData[date] || createEmptyDayData(date));
      }
      return days.reverse();
    },
    [allData]
  );

  const getStreak = useCallback((): number => {
    let streak = 0;
    let currentDate = new Date();

    // Check if today has work, if not start from yesterday
    const todayHasWork =
      todayData.workSession.duration > 0 || todayData.workSession.isActive;
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
    loading,
    addTask,
    toggleTask,
    deleteTask,
    startWork,
    stopWork,
    getRecentDays,
    getStreak,
  };
}
